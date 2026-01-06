# HymnFlow Optimization Testing Guide

Quick reference for testing the newly implemented optimizations.

---

## 🧪 Quick Test Suite (15 minutes)

### Test 1: Data Validation ✅

**Test invalid hymn import:**
```txt
Title: Test Hymn
Author: Test Author

```

**Expected:** Console warning: "Skipping invalid hymn: At least one verse is required"  
**Result:** Hymn should NOT be imported

**Test valid hymn import:**
```txt
Title: Valid Hymn
Author: Test Author

First verse line 1
First verse line 2

Second verse line 1
```

**Expected:** Import success message  
**Result:** Hymn should be imported with 2 verses

---

### Test 2: XSS Prevention 🔒

**Test script injection:**
1. Click "+ Add" to create new hymn
2. Enter title: `<script>alert('XSS')</script>`
3. Enter author: `<img src=x onerror="alert('XSS')">`
4. Add one verse with any text
5. Save hymn

**Expected:** No alert box appears, HTML is displayed as text  
**Result:** Title displays as `<script>alert('XSS')</script>` in list

---

### Test 3: Search Performance ⚡

**Setup:**
1. Import a large hymn file (100+ hymns) OR
2. Use the default hymn library

**Test:**
1. Click in search box
2. Type rapidly: "amazing grace worship"
3. Observe no UI lag or freeze

**Expected:** Search results update smoothly with ~150ms delay  
**Result:** No browser lag, debounced search

**Console check:**
```javascript
// Open browser console (F12)
// Search index should be built on load
console.log('Search index built:', searchIndex.length > 0);
```

---

### Test 4: Real-Time Settings Update ✨

**Setup:**
1. Select any hymn from library
2. Click "Display" toggle to show overlay on stream

**Test all settings:**
1. Drag "Font Size" slider → Overlay updates immediately
2. Change "Text Color" → Overlay updates immediately  
3. Toggle "Bold" → Overlay updates immediately
4. Change "Background Type" → Overlay updates immediately
5. Drag "Lines per display" → Overlay AND preview update

**Expected:** Every setting change applies to overlay instantly (no navigation required)  
**Result:** Settings reflect on overlay in real-time

---

### Test 5: Accessibility ♿

**Keyboard Navigation Test:**
1. Press `Tab` key repeatedly
2. Verify focus moves through all controls
3. Verify focus is visible (outline)

**Expected:** Can reach all buttons, inputs, and controls via Tab  
**Result:** Full keyboard navigation

**Screen Reader Test (Optional - requires NVDA/VoiceOver):**
1. Enable screen reader
2. Navigate hymn list
3. Verify announcements: "Amazing Grace, John Newton, 4 verses"

**Expected:** Screen reader announces hymn details  
**Result:** ARIA labels provide context

---

### Test 6: ID Collision Prevention 🔑

**Fast import test:**
```javascript
// Open browser console (F12)
// Run this to test ID generation:
const ids = [];
for (let i = 0; i < 100; i++) {
  ids.push(generateUniqueHymnId());
}
const uniqueIds = new Set(ids);
console.log('Generated:', ids.length, 'Unique:', uniqueIds.size);
// Should show: Generated: 100 Unique: 100
```

**Expected:** 100 unique IDs generated (no duplicates)  
**Result:** All IDs are unique even in rapid generation

---

## 🐛 Edge Case Tests

### Edge Case 1: Empty Import File
**Action:** Import a TXT file with only:
```txt
Title: 
```

**Expected:** Import fails with error  
**Result:** No hymns imported, error message shown

---

### Edge Case 2: Malformed JSON
**Action:** Import JSON file:
```json
[
  { "title": "Test", "verses": "not an array" }
]
```

**Expected:** Validation error, hymn skipped  
**Console:** Warning message with validation errors

---

### Edge Case 3: Service with Deleted Hymn
**Action:**
1. Create service with 3 hymns
2. Delete one of those hymns
3. Load the service

**Expected:** Service loads, skips deleted hymn silently  
**Result:** Service shows 2 hymns (deleted one skipped)

---

## 📊 Performance Benchmarks

### Search Performance Test:

**Test with 500 hymns:**
```javascript
// Console test
console.time('search');
await performSearch('grace');
console.timeEnd('search');
// Should be < 5ms
```

**Expected:** Search completes in <5ms  
**Before optimization:** ~40ms

---

### Render Performance Test:

**Test large list rendering:**
```javascript
// Console test
console.time('render');
renderList();
console.timeEnd('render');
// Should be < 50ms for 500 hymns
```

**Expected:** Render completes quickly even with 500+ hymns

---

## ✅ Acceptance Criteria

All tests pass if:

- [x] Invalid hymns are rejected with clear error messages
- [x] XSS attacks prevented (no script execution)
- [x] Search is responsive with no UI lag
- [x] Settings update overlay in real-time
- [x] Full keyboard navigation works
- [x] Screen reader announces content properly
- [x] No ID collisions on batch imports
- [x] Edge cases handled gracefully

---

## 🔍 Console Verification

**Check for implementation:**
```javascript
// Open browser console in OBS dock
// Verify modules loaded:
console.log('HymnValidator:', typeof HymnValidator); // "object"
console.log('escapeHtml:', typeof escapeHtml); // "function"
console.log('generateUniqueHymnId:', typeof generateUniqueHymnId); // "function"
console.log('performSearch:', typeof performSearch); // "function"
console.log('buildSearchIndex:', typeof buildSearchIndex); // "function"
```

**All should return expected types** (not "undefined")

---

## 📝 Bug Reporting Template

If you find issues, report with:

```markdown
**Issue:** [Brief description]
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected:** [What should happen]
**Actual:** [What actually happened]
**Browser:** [Chrome/Firefox/Edge]
**Console Errors:** [Copy any errors from F12 console]
**Screenshot:** [If applicable]
```

---

## 🎯 Priority Testing Order

1. **Data Validation** (prevents corruption)
2. **XSS Prevention** (security critical)
3. **Settings Auto-Update** (user experience)
4. **Search Performance** (performance critical for large libraries)
5. **Accessibility** (compliance)

Test in this order for maximum efficiency.

