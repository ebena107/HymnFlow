"""
hymnflow-obs-hotkeys.py  —  OBS Script for HymnFlow global hotkeys
===================================================================
Drop into OBS:  Tools → Scripts → (+) → select this file
Then bind keys: OBS Settings → Hotkeys → search "HymnFlow"

Requires OBS 28+ with obs-websocket enabled
(Tools → obs-websocket Settings → Enable WebSocket server).

This script registers 7 hotkeys in OBS's hotkey system and fires each
one by broadcasting a BroadcastCustomEvent to obs-websocket, which
the HymnFlow browser dock receives and acts on.
"""

import base64
import hashlib
import json
import os
import socket
import struct
import threading

import obspython as obs

# ---------------------------------------------------------------------------
# Hotkey definitions
# ---------------------------------------------------------------------------
HOTKEYS = [
    ('hymnflow.next_verse',     'HymnFlow: Next Verse',           'next_verse'),
    ('hymnflow.prev_verse',     'HymnFlow: Previous Verse',       'prev_verse'),
    ('hymnflow.next_line',      'HymnFlow: Next Line',            'next_line'),
    ('hymnflow.prev_line',      'HymnFlow: Previous Line',        'prev_line'),
    ('hymnflow.next_item',      'HymnFlow: Next Service Item',    'next_item'),
    ('hymnflow.prev_item',      'HymnFlow: Previous Service Item','prev_item'),
    ('hymnflow.toggle_display', 'HymnFlow: Toggle Display',       'toggle_display'),
]

_hotkey_ids = {}
_script_settings = None   # kept alive for callback reads

# ---------------------------------------------------------------------------
# Minimal stdlib WebSocket client for obs-websocket 5.x
# ---------------------------------------------------------------------------

def _sha256_b64(s: str) -> str:
    return base64.b64encode(hashlib.sha256(s.encode('utf-8')).digest()).decode('utf-8')


def _ws_frame(payload: str) -> bytes:
    """Build a masked client-side WebSocket text frame."""
    data = payload.encode('utf-8')
    mask = os.urandom(4)
    n = len(data)
    header = bytearray([0x81])          # FIN + opcode text
    if n < 126:
        header.append(0x80 | n)
    elif n < 65536:
        header.append(0x80 | 126)
        header += struct.pack('>H', n)
    else:
        header.append(0x80 | 127)
        header += struct.pack('>Q', n)
    header += mask
    masked = bytearray(b ^ mask[i % 4] for i, b in enumerate(data))
    return bytes(header) + bytes(masked)


def _ws_recv(sock: socket.socket) -> str:
    """Read one complete WebSocket text frame from the socket."""
    def read_exact(n):
        buf = b''
        while len(buf) < n:
            chunk = sock.recv(n - len(buf))
            if not chunk:
                raise ConnectionError('obs-websocket closed unexpectedly')
            buf += chunk
        return buf

    header = read_exact(2)
    length = header[1] & 0x7F
    if length == 126:
        length = struct.unpack('>H', read_exact(2))[0]
    elif length == 127:
        length = struct.unpack('>Q', read_exact(8))[0]
    return read_exact(length).decode('utf-8')


