# Change Order Copilot MVP

**Subcontractor-first Change Order Notice Generator**

Transform field notes and photos into contract-compliant notices in under 2 minutes.

## What This Does

This MVP solves one specific problem for electrical subcontractors:
- **Input**: Field photos + brief note + contract PDF
- **Output**: Contract-compliant change order notice (PDF + email-ready)

## Why This Matters

Construction disputes often emerge when scope changes aren't documented correctly and quickly. This tool helps subcontractors:
- Preserve their right to get paid
- Avoid disputes through proper documentation
- Meet contract notice requirements (typically 48-72 hours)

## Target User

- Electrical subcontractor PM or foreman
- Small to mid-sized company (10-100 people)
- Commercial projects
- Already emails GCs directly

## Features

### Core Workflow
1. **Upload contract** (one-time per project)
2. **Upload 1-5 field photos** (auto-timestamped)
3. **Add brief description** (one sentence)
4. **Click "Generate Notice"**

### Output Includes
- Formal change notice with proper structure
- Contract clause citations (auto-extracted)
- Timestamped photo evidence
- Professional formatting
- Downloadable PDF
- Email-ready format

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **pdf-lib** - PDF generation
- **pdfjs-dist** - Contract parsing
- **Lucide React** - Icons

## What This MVP Does NOT Do

- ❌ No user accounts
- ❌ No Procore integration
- ❌ No workflow states/approvals
- ❌ No billing system
- ❌ No multi-project dashboard
- ❌ No real-time collaboration

All of that comes later. This MVP proves the core value proposition.

## Demo Flow (60-90 seconds)

1. Enter project name and GC name
2. Upload contract PDF
3. Upload 2-3 field photos
4. Type one sentence description
5. Click "Generate Notice"
6. Preview shows:
   - Formal notice structure
   - Contract clauses highlighted
   - Photos with timestamps
7. Download PDF
8. Click "Email to GC" (opens mail client)

## Value Proposition

**"I preserved my right to get paid in under 2 minutes"**

This tool helps subcontractors:
- Meet strict notice deadlines
- Include all required elements
- Cite correct contract clauses
- Maintain professional documentation
- Avoid costly disputes

## Next Steps

After validating this MVP:
- Add voice-to-text for field notes
- Template library for common changes
- Integration with email systems
- Multi-project management
- Team collaboration features
- Cost/schedule impact tracking

## License

Proprietary - YC Application MVP
