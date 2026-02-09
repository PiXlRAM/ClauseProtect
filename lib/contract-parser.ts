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
    
    // Parse contract for key information
    const contractData = extractContractRules(fullText)
    
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

function extractContractRules(text: string): Omit<ContractData, 'fullText'> {
  const noticeWindow = extractNoticeWindow(text)
  const noticeRequirements = extractNoticeRequirements(text)
  const relevantClauses = extractRelevantClauses(text)
  
  return {
    noticeWindow,
    noticeRequirements,
    relevantClauses
  }
}

function extractNoticeWindow(text: string): string {
  // Look for common notice timing patterns
  const patterns = [
    /within\s+(\d+)\s+(days?|hours?)/gi,
    /(\d+)\s+(day|hour)\s+notice/gi,
    /notice\s+within\s+(\d+)\s+(days?|hours?)/gi
  ]
  
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      return match[0]
    }
  }
  
  return '48 hours' // Default
}

function extractNoticeRequirements(text: string): string[] {
  const requirements: string[] = []
  
  // Look for sections about notice requirements
  const noticeSection = text.match(/notice.*?requirements?.*?[:.]\s*(.*?)(?=\n\n|\d+\.\d+|Article|Section)/is)
  
  if (noticeSection) {
    // Extract bullet points or numbered items
    const items = noticeSection[1].match(/[•\-\d]+\.?\s*([^\n•\-\d]+)/g)
    if (items) {
      requirements.push(...items.map(item => item.trim()))
    }
  }
  
  // Default requirements if none found
  if (requirements.length === 0) {
    requirements.push(
      'Written notice to General Contractor',
      'Description of the change or condition',
      'Date and time of discovery',
      'Photographic evidence where applicable',
      'Request for direction or change order'
    )
  }
  
  return requirements
}

function extractRelevantClauses(text: string): Array<{ number: string; title: string; text: string }> {
  const clauses: Array<{ number: string; title: string; text: string }> = []
  
  // Look for change order clauses
  const changeOrderPatterns = [
    /(?:Section|Article|Clause)\s+([\d.]+)\s*[:\-]?\s*(Change Orders?|Changes?|Modifications?|Extra Work)/gi,
    /(?:Section|Article|Clause)\s+([\d.]+)\s*[:\-]?\s*(Notice|Notification)/gi
  ]
  
  for (const pattern of changeOrderPatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const clauseNumber = match[1]
      const clauseTitle = match[2]
      
      // Extract text following the clause header (next ~500 chars)
      const startIndex = match.index
      const clauseText = text.substring(startIndex, startIndex + 500).split('\n\n')[0]
      
      clauses.push({
        number: clauseNumber,
        title: clauseTitle,
        text: clauseText
      })
    }
  }
  
  // Add default clauses if none found
  if (clauses.length === 0) {
    clauses.push({
      number: '7.3',
      title: 'Change Orders',
      text: 'Subcontractor shall provide written notice of any changes in scope, unforeseen conditions, or additional work within the time specified in the contract. Failure to provide timely notice may result in waiver of claims.'
    })
    clauses.push({
      number: '7.3.1',
      title: 'Notice Requirements',
      text: 'Written notice must include: (a) description of the change or condition; (b) date of discovery; (c) photographic evidence; (d) estimated impact on schedule and cost; (e) request for direction.'
    })
  }
  
  return clauses.slice(0, 3) // Limit to 3 most relevant clauses
}

function getDefaultContractData(): ContractData {
  return {
    noticeWindow: '48 hours',
    noticeRequirements: [
      'Written notice to General Contractor',
      'Description of the change or condition',
      'Date and time of discovery',
      'Photographic evidence where applicable',
      'Request for direction or change order'
    ],
    relevantClauses: [
      {
        number: '7.3',
        title: 'Change Orders',
        text: 'Subcontractor shall provide written notice of any changes in scope, unforeseen conditions, or additional work within the time specified in the contract.'
      },
      {
        number: '7.3.1',
        title: 'Notice Requirements',
        text: 'Written notice must include: (a) description of the change or condition; (b) date of discovery; (c) photographic evidence; (d) estimated impact on schedule and cost.'
      }
    ],
    fullText: ''
  }
}
