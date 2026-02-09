# Technical Notes

## Architecture Overview

### Frontend (Next.js 14 + React)
- **Single Page Application**: `/app/page.tsx`
- **Client-side rendering**: All processing happens in the browser
- **No backend required**: Fully self-contained MVP

### Core Libraries

#### Contract Parsing (`lib/contract-parser.ts`)
- Uses `pdfjs-dist` to extract text from PDF contracts
- Pattern matching to identify:
  - Notice timing requirements (e.g., "within 48 hours")
  - Notice format requirements
  - Relevant change order clauses
- Falls back to sensible defaults if parsing fails

#### Notice Generation (`lib/notice-generator.ts`)
- Takes photos, notes, and contract data
- Generates structured, professional notice text
- Includes:
  - Formal header with date/time
  - Contract clause citations
  - Photo evidence with timestamps
  - Request for direction
  - Reservation of rights

#### PDF Generation (`lib/pdf-generator.ts`)
- Uses `pdf-lib` to create PDF documents
- Embeds photos directly in PDF
- Maintains professional formatting
- Supports JPG and PNG images

## Key Design Decisions

### 1. No Backend
**Why**: Simplifies deployment, reduces costs, proves core value
**Trade-off**: Can't store data, no user accounts
**Future**: Add backend when needed for multi-project management

### 2. Client-Side PDF Processing
**Why**: No server costs, instant processing, privacy (data never leaves browser)
**Trade-off**: Limited by browser capabilities
**Future**: Consider server-side processing for complex contracts

### 3. Hardcoded Contract Templates
**Why**: MVP focuses on one use case (electrical subs)
**Trade-off**: Not flexible for all contract types
**Future**: Machine learning for better clause extraction

### 4. No Authentication
**Why**: Reduces friction, proves core workflow
**Trade-off**: Can't save projects or track usage
**Future**: Add auth when building multi-project features

## Known Limitations

### Contract Parsing
- Works best with standard AIA-style contracts
- May miss clauses in non-standard formats
- Falls back to generic clauses if parsing fails
- **Solution**: Manual clause tagging during onboarding (post-MVP)

### Photo Handling
- Only supports JPG and PNG
- No HEIC support (iPhone photos may need conversion)
- Limited to 5 photos per notice
- **Solution**: Add HEIC support and cloud storage (post-MVP)

### Browser Compatibility
- Requires modern browser (Chrome, Firefox, Safari, Edge)
- PDF.js worker loaded from CDN
- **Solution**: Bundle worker locally for offline use

### Mobile Experience
- Works on mobile but optimized for desktop
- Photo upload from mobile camera works
- **Solution**: Native mobile app (post-MVP)

## Performance Considerations

### PDF Processing
- Large contracts (>50 pages) may take 5-10 seconds to parse
- Photos are embedded as-is (no compression)
- **Optimization**: Add progress indicators, compress images

### Memory Usage
- All processing in-memory (no disk writes)
- Large photos (>5MB) may cause issues
- **Optimization**: Resize images before embedding

## Security Considerations

### Data Privacy
- All data processed client-side
- No data sent to servers (except PDF.js CDN)
- Photos never uploaded anywhere
- **Important**: Emphasize this in marketing

### Contract Confidentiality
- Contracts processed locally
- Text extraction happens in browser
- No contract data stored
- **Important**: Key selling point for security-conscious users

## Testing Checklist

### Manual Testing
- [ ] Upload various contract formats (AIA, custom, etc.)
- [ ] Upload different photo formats (JPG, PNG, HEIC)
- [ ] Test with 1, 3, and 5 photos
- [ ] Test with very long descriptions
- [ ] Test PDF download functionality
- [ ] Test email button (opens mail client)
- [ ] Test "New Notice" workflow
- [ ] Test on mobile devices
- [ ] Test on different browsers

### Edge Cases
- [ ] Empty description field
- [ ] No photos uploaded
- [ ] No contract uploaded
- [ ] Very large contract (>100 pages)
- [ ] Very large photos (>10MB)
- [ ] Special characters in project name
- [ ] Long project names

## Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
- Free tier available
- Automatic HTTPS
- Global CDN
- Perfect for Next.js

### Option 2: Netlify
```bash
npm run build
# Deploy /out folder to Netlify
```
- Free tier available
- Simple deployment
- Good for static sites

### Option 3: GitHub Pages
```bash
npm run build
# Deploy /out folder to GitHub Pages
```
- Free hosting
- Good for demos
- Requires static export

## Future Enhancements (Post-MVP)

### Phase 1: Core Improvements
1. Voice-to-text for field notes
2. Photo compression and optimization
3. Better contract parsing (ML-based)
4. Template library for common changes
5. Offline mode (PWA)

### Phase 2: Multi-Project
1. User authentication
2. Project management dashboard
3. Notice history and tracking
4. Team collaboration
5. Email integration (direct send)

### Phase 3: Advanced Features
1. Cost and schedule impact tracking
2. Change order workflow management
3. Integration with Procore, PlanGrid, etc.
4. Mobile app (iOS/Android)
5. Analytics and reporting

### Phase 4: Platform
1. Multi-trade support (not just electrical)
2. GC portal (receive and respond to notices)
3. Dispute resolution tools
4. Payment tracking
5. API for third-party integrations

## Code Quality Notes

### TypeScript
- Strict mode enabled
- All types defined
- No `any` types (except in PDF processing)

### Error Handling
- Try-catch blocks around file processing
- Graceful fallbacks for parsing failures
- User-friendly error messages

### Code Organization
- Clear separation of concerns
- Reusable utility functions
- Well-commented complex logic

### Performance
- Lazy loading where possible
- Efficient image handling
- Minimal re-renders

## Environment Variables

Currently none required! Everything runs client-side.

Future needs:
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_STRIPE_KEY` - Payment processing
- `NEXT_PUBLIC_SENTRY_DSN` - Error tracking

## Monitoring and Analytics

### Current: None
MVP doesn't track usage or errors

### Future:
- Sentry for error tracking
- PostHog/Mixpanel for product analytics
- Vercel Analytics for performance

## Support and Documentation

### User Documentation
- README.md - Overview and installation
- DEMO_GUIDE.md - How to demo the product
- In-app tooltips (future)

### Developer Documentation
- This file (TECHNICAL_NOTES.md)
- Inline code comments
- TypeScript types as documentation

## License and Legal

### Current: Proprietary
This is a YC application MVP

### Future Considerations:
- Terms of Service
- Privacy Policy
- GDPR compliance (if expanding to EU)
- Insurance/liability considerations

## Contact and Support

For technical questions or issues:
- Check GitHub issues (if open-sourced)
- Contact: [Your email]

## Version History

### v0.1.0 (Current)
- Initial MVP release
- Single-page workflow
- Contract parsing
- Notice generation
- PDF export
- Email integration

### Planned v0.2.0
- Voice-to-text
- Better mobile experience
- Photo compression
- Template library

## Conclusion

This MVP is intentionally minimal. It proves the core value proposition:
**"From field notes to contract-compliant notice in under 2 minutes"**

Everything else can (and should) wait until after user validation.
