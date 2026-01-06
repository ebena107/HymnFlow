---
name: Dock Enhancements for v2.1
about: Three enhancement requests for HymnFlow OBS Dock
title: "[FEATURE] Text Outline Styling, Hymn Editing, and Service Scheduling"
labels: enhancement, dock, styling, editor, scheduling
assignees: ''
---

## 💡 Feature Ideas

Three enhancements to improve HymnFlow OBS Dock functionality and user experience.

### 1. Text Outline Styling

**What would you like?**
Add text outline (stroke) option to the styling controls with customizable outline color.

**Why do you need it?**
Text outlines improve readability when displaying hymns over complex backgrounds or video feeds. This is a common requirement in live worship displays where contrast is critical.

**How should it work?**
- Add a checkbox for "Outline" in the Styles section (similar to Bold, Italic, Shadow, Glow)
- When checked, show an "Outline Color" color picker and "Outline Width" slider (1-5px)
- Apply CSS `text-stroke` or `-webkit-text-stroke` to the overlay content
- Save outline settings to localStorage preferences

**Acceptance Criteria:**
- [ ] "Outline" checkbox added to Styles section in dock
- [ ] Outline Color picker appears when outline is enabled
- [ ] Outline Width slider (1-5px) appears when outline is enabled
- [ ] Overlay applies outline styling using `-webkit-text-stroke-width` and `-webkit-text-stroke-color`
- [ ] Settings persist in localStorage
- [ ] Works across all browsers (Chrome/Edge for OBS)

---

### 2. Hymn Editing

**What would you like?**
Add ability to edit existing hymns directly in the dock to fix typos or make corrections without re-importing.

**Why do you need it?**
Currently, if there's a typo in a hymn text, users must either:
- Manually edit the localStorage JSON (technical)
- Delete and re-import the hymn (loses metadata)
- Live with the error

An edit feature would allow quick corrections during preparation or even during service.

**How should it work?**
- Add an "Edit" button next to the "+ Add" and "- Remove" buttons (or in a context menu)
- When clicked, open a modal/form with:
  - Title (text input)
  - Author (text input)
  - Hymn Number (number input for metadata.number)
  - Verses (textarea with clear separation, e.g., blank line between verses)
  - Chorus (textarea, optional)
- Save changes back to the hymns array and localStorage
- Refresh the list and preview

**Visual mockup:**
```
[+ Add] [✏️ Edit] [- Remove]
```

Or right-click context menu on hymn list item:
```
• Select Hymn
• Edit Hymn
• Delete Hymn
```

**Acceptance Criteria:**
- [ ] "Edit" button added to Hymns section (or context menu on list items)
- [ ] Edit form/modal opens with current hymn data pre-filled
- [ ] User can modify title, author, number, verses, and chorus
- [ ] Changes save to localStorage
- [ ] List and preview refresh after edit
- [ ] No data loss or ID changes (maintain hymn ID)
- [ ] Validation: title and at least one verse required

---

### 3. Service/Program Scheduling

**What would you like?**
Add ability to create and schedule hymn sets for specific services, programs, or events.

**Why do you need it?**
Worship services typically follow a planned order of hymns. A scheduling feature would:
- Pre-organize hymns for a service
- Allow quick navigation through the planned sequence
- Prevent searching/selecting during live service
- Support multiple services (Sunday morning, evening, Wednesday, special events)

**How should it work?**

**Option A: Service Playlist**
- Add "Services" section above or below Hymns section
- Create named services (e.g., "Sunday Morning - Jan 5", "New Year Service")
- Drag or add hymns to a service in order
- Load a service to see only those hymns in the planned sequence
- Navigate with Previous/Next automatically following the service order

**Option B: Simple Queue**
- Add "Queue for Service" button next to each hymn
- Build a temporary queue in session
- Display queue panel showing ordered hymns
- Navigate through queue during service
- Clear queue after service

**Visual mockup (Option A):**
```
┌─────────────────────────┐
│ Services                │
│ [+ New Service]         │
│                         │
│ ▶ Sunday Morning - Jan 5│
│   1. Hymn 23            │
│   2. Hymn 45            │
│   3. Hymn 120           │
│                         │
│ ○ Wednesday Evening     │
│ ○ Special Service       │
└─────────────────────────┘
```

**Acceptance Criteria:**
- [ ] Add "Services" or "Queue" section to dock
- [ ] Create/name new service/program
- [ ] Add hymns to service in order
- [ ] Reorder hymns within service (drag-drop or up/down buttons)
- [ ] Load/activate a service
- [ ] Navigate through service hymns sequentially
- [ ] Save services to localStorage (key: `hymnflow-services`)
- [ ] Delete/clear services
- [ ] Export service as text/PDF for planning

---

## 🔗 Alternatives Considered

**Text Outline:** Users currently use Shadow or Glow, but these don't provide the same crisp edge definition as a proper stroke.

**Hymn Editing:** Users can manually edit localStorage JSON in browser DevTools, but this is error-prone and not user-friendly.

**Scheduling:** Users currently write hymn numbers on paper or use separate documents, then search for each hymn manually during service.

---

## 🎯 Priority Suggestion

1. **High:** Hymn Editing - Quick wins for usability
2. **Medium:** Text Outline - Improves display quality significantly
3. **Low/Future:** Service Scheduling - Powerful but more complex to implement

---

**Note:** These features can be implemented independently in phases for v2.1, v2.2, etc.
