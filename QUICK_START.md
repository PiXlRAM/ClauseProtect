# Quick Start Guide

## Getting Started in 5 Minutes

### 1. Installation (Already Done!)
```bash
cd c:/Users/Vinayak/Desktop/yc_project
npm install  # Already completed
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### 3. Test the Application

#### Step 1: Enter Project Information
- **Project Name**: Downtown Office Building
- **General Contractor**: ABC Construction Co.

#### Step 2: Upload a Contract
- Use any PDF file as a test contract
- The app will attempt to parse it for change order clauses
- If parsing fails, it uses sensible defaults

#### Step 3: Upload Photos
- Upload 1-5 photos (JPG or PNG)
- Each photo is automatically timestamped
- You can remove photos by hovering and clicking "Remove"

#### Step 4: Add Description
- Type a brief description of the change
- Example: "Additional conduit runs required due to unforeseen structural conflicts"

#### Step 5: Generate Notice
- Click "Generate Notice" button
- Wait a few seconds for processing
- Review the generated notice

#### Step 6: Download or Email
- Click "Download PDF" to save the notice
- Click "Email to GC" to open your email client
- Click "New Notice" to start over

## File Structure

```
yc_project/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── lib/
│   ├── contract-parser.ts  # PDF contract parsing logic
│   ├── notice-generator.ts # Notice text generation
│   └── pdf-generator.ts    # PDF creation with photos
├── package.json            # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind CSS config
├── README.md              # Project overview
├── DEMO_GUIDE.md          # How to demo for YC
├── TECHNICAL_NOTES.md     # Technical documentation
├── YC_APPLICATION_SUMMARY.md  # YC application details
└── QUICK_START.md         # This file
```

## Available Scripts

### Development
```bash
npm run dev      # Start development server (http://localhost:3000)
```

### Production
```bash
npm run build    # Build for production
npm start        # Start production server
```

### Linting
```bash
npm run lint     # Run ESLint
```

## Key Features

### ✅ What Works
- Contract PDF upload and parsing
- Photo upload with automatic timestamping
- Notice generation with contract citations
- PDF export with embedded photos
- Email integration (opens mail client)
- Responsive design (works on mobile)

### ⚠️ Known Limitations
- Only supports JPG and PNG photos (no HEIC yet)
- Limited to 5 photos per notice
- Contract parsing works best with standard AIA contracts
- No user accounts or data persistence
- No backend (everything runs in browser)

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### PDF Generation Fails
- Make sure photos are JPG or PNG format
- Check that photos are not too large (>10MB)
- Try with fewer photos

### Contract Parsing Issues
- The app will use default clauses if parsing fails
- This is expected behavior for non-standard contracts
- The notice will still be generated successfully

### Browser Compatibility
- Use Chrome, Firefox, Safari, or Edge
- Requires modern browser with ES6+ support
- PDF.js worker loaded from CDN (requires internet)

## Testing Checklist

Before demoing:
- [ ] Server starts without errors
- [ ] Page loads at http://localhost:3000
- [ ] Can upload contract PDF
- [ ] Can upload 1-5 photos
- [ ] Can type description
- [ ] "Generate Notice" button works
- [ ] Notice preview displays correctly
- [ ] PDF download works
- [ ] Email button opens mail client
- [ ] "New Notice" resets the form

## Demo Preparation

### What You Need
1. **Sample contract PDF** (any construction contract)
2. **2-3 field photos** (construction site, electrical work, etc.)
3. **Project details** (name, GC name)
4. **Description** (one sentence about the change)

### Demo Script
See `DEMO_GUIDE.md` for detailed 60-90 second demo script.

## Next Steps

### For Development
1. Read `TECHNICAL_NOTES.md` for architecture details
2. Review code in `app/page.tsx` and `lib/` folder
3. Test with different contract types and photos
4. Customize styling in `app/globals.css`

### For YC Application
1. Record demo video using `DEMO_GUIDE.md`
2. Conduct user interviews with electrical subs
3. Get validation quotes ("I would use this")
4. Review `YC_APPLICATION_SUMMARY.md` for talking points

### For Deployment
```bash
# Deploy to Vercel (recommended)
npm install -g vercel
vercel

# Or deploy to Netlify
npm run build
# Upload .next folder to Netlify
```

## Support

### Documentation
- **README.md** - Project overview
- **DEMO_GUIDE.md** - How to demo
- **TECHNICAL_NOTES.md** - Technical details
- **YC_APPLICATION_SUMMARY.md** - Business case

### Common Questions

**Q: Can I use this in production?**  
A: This is an MVP. It works, but needs user validation before production use.

**Q: How do I add more features?**  
A: See "Future Enhancements" in `TECHNICAL_NOTES.md`

**Q: Can I customize the notice format?**  
A: Yes, edit `lib/notice-generator.ts`

**Q: How do I deploy this?**  
A: Vercel is recommended. Run `vercel` in the project directory.

**Q: Is this open source?**  
A: Currently proprietary for YC application. May open source later.

## Success Criteria

### MVP is successful if:
- ✅ Generates professional-looking notices
- ✅ Includes contract clause citations
- ✅ Timestamps photos correctly
- ✅ Produces downloadable PDF
- ✅ Takes less than 2 minutes to use
- ✅ Users say "I would use this"

### Ready for next phase if:
- 10+ user interviews completed
- 3+ validation quotes collected
- 5+ beta testers lined up
- Demo video recorded
- YC application submitted

## Resources

### Learning Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [pdf-lib Documentation](https://pdf-lib.js.org/)

### Construction Industry Resources
- AIA Contract Documents
- AGC (Associated General Contractors)
- NECA (National Electrical Contractors Association)

### YC Resources
- [YC Application Guide](https://www.ycombinator.com/apply)
- [How to Demo Your Product](https://www.ycombinator.com/library)

## Contact

For questions or issues:
- Check documentation files
- Review code comments
- Test with different inputs

---

**You're ready to go! Start the server and test the app.**

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.
