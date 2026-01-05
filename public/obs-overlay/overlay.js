(() => {
  const overlayEl = document.getElementById('overlay');
  const titleBarEl = document.getElementById('titleBar');
  const contentEl = document.getElementById('content');
  const STORAGE_KEY = 'hymnflow-lowerthird-command';
  let isVisible = false;

  function applyStyles(settings) {
    const s = settings;
    contentEl.style.fontFamily = s.fontFamily;
    contentEl.style.fontSize = s.fontSize + 'px';
    contentEl.style.fontWeight = s.bold ? '700' : '400';
    contentEl.style.fontStyle = s.italic ? 'italic' : 'normal';
    contentEl.style.color = s.textColor;

    let shadow = '';
    if (s.shadow) shadow += '0 2px 8px rgba(0,0,0,0.8)';
    if (s.glow) shadow += (shadow ? ', ' : '') + `0 0 20px ${s.textColor}`;
    contentEl.style.textShadow = shadow;
    titleBarEl.style.textShadow = shadow;

    // Apply text outline (stroke)
    if (s.outline) {
      contentEl.style.webkitTextStrokeWidth = s.outlineWidth + 'px';
      contentEl.style.webkitTextStrokeColor = s.outlineColor;
      titleBarEl.style.webkitTextStrokeWidth = s.outlineWidth + 'px';
      titleBarEl.style.webkitTextStrokeColor = s.outlineColor;
    } else {
      contentEl.style.webkitTextStrokeWidth = '0';
      titleBarEl.style.webkitTextStrokeWidth = '0';
    }

    if (s.bgType === 'transparent') {
      titleBarEl.style.background = 'transparent';
      contentEl.style.background = 'transparent';
    } else if (s.bgType === 'solid') {
      titleBarEl.style.background = s.bgColorA;
      contentEl.style.background = s.bgColorA;
    } else if (s.bgType === 'gradient') {
      const grad = `linear-gradient(135deg, ${s.bgColorA}, ${s.bgColorB})`;
      titleBarEl.style.background = grad;
      contentEl.style.background = grad;
    }

    overlayEl.className = `overlay ${s.position}`;
  }

  function show(data) {
    const { title, verseNumber, totalVerses, lines, settings } = data;
    const hymnNumber = data.metadata?.number ? `${data.metadata.number} • ` : '';
    
    console.log('[Overlay] Show command received:', { title, verseNumber, lines });
    
    applyStyles(settings);

    titleBarEl.textContent = `${hymnNumber}${title} • Verse ${verseNumber}/${totalVerses}`;
    
    // Ensure lines is an array and join properly
    const displayText = Array.isArray(lines) ? lines.join('\n') : String(lines);
    contentEl.textContent = displayText;
    
    console.log('[Overlay] Content set to:', contentEl.textContent);

    overlayEl.classList.remove('hidden', 'fade-out', 'slide-out');
    overlayEl.classList.add('visible');

    if (settings.animation === 'fade') {
      overlayEl.classList.add('fade-in');
    } else if (settings.animation === 'slide') {
      overlayEl.classList.add('slide-in');
    }
    isVisible = true;
  }

  function hide(settings) {
    if (!isVisible) return;
    overlayEl.classList.remove('fade-in', 'slide-in');
    if (settings && settings.animation === 'fade') {
      overlayEl.classList.add('fade-out');
    } else if (settings && settings.animation === 'slide') {
      overlayEl.classList.add('slide-out');
    }
    setTimeout(() => {
      overlayEl.classList.add('hidden');
      overlayEl.classList.remove('visible', 'fade-out', 'slide-out');
    }, 600);
    isVisible = false;
  }

  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY || !e.newValue) return;
    try {
      const cmd = JSON.parse(e.newValue);
      console.log('[Overlay] Storage event received:', cmd.type, cmd);
      if (cmd.type === 'show') {
        show(cmd);
      } else if (cmd.type === 'hide') {
        hide(cmd.settings);
      }
    } catch (err) {
      console.error('Overlay error:', err);
    }
  });

  // Initial state
  overlayEl.classList.add('hidden');
})();
