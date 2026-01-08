# 🎵 HymnFlow v2.2.0 - Automatic Chorus Display for OBS

**HymnFlow** is a browser-based OBS Studio plugin designed to provide professional, low-latency hymn lower-thirds for worship live streams. This update (v2.2.0) focuses on optimizing the live operator's workflow by automating the repetitive task of chorus navigation.

---

### 🔥 **What's New in v2.2.0?**

#### **1. Smart Chorus Sequencing**
Most worship hymns follow a repetitive pattern where a chorus is sung after every verse. Previously, the OBS operator had to manually jump back to the chorus or add it manually into the queue.

HymnFlow v2.2.0 now handles this automatically. The navigation engine detects when a hymn has a chorus and inserts it into the sequence:
**Verse 1 → Chorus → Verse 2 → Chorus → ...**

- **Reduced Cognitive Load:** The operator only needs to press "Next" (Right Arrow) to follow the service.
- **Improved Accuracy:** No more forgetting to display the chorus or selecting the wrong verse.

#### **2. Dynamic "Chorus" Overlay Label**
The lower-third overlay now dynamically switches its status indicator. Instead of showing "Verse X/Y", it displays a clear "**Chorus**" label when the chorus is active, providing clear context for the viewing audience.

#### **3. Functional "Jump to Chorus"**
The dedicated "Jump to Chorus" button in the dock is now fully functional, allowing an operator to skip directly to the refrain at any moment during spontaneous worship.

---

### 🎨 **About HymnFlow**
HymnFlow remains the most streamlined way to manage hymns in OBS:
- **Zero-Latency:** Pure browser localStorage communication (no server required).
- **Customizable:** Control font, size, outlines, gradients, and animations from the Dock.
- **Service Scheduling:** Pre-plan your hymn order before the service starts.
- **Lightweight:** Works as a standard Custom Browser Dock and Browser Source.

### 📥 **Download & Setup**
- **Repository:** [HymnFlow on GitHub](https://github.com/ebena107/HymnFlow)
- **Setup:** Add `obs-dock/index.html` as a Custom Dock and `obs-overlay/index.html` as a Browser Source (1920x1080).

---
*Questions or feedback? Join our discussion on the GitHub repository!*
