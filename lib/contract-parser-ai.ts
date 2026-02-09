import OpenAI from 'openai'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

export interface ContractData {
  noticeWindow: string
  noticeRequirements: string[]
  relevantClauses: Array<{
    number: string
    title: string
    text: string
  }>
  fullText: string
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for MVP - move to API route in production
})

export async function parseContract(file: File): Promise<ContractData> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    let fullText = ''
    
    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n'
    }
    
    // Use OpenAI to intelligently parse the contract
    const contractData = await extractContractRulesWithAI(fullText)
    
    return {
      ...contractData,
      fullText
    }
  } catch (error) {
    console.error('Error parsing contract:', error)
    // Return default values if parsing fails
    return getDefaultContractData()
  }
}

async function extractContractRulesWithAI(text: string): Promise<Omit<ContractData, 'fullText'>> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert construction contract analyst. Your job is to extract key information about change order notice requirements from subcontractor agreements.

Extract the following information:
1. Notice timing window (e.g., "48 hours", "3 days", "within 5 days")
2. List of notice requirements (what must be included in the notice)
3. Relevant contract clauses (article/section numbers, titles, and key text)

Focus on:
- Change order procedures
- Notice requirements for delays, changes, or unforeseen conditions
- Time extension procedures
- Documentation requirements
- Any clauses about preserving rights or avoiding waivers

Return your response as valid JSON with this exact structure:
{
  "noticeWindow": "string",
  "noticeRequirements": ["string", "string", ...],
  "relevantClauses": [
    {
      "number": "string",
      "title": "string", 
      "text": "string"
    }
  ]
}`
        },
        {
          role: "user",
          content: `Analyze this subcontractor agreement and extract notice requirements:\n\n${text.substring(0, 15000)}`
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    
    return {
      noticeWindow: result.noticeWindow || '48 hours',
      noticeRequirements: result.noticeRequirements || getDefaultNoticeRequirements(),
      relevantClauses: result.relevantClauses || getDefaultClauses()
    }
  } catch (error) {
    console.error('Error using OpenAI to parse contract:', error)
    // Fallback to defaults if AI parsing fails
    return {
      noticeWindow: '48 hours',
      noticeRequirements: getDefaultNoticeRequirements(),
      relevantClauses: getDefaultClauses()
    }
  }
}

function getDefaultNoticeRequirements(): string[] {
  return [
    'Written notice to General Contractor',
    'Description of the change or condition',
    'Date and time of discovery',
    'Photographic evidence where applicable',
    'Estimated schedule and cost impact',
    'Request for direction or change order'
  ]
}

function getDefaultClauses(): Array<{ number: string; title: string; text: string }> {
  return [
    {
      number: 'Article 4',
      title: 'Project Start and Completion',
      text: 'Any and all-time extensions required by the Subcontractor for material delays, adverse weather delays, etc. must be presented in writing to the contractor.'
    },
    {
      number: 'Article 2',
      title: 'Changes in the Work',
      text: 'No deviations from the specified scope of work will be permitted and/or paid for unless a written change order has been executed. The Subcontractor will promptly notify the Contractor of any required revisions to the scope of work.'
    }
  ]
}

function getDefaultContractData(): ContractData {
  return {
    noticeWindow: '48 hours',
    noticeRequirements: getDefaultNoticeRequirements(),
    relevantClauses: getDefaultClauses(),
    fullText: ''
  }
}
