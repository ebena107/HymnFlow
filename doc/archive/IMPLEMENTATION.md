# HymnView Implementation Plan

## Project Overview

**HymnView** is an OBS Studio plugin designed to display hymns during worship services. It consists of a web-based control panel for managing hymns and a browser source display that integrates seamlessly with OBS.

## Architecture

### Technology Stack

- **Backend**: Node.js with Express.js
- **Real-time Communication**: WebSocket (ws library)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: JSON file-based database
- **File Processing**: Custom parsers for TXT, CSV, JSON formats

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    OBS Studio                                │
│  ┌────────────────┐              ┌────────────────┐         │
│  │ Browser Source │              │ Custom Dock    │         │
│  │   (Display)    │              │   (Control)    │         │
│  └────────┬───────┘              └────────┬───────┘         │
└───────────┼──────────────────────────────┼─────────────────┘
            │                              │
            │         WebSocket            │
            └──────────┬───────────────────┘
                       │
            ┌──────────▼──────────┐
            │   Express Server    │
            │   (Port 3000)       │
            └──────────┬──────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐    ┌────▼────┐   ┌────▼────┐
   │  REST   │    │   WS    │   │ Static  │
   │  API    │    │ Server  │   │  Files  │
   └────┬────┘    └─────────┘   └─────────┘
        │
   ┌────▼────────────────────┐
   │  Hymns Database         │
   │  (hymns.json)           │
   └─────────────────────────┘
```

## Implementation Phases

### Phase 1: Project Foundation ✅

**Objectives:**

- Set up project structure
- Configure Node.js environment
- Initialize package management

**Deliverables:**

- `package.json` with dependencies
- `.gitignore` for version control
- Directory structure

**Dependencies Installed:**

```json
{
  "express": "^4.18.2",
  "multer": "^1.4.5-lts.1",
  "ws": "^8.14.2",
  "cors": "^2.8.5"
}
```

**Directory Structure:**

```
HymnView/
├── server/
│   ├── routes/
│   ├── parsers/
│   └── data/
├── public/
│   ├── control/
│   └── display/
└── doc/
```

### Phase 2: Backend Server Development ✅

**Objectives:**

- Create Express server with WebSocket support
- Implement RESTful API for hymn management
- Set up file upload handling

**Components Built:**

#### 2.1 Main Server (`server/server.js`)

- Express application setup
- CORS middleware configuration
- Static file serving
- WebSocket server initialization
- Route mounting
- Data directory initialization

**Key Features:**

- Real-time bidirectional communication via WebSocket
- RESTful API endpoints
- Automatic data directory creation
- Client connection management

#### 2.2 Hymn Routes (`server/routes/hymns.js`)

**Endpoints:**

- `GET /api/hymns` - Retrieve all hymns
- `GET /api/hymns/:id` - Get single hymn by ID
- `POST /api/hymns` - Create new hymn
- `PUT /api/hymns/:id` - Update existing hymn
- `DELETE /api/hymns/:id` - Remove hymn
- `GET /api/hymns/search/:query` - Search hymns

**Search Implementation:**

- Title matching
- Author matching
- Content (verse) matching
- Case-insensitive filtering

#### 2.3 Upload Routes (`server/routes/upload.js`)

**Features:**

- Multer-based file upload handling
- Format validation (.txt, .csv, .json)
- Parser routing based on file extension
- Automatic cleanup of uploaded files
- Batch hymn insertion

### Phase 3: File Parser Development ✅

**Objectives:**

- Implement parsers for multiple file formats
- Ensure data normalization
- Handle edge cases and errors

#### 3.1 TXT Parser (`server/parsers/txtParser.js`)

**Format Specification:**

```
Title: [Hymn Title]
Author: [Author Name]

Verse 1 text
Multiple lines supported

Verse 2 text

