import OpenAI from 'openai'
import { format } from 'date-fns'
import { ContractData } from './contract-parser-ai'

interface UploadedFile {
  file: File
  preview: string
  timestamp: Date
}

interface NoticeParams {
  photos: UploadedFile[]
  note: string
  projectName: string
  gcName: string
  contractData: ContractData | null
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for MVP - move to API route in production
})

export async function generateNotice(params: NoticeParams): Promise<string> {
  const { photos, note, projectName, gcName, contractData } = params
  
  const today = new Date()
  const formattedDate = format(today, 'MMMM d, yyyy')
  const formattedTime = format(today, 'h:mm a')
  
  try {
    // Use OpenAI to generate a professional, contract-compliant notice
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert construction contract administrator specializing in change order documentation for electrical subcontractors. 

Your job is to generate professional, contract-compliant written notices that:
1. Follow formal business letter format
2. Reference specific contract clauses and requirements
3. Preserve the subcontractor's rights to compensation and time extension
4. Include all required elements per the contract
5. Maintain a professional, non-adversarial tone
6. Are clear, concise, and legally defensible

The notice should follow this structure:
- Subject line clearly stating it's a written notice
- Project identification
- Date and timestamp
- Notice type and contract reference
- Description of the delay/change event
- Estimated schedule impact
- Contractual basis (citing specific articles)
- List of attached supporting documentation
- Subcontractor signature block

Use formal construction industry language. Be specific about contract references. Make it clear this is to preserve rights and request direction, not to make accusations.`
        },
        {
          role: "user",
          content: `Generate a written notice of delay and request for time extension with the following details:

PROJECT INFORMATION:
- Project Name: ${projectName}
- General Contractor: ${gcName}
- Date: ${formattedDate}
- Time: ${formattedTime}

DELAY/CHANGE DESCRIPTION:
${note || 'Unanticipated site condition encountered that was not reasonably identifiable from contract documents'}

CONTRACT INFORMATION:
${contractData ? `
- Notice Window: ${contractData.noticeWindow}
- Required Notice Elements: ${contractData.noticeRequirements.join(', ')}
- Relevant Contract Clauses:
${contractData.relevantClauses.map(c => `  * ${c.number} - ${c.title}: ${c.text.substring(0, 150)}...`).join('\n')}
` : 'Standard subcontractor agreement with 48-hour notice requirement'}

SUPPORTING DOCUMENTATION:
${photos.map((photo, index) => `- Photo_${String(index + 1).padStart(2, '0')}.jpg – Field evidence captured ${format(photo.timestamp, 'MMMM d, yyyy \'at\' h:mm a')}`).join('\n')}

Generate a complete, professional written notice that cites the specific contract articles and preserves the subcontractor's rights. The notice should be formal but not adversarial.`
        }
      ],
      temperature: 0.4,
      max_tokens: 1500
    })

    const aiGeneratedNotice = completion.choices[0].message.content || ''
    
    // Ensure the notice includes all critical elements
    return aiGeneratedNotice
    
  } catch (error) {
    console.error('Error generating notice with AI:', error)
    // Fallback to template-based generation
    return generateFallbackNotice(params)
  }
}

function generateFallbackNotice(params: NoticeParams): string {
  const { photos, note, projectName, gcName, contractData } = params
  
  const today = new Date()
  const formattedDate = format(today, 'MMMM d, yyyy')
  const formattedTime = format(today, 'h:mm a')
  
  const notice = `SUBJECT: WRITTEN NOTICE OF DELAY AND REQUEST FOR TIME EXTENSION

Project: ${projectName}
Date: ${formattedDate}
Time: ${formattedTime}

To: ${gcName}
From: [Subcontractor Name - Electrical]

Notice Type: Written Notice of Delay and Request for Time Extension
Contract Reference: ${contractData?.relevantClauses[0]?.number || 'Article 4'} – ${contractData?.relevantClauses[0]?.title || 'Project Start and Completion'}

Description of Delay Event:
${note || 'During performance of the Subcontractor\'s scope of work, an unanticipated obstruction was encountered that was not reasonably identifiable from the contract documents. As a result, Subcontractor is unable to proceed with the affected work activities without resolution of this condition.'}

Discovery Date: ${formattedDate}
Discovery Time: ${formattedTime}

Estimated Schedule Impact:
Subcontractor currently estimates an impact to the project schedule, subject to further evaluation once direction is received from the Contractor.

Contractual Basis:
This written notice is submitted in accordance with ${contractData?.relevantClauses[0]?.number || 'Article 4'} of the Subcontract Agreement, which requires that any time extensions required by the Subcontractor be presented in writing to the Contractor. 

${contractData?.relevantClauses[0]?.text || 'Any and all-time extensions required by the Subcontractor for material delays must be presented in writing to the contractor.'}

This notice is provided to:
1. Document the delay event
2. Preserve Subcontractor's rights with respect to schedule relief
3. Avoid potential liquidated damages
4. Request direction on how to proceed

${contractData ? `This notice is submitted within the ${contractData.noticeWindow} requirement specified in the Contract.` : 'This notice is submitted within the contractually required timeframe.'}

Attached Supporting Documentation:
${photos.map((photo, index) => `Photo_${String(index + 1).padStart(2, '0')}.jpg – Field evidence captured ${format(photo.timestamp, 'MMMM d, yyyy \'at\' h:mm:ss a')}`).join('\n')}

Request for Direction:
We respectfully request:
a) Acknowledgment of receipt of this notice
b) Direction on how to proceed with the affected work
c) Discussion of schedule impacts and potential time extension
d) Authorization to proceed, if required

Reservation of Rights:
This notice is submitted to preserve our rights under the Contract. We reserve the right to submit a detailed cost and schedule impact analysis upon receipt of direction.

Submitted by:
[Subcontractor Name]
[Contact Information]
[Signature]

This notice is submitted in good faith and in accordance with the Contract requirements.`

  return notice
}