def _fire_event(host: str, port: int, password: str, action: str):
    """Connect to obs-websocket, authenticate, and broadcast a HymnFlow action."""
    try:
        sock = socket.create_connection((host, port), timeout=3)
        try:
            # --- WebSocket upgrade ---
            ws_key = base64.b64encode(os.urandom(16)).decode()
            upgrade = (
                f"GET / HTTP/1.1\r\n"
                f"Host: {host}:{port}\r\n"
                f"Upgrade: websocket\r\n"
                f"Connection: Upgrade\r\n"
                f"Sec-WebSocket-Key: {ws_key}\r\n"
                f"Sec-WebSocket-Version: 13\r\n\r\n"
            )
            sock.sendall(upgrade.encode())

            resp = b''
            while b'\r\n\r\n' not in resp:
                resp += sock.recv(4096)
            if b'101' not in resp:
                print(f'[HymnFlow] WebSocket upgrade failed')
                return

            # --- op 0: Hello ---
            hello = json.loads(_ws_recv(sock))
            if hello.get('op') != 0:
                print(f'[HymnFlow] Expected Hello (op 0), got op {hello.get("op")}')
                return

            # --- op 1: Identify (with optional auth) ---
            auth_str = None
            auth_info = hello['d'].get('authentication')
            if auth_info and password:
                secret   = _sha256_b64(password + auth_info['salt'])
                auth_str = _sha256_b64(secret + auth_info['challenge'])

            identify = {'op': 1, 'd': {'rpcVersion': 1, 'eventSubscriptions': 0}}
            if auth_str:
                identify['d']['authentication'] = auth_str
            sock.sendall(_ws_frame(json.dumps(identify)))

            # --- op 2: Identified ---
            identified = json.loads(_ws_recv(sock))
            if identified.get('op') != 2:
                print(f'[HymnFlow] Auth failed — check obs-websocket password')
                return

            # --- op 6: BroadcastCustomEvent ---
            request = {
                'op': 6,
                'd': {
                    'requestType': 'BroadcastCustomEvent',
                    'requestId': f'hf-{action}',
                    'requestData': {
                        'eventData': {
                            'source': 'hymnflow',
                            'action': action
                        }
                    }
                }
            }
            sock.sendall(_ws_frame(json.dumps(request)))
            _ws_recv(sock)   # op 7: RequestResponse — discard

        finally:
            sock.close()

    except ConnectionRefusedError:
        print(f'[HymnFlow] obs-websocket not reachable at {host}:{port}')
    except Exception as e:
        print(f'[HymnFlow] obs-websocket error: {e}')


def _dispatch(action: str):
    """Called from hotkey callback — runs the network call on a daemon thread."""
    if _script_settings is None:
        return
    host     = obs.obs_data_get_string(_script_settings, 'obs_ws_host') or '127.0.0.1'
    port     = obs.obs_data_get_int(_script_settings, 'obs_ws_port') or 4455
    password = obs.obs_data_get_string(_script_settings, 'obs_ws_password') or ''
    threading.Thread(target=_fire_event, args=(host, port, password, action), daemon=True).start()

# ---------------------------------------------------------------------------
# OBS Script API
# ---------------------------------------------------------------------------

def script_description():
    return (
        '<b>HymnFlow Hotkeys</b><br>'
        'Registers global OBS hotkeys for HymnFlow controls.<br>'
        'After loading: bind keys in <b>Settings → Hotkeys</b> (search "HymnFlow").<br>'
        'Requires obs-websocket enabled (Tools → obs-websocket Settings).'
    )


def script_properties():
    props = obs.obs_properties_create()
    obs.obs_properties_add_text(
        props, 'obs_ws_host', 'obs-websocket Host', obs.OBS_TEXT_DEFAULT)
    obs.obs_properties_add_int(
        props, 'obs_ws_port', 'obs-websocket Port', 1024, 65535, 1)
    obs.obs_properties_add_text(
        props, 'obs_ws_password', 'obs-websocket Password', obs.OBS_TEXT_PASSWORD)
    return props


def script_defaults(settings):
    obs.obs_data_set_default_string(settings, 'obs_ws_host', '127.0.0.1')
    obs.obs_data_set_default_int(settings, 'obs_ws_port', 4455)
    obs.obs_data_set_default_string(settings, 'obs_ws_password', '')


def script_load(settings):
    global _script_settings
    _script_settings = settings

    for hk_name, hk_desc, action in HOTKEYS:
        def make_cb(a):
            def cb(pressed):
                if pressed:
                    _dispatch(a)
            return cb

        hk_id = obs.obs_hotkey_register_frontend(hk_name, hk_desc, make_cb(action))
        _hotkey_ids[hk_name] = hk_id

        saved = obs.obs_data_get_array(settings, f'hotkey_{hk_name}')
        obs.obs_hotkey_load(hk_id, saved)
        obs.obs_data_array_release(saved)


def script_save(settings):
    for hk_name, hk_id in _hotkey_ids.items():
        arr = obs.obs_hotkey_save(hk_id)
        obs.obs_data_set_array(settings, f'hotkey_{hk_name}', arr)
        obs.obs_data_array_release(arr)


def script_unload():
    global _script_settings
    _script_settings = None
    _hotkey_ids.clear()
