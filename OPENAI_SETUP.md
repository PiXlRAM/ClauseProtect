# OpenAI API Setup Guide

## Step 1: Create .env.local File

Create a file named `.env.local` in the root of your project:

```bash
# In the yc_project folder, create .env.local
```

## Step 2: Add Your API Key

Add this line to `.env.local`:

```
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

Replace `your_openai_api_key_here` with your actual API key from https://platform.openai.com/api-keys

**IMPORTANT**: Never commit this file to Git! It's already in `.gitignore`.

## Step 3: Restart the Development Server

If the server is running, stop it (Ctrl+C) and restart:

```bash
npm run dev
```

## What Changed

### AI-Powered Contract Parsing
The app now uses GPT-4 to intelligently parse contracts and extract:
- Notice timing windows (e.g., "48 hours", "3 days")
- Required notice elements
- Relevant contract clauses with article numbers and text

**File**: `lib/contract-parser-ai.ts`

### AI-Powered Notice Generation
The app now uses GPT-4 to generate professional, contract-compliant notices that:
- Reference specific contract articles
- Use proper construction industry language
- Preserve subcontractor's rights
- Include all required elements
- Maintain professional tone

**File**: `lib/notice-generator-ai.ts`

## How It Works

### Contract Parsing Flow
1. User uploads PDF contract
2. Extract text from PDF using pdf.js
3. Send text to GPT-4 with specialized prompt
4. GPT-4 analyzes contract and extracts key information
5. Returns structured JSON with notice requirements
6. Falls back to defaults if AI fails

### Notice Generation Flow
1. User provides photos, description, and project info
2. Send all context to GPT-4 with specialized prompt
3. GPT-4 generates professional notice citing specific contract clauses
4. Returns formatted notice text
5. Falls back to template if AI fails

## Example Output

### Before (Template-Based)
```
CHANGE ORDER NOTICE

Date: February 8, 2026
...
[Generic template text]
```

### After (AI-Generated)
```
SUBJECT: WRITTEN NOTICE OF DELAY AND REQUEST FOR TIME EXTENSION

Project: Downtown Office Building
Date: February 8, 2026

Notice Type: Written Notice of Delay and Request for Time Extension
Contract Reference: Article 4 – Project Start and Completion

Description of Delay Event:
During performance of the Subcontractor's scope of work at the electrical room, 
an unanticipated structural conflict was encountered...

[Professional, contract-specific language citing exact articles]
```

## Cost Considerations

### GPT-4 Turbo Pricing (as of Feb 2024)
- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens

### Estimated Costs Per Notice
- Contract parsing: ~$0.10-0.20 (one-time per project)
- Notice generation: ~$0.05-0.10 per notice

### Monthly Estimates
- 50 notices/month: ~$5-10
- 200 notices/month: ~$20-40
- 1000 notices/month: ~$100-200

**Very affordable for the value provided!**

## API Key Security

### Current Setup (MVP)
- API key in `.env.local`
- Called directly from browser
- `dangerouslyAllowBrowser: true` flag

**This is OK for MVP/demo but NOT for production!**

### Production Setup (Future)
1. Move API calls to Next.js API routes
2. Keep API key server-side only
3. Remove `dangerouslyAllowBrowser` flag
4. Add rate limiting
5. Add user authentication

## Fallback Behavior

Both AI functions have fallback logic:

### If OpenAI API Fails
- Contract parser returns sensible defaults
- Notice generator uses template-based approach
- App continues to work (degraded but functional)

### Reasons API Might Fail
- Invalid API key
- Rate limit exceeded
- Network issues
- OpenAI service outage

## Testing the AI Features

### Test Contract Parsing
1. Upload the sample contract (`SAMPLE_CONTRACT.txt` converted to PDF)
2. Check console for parsed data
3. Verify it extracted Article 4 and notice requirements

### Test Notice Generation
1. Fill in project details
2. Upload photos
3. Add description
4. Click "Generate Notice"
5. Verify notice cites specific contract articles

## Monitoring Usage

### Check Usage on OpenAI Dashboard
1. Go to https://platform.openai.com/usage
2. View API calls and costs
3. Set up usage alerts if needed

### Recommended Limits (MVP)
- Daily limit: $5
- Monthly limit: $50
- Alerts at 80% of limit

## Troubleshooting

### "Cannot find module 'openai'"
```bash
npm install openai
```

### "API key not found"
- Check `.env.local` exists
- Check variable name: `NEXT_PUBLIC_OPENAI_API_KEY`
- Restart dev server after creating `.env.local`

### "Rate limit exceeded"
- Wait a few minutes
- Check usage on OpenAI dashboard
- Consider upgrading to paid tier

### "Invalid API key"
- Double-check the key in `.env.local`
- Regenerate key on OpenAI dashboard if needed

## Next Steps

### Immediate
1. Create `.env.local` with your API key
2. Restart dev server
3. Test with sample contract
4. Generate a few notices

### Short-term
1. Monitor costs and usage
2. Collect user feedback on AI quality
3. Refine prompts based on output quality
4. Add error handling and retry logic

### Long-term
1. Move to API routes (server-side)
2. Add caching for contract parsing
3. Fine-tune model on construction contracts
4. Add user feedback loop to improve prompts

## Benefits of AI Integration

### Better Contract Parsing
- Handles non-standard contracts
- Understands context and intent
- Extracts nuanced requirements
- More accurate than regex patterns

### Better Notice Generation
- Professional language
- Contract-specific citations
- Legally defensible
- Saves time vs. manual writing

### Competitive Advantage
- First-to-market with AI-powered change orders
- Better output quality than templates
- Scales to any contract type
- Continuous improvement through prompt refinement

## Questions?

See `TECHNICAL_NOTES.md` for architecture details.
See `README.md` for general project information.

---

**You're now using AI to generate contract-compliant notices! 🚀**
