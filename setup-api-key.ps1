# Setup OpenAI API Key
# Run this script to create .env.local with your API key

# REPLACE THIS WITH YOUR ACTUAL API KEY
$apiKey = "your_openai_api_key_here"

$envContent = "NEXT_PUBLIC_OPENAI_API_KEY=$apiKey"

Set-Content -Path ".env.local" -Value $envContent

Write-Host "✅ Created .env.local with your OpenAI API key" -ForegroundColor Green
Write-Host "⚠️  Remember: Never commit .env.local to Git!" -ForegroundColor Yellow
Write-Host "🔄 Restart your dev server (npm run dev) for changes to take effect" -ForegroundColor Cyan
