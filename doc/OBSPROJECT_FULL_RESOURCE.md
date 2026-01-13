# 🎵 HymnFlow - Pro Grade Hymn Lower-Thirds for OBS Studio

**HymnFlow** is a lightweight, high-performance OBS Studio plugin designed specifically for church worship teams, ministry broadcasters, and A/V operators. It provides a professional, fully customizable lower-third display system that runs entirely within OBS—no external servers or complex networking required.

---

### ✨ **Key Features**

#### 🎮 **Advanced Control Dock**
A custom browser dock that puts full control at your fingertips:
- **Comprehensive Management:** Add, edit, delete, and search your entire hymn library directly within OBS.
- **Service Scheduling:** Pre-plan your service by organizing hymns into a named "Service Program" for a seamless live workflow.
- **Instant Search:** Find hymns by number, title, or author in milliseconds with an optimized search engine.
- **Smart Navigation:** Use your keyboards' arrow keys to navigate verses and line windows. The system automatically transitions between verses at line boundaries.

#### 📺 **Professional Lower-Third Overlay**
A sleek, responsive overlay tailored for high-quality broadcasts:
- **Real-Time Updates:** The overlay synchronizes instantly with the control dock using browser `localStorage` events.
- **Dynamic Labeling:** Automatically displays the hymn title, author, and current verse. New in v2.2.0: **Automatic Chorus detection and labeling**.
- **Visual Feedback:** The dock provides real-time state indicators (e.g., pulsing red when live on stream).

#### 🎨 **Total Styling Control**
Customize every pixel to match your church's branding:
- **Typography:** Choose from 5+ modern fonts, adjust size, and apply bold/italic effects.
- **Text Effects:** Add crisp **Text Outlines**, Soft Shadows, or Glow effects for maximum readability over complex video backgrounds.
- **Backgrounds:** Supports Transparent backgrounds (ideal for overlays), Solid colors, or beautiful Dual-Color Gradients.
- **Animations:** Smooth Fade in/out and Slide transitions for that professional broadcast feel.

---

### 🚀 **Quick Setup (Under 2 Minutes)**

#### **1. Add the Control Dock**
- Go to **View → Docks → Custom Browser Docks**.
- Name it `HymnFlow Control`.
- URL: `file:///C:/path/to/HymnFlow/public/obs-dock/index.html`.

#### **2. Add the Browser Source**
- Add a new **Browser Source** named `Hymn Lower-Third`.
- URL: `file:///C:/path/to/HymnFlow/public/obs-overlay/index.html`.
- Set Width: `1920`, Height: `1080`.
- Check ✅ **Shutdown source when not visible**.

#### **3. Import & Go!**
- Click **Import** in the dock.
- Select your `.txt` or `.json` hymn file (or use the included default library).
- Click a hymn title, and you're live!

---

### 📂 **Import/Export Formats**
HymnFlow supports simple, human-readable formats:
- **TXT:** Just `Title: Name` followed by verses separated by blank lines.
- **JSON:** Standardized arrays for bulk imports and backups.

---

### 🏗️ **Technical Excellence**
- **Zero Latency:** No Node.js, no WebSockets, no lag. Pure vanilla JavaScript using standard browser APIs.
- **Portable:** Can run entirely from a USB drive using the `file://` protocol.
- **Offline First:** Works perfectly without an internet connection.
- **License:** Open-source (GPL-2.0), same as OBS Studio itself.

---
**HymnFlow was built with love for worship teams everywhere.** Stay focused on the ministry while we handle the technology.

🔗 **GitHub Repository:** [https://github.com/ebena107/HymnFlow](https://github.com/ebena107/HymnFlow)
📖 **Setup Guide:** [Full Documentation](https://github.com/ebena107/HymnFlow/blob/main/doc/OBS_DOCK_README.md)