Chorus:
Optional chorus text
```

**Features:**

- Multi-line verse support
- Optional author field
- Optional chorus field
- Automatic verse separation
- Whitespace handling

#### 3.2 CSV Parser (`server/parsers/csvParser.js`)

**Format Specification:**

```csv
Title,Author,Verse Number,Verse Text,Chorus
"Hymn Title","Author",1,"Verse text here","Chorus text"
```

**Features:**

- Quoted field handling
- Multi-row hymn aggregation
- Flexible column naming (case-insensitive)
- Missing field tolerance

#### 3.3 JSON Parser (`server/parsers/jsonParser.js`)

**Format Specification:**

```json
{
  "hymns": [
    {
      "title": "Hymn Title",
      "author": "Author Name",
      "verses": ["Verse 1", "Verse 2"],
      "chorus": "Optional",
      "metadata": {}
    }
  ]
}
```

**Features:**

- Direct array support
- Wrapped object support (`{ hymns: [] }`)
- Data validation
- Field normalization

### Phase 4: Control Panel Interface ✅

**Objectives:**

- Build intuitive control interface
- Implement real-time updates
- Create hymn management UI

#### 4.1 HTML Structure (`public/control/index.html`)

**Sections:**

1. **Header** - Branding and connection status
2. **Controls** - Verse navigation and display controls
3. **Settings** - Display customization panel
4. **Upload** - File import interface
5. **Library** - Hymn browsing and search

#### 4.2 Styling (`public/control/control.css`)

**Design Principles:**

- Dark theme (OBS-compatible)
- High contrast for readability
- Responsive grid layout
- Smooth transitions
- Hover effects for interactivity

**Key Styles:**

- Color scheme: Dark backgrounds (#1e1e1e, #2d2d2d)
- Accent color: Green (#4CAF50)
- Typography: System fonts for performance
- Button states: Normal, hover, disabled

#### 4.3 Control Logic (`public/control/control.js`)

**HymnControl Class:**

```javascript
class HymnControl {
  - hymns: Array
  - currentHymn: Object
  - currentVerseIndex: Number
  - ws: WebSocket
  - settings: Object
}
```

**Core Methods:**

- `loadHymns()` - Fetch hymn library from API
- `selectHymn(id)` - Set active hymn
- `displayVerse()` - Send verse to display
- `nextVerse()` - Navigate forward
- `previousVerse()` - Navigate backward
- `resetHymn()` - Return to first verse
- `blankScreen()` - Clear display
- `uploadFile()` - Import hymns
- `searchHymns(query)` - Filter library
- `applySettings()` - Update display styling

**WebSocket Communication:**

```javascript
{
  type: 'display',
  hymn: {
    title: String,
    author: String,
    verse: String,
    verseNumber: Number,
    totalVerses: Number
  },
  settings: {
    fontSize: Number,
    fontColor: String,
    bgColor: String,
    textAlign: String
  }
}
```

### Phase 5: Display Browser Source ✅

**Objectives:**

- Create clean, readable display
- Implement smooth transitions
- Support customization
- Ensure OBS compatibility

#### 5.1 HTML Structure (`public/display/index.html`)

**Minimal Structure:**

- Single container div
- Dynamic content area
- No UI chrome for clean display

#### 5.2 Display Styling (`public/display/display.css`)

**Features:**

- Transparent background support
- Centered content layout
- Text shadows for readability
- Smooth fade/slide animations
- Responsive font scaling

**Animation System:**

```css
.fade-in { animation: fadeIn 0.5s ease-in; }
.slide-in { animation: slideIn 0.5s ease-out; }
```

**Responsive Breakpoints:**

- 1920px: Full HD display
- 1280px: HD display
- 768px: Smaller displays

#### 5.3 Display Logic (`public/display/display.js`)

**HymnDisplay Class:**

```javascript
class HymnDisplay {
  - container: Element
  - content: Element
  - ws: WebSocket
  - currentSettings: Object
}
```

**Core Methods:**

- `handleMessage(data)` - Process WebSocket messages
- `displayHymn(hymn, settings)` - Render hymn content
- `blankScreen()` - Clear display
- `updateSettings(settings)` - Apply styling
- `applySettings()` - Update CSS properties
- `escapeHtml(text)` - Security sanitization

**Message Types:**

1. `display` - Show hymn verse
2. `blank` - Clear screen
3. `settings` - Update styling

### Phase 6: Data Layer & Sample Content ✅

**Objectives:**

- Create hymn database structure
- Populate with sample hymns
- Ensure data integrity

#### 6.1 Database Schema

```json
{
  "hymns": [
    {
      "id": "hymn_001",
      "title": "String",
      "author": "String",
      "verses": ["String"],
      "chorus": "String",
      "metadata": {
        "category": "String",
        "key": "String",
        "tempo": "String"
      },
      "createdAt": "ISO8601"
    }
  ]
}
```

#### 6.2 Sample Data

**Included Hymns:**

1. **Amazing Grace** - John Newton (4 verses)
2. **How Great Thou Art** - Carl Boberg (4 verses + chorus)
3. **Holy, Holy, Holy** - Reginald Heber (4 verses)

### Phase 7: Documentation ✅

**Objectives:**

- Provide comprehensive README
- Document installation process
- Include usage examples
- Create troubleshooting guide

**Documents Created:**

1. `README.md` - User-facing documentation
2. `IMPLEMENTATION.md` - Technical documentation (this file)

## Technical Specifications

### Data Flow

#### Hymn Display Flow

```
1. User selects hymn in Control Panel
2. Control Panel sends WebSocket message
3. Display receives message via WebSocket
4. Display renders hymn with fade-in animation
5. Content is shown in OBS browser source
```

#### File Upload Flow

```
1. User selects file in Control Panel
2. File uploaded via multipart/form-data
3. Server saves to temporary location
4. Parser processes based on extension
5. Parsed hymns added to database
6. Temporary file deleted
7. Control Panel refreshes library
```

### Security Considerations

**Input Sanitization:**

- HTML escaping on display output
- File type validation
- File size limits (via Multer)

**Network Security:**

- CORS enabled for development
- WebSocket origin validation recommended for production
- No authentication (local network assumption)

### Performance Optimizations

**Frontend:**

- Minimal DOM manipulation
- CSS transitions over JavaScript animations
- Debounced search input
- Lazy loading for large libraries (future)

**Backend:**

- Synchronous file I/O (acceptable for small datasets)
- In-memory hymn caching potential (future)
- WebSocket connection pooling

## OBS Integration Guide

### Browser Source Configuration

**Display Source Settings:**

```
URL: http://localhost:3000/display
Width: 1920
Height: 1080
FPS: 30
Custom CSS: (none required)
☑ Shutdown source when not visible
☑ Refresh browser when scene becomes active
```

**Recommended Scene Setup:**

1. Background layer (image/video)
2. HymnView display layer (above background)
3. Camera/presentation layer (optional, above hymn)

### Custom Dock Configuration

**Control Dock Settings:**

```
Dock Name: HymnView Control
URL: http://localhost:3000/control
```

**Alternative:** Use external browser for control panel

## Extension Possibilities

### Future Enhancements

**1. Advanced Display Features**

- Multiple layout templates
- Background image support
- Gradient backgrounds
- Font selection
- Animation options (slide, fade, zoom)

**2. Library Management**

- Categories/tags
- Favorites system
- Recently used tracking
- Playlist creation
- Service order planning

**3. Import/Export**

- Bulk import from worship software
- Export to PDF
- Backup/restore functionality
- Cloud sync

**4. Presentation Features**

- Chord display for musicians
- Copyright information overlay
- Multi-language support
- Split-screen mode (lyrics + chords)

**5. Integration**

- ProPresenter import
- EasyWorship import
- PowerPoint export
- Remote control via mobile app

**6. Technical Improvements**

- User authentication
- Multi-user editing
- Database migration to SQLite
- Caching layer
- Compression for large libraries

## Development Workflow

### Local Development

**Start Server:**

```bash
npm start          # Production mode
npm run dev        # Development with auto-reload
```

**Access Points:**

- Control: <http://localhost:3000/control>
- Display: <http://localhost:3000/display>
- API: <http://localhost:3000/api/hymns>

### Testing Strategy

**Manual Testing Checklist:**

- [ ] File upload (TXT, CSV, JSON)
- [ ] Hymn selection and display
- [ ] Verse navigation
- [ ] Search functionality
- [ ] Settings persistence
- [ ] WebSocket reconnection
- [ ] Blank screen toggle
- [ ] Multiple concurrent connections

**Recommended Automated Testing:**

- Unit tests for parsers
- API endpoint tests
- WebSocket connection tests
- Frontend component tests

## Deployment Considerations

### Production Deployment

**Server Configuration:**

1. Change port if needed (environment variable)
2. Enable HTTPS for secure WebSocket
3. Configure firewall rules
4. Set up process manager (PM2)
5. Configure auto-start on boot

**Example PM2 Setup:**

```bash
pm2 start server/server.js --name hymnview
pm2 save
pm2 startup
```

### Network Requirements

**Ports:**

- TCP 3000 (HTTP/WebSocket)

**Bandwidth:**

- Minimal (< 1 KB per update)
- Local network recommended
- Internet not required

## Troubleshooting Guide

### Common Issues

**1. WebSocket Connection Failed**

- Check server is running
- Verify firewall settings
- Confirm port 3000 is available
- Check browser console for errors

**2. Hymns Not Displaying**

- Refresh OBS browser source
- Check WebSocket connection status
- Verify correct URL in browser source
- Review server logs

**3. File Upload Errors**

- Validate file format
- Check file encoding (UTF-8 recommended)
- Review parser logs for specific errors
- Ensure sufficient disk space

**4. Settings Not Persisting**

- Check browser localStorage
- Clear cache and reload
- Verify browser supports localStorage

## Maintenance

### Regular Tasks

**Backup:**

- Copy `server/data/hymns.json` regularly
- Export library periodically

**Updates:**

- Check for npm package updates
- Review security advisories
- Update Node.js as needed

**Monitoring:**

- Check server logs for errors
- Monitor WebSocket connections
- Review upload success rates

## Conclusion

HymnView provides a complete, production-ready solution for hymn display in OBS Studio. The modular architecture allows for easy extension and customization while maintaining simplicity and reliability.

The implementation balances modern web technologies with practical deployment considerations, resulting in a tool that is both powerful and accessible for worship teams.

---

**Version:** 1.0.0  
**Date:** January 4, 2026  
**Status:** Production Ready
