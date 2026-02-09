import { format } from 'date-fns'
import { ContractData } from './contract-parser'

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

export async function generateNotice(params: NoticeParams): Promise<string> {
  const { photos, note, projectName, gcName, contractData } = params
  
  const today = new Date()
  const formattedDate = format(today, 'MMMM d, yyyy')
  const formattedTime = format(today, 'h:mm a')
  
  // Build the notice document
  const notice = `
CHANGE ORDER NOTICE

Date: ${formattedDate}
Time: ${formattedTime}
Project: ${projectName}
To: ${gcName}
From: [Subcontractor Name - Electrical]

RE: NOTICE OF CHANGED CONDITION / REQUEST FOR DIRECTION

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PURPOSE OF NOTICE

This notice is submitted in accordance with the Contract requirements to preserve our rights to compensation and time extension for changed conditions encountered in the field.

${contractData ? `This notice complies with ${contractData.relevantClauses.map(c => `Section ${c.number}`).join(', ')} of the Contract.` : ''}

2. DESCRIPTION OF CHANGE

${note || 'Field conditions differ from contract documents, requiring additional work and/or materials not included in the original scope.'}

Discovery Date: ${formattedDate}
Discovery Time: ${formattedTime}

3. FIELD EVIDENCE

${photos.length} photograph(s) attached documenting the condition.

Evidence timestamps:
${photos.map((photo, index) => `  Photo ${index + 1}: ${format(photo.timestamp, 'MMMM d, yyyy - h:mm:ss a')}`).join('\n')}

All photographic evidence was captured at the time of discovery and is submitted as part of this notice.

4. CONTRACT REFERENCE

${contractData ? generateContractReferences(contractData) : generateDefaultContractReferences()}

5. REQUEST FOR DIRECTION

We respectfully request:

  a) Acknowledgment of receipt of this notice
  b) Direction on how to proceed with the changed condition
  c) Authorization to proceed with additional work, if required
  d) Discussion of schedule and cost impacts

6. RESERVATION OF RIGHTS

This notice is submitted to preserve our rights under the Contract. We reserve the right to submit a detailed cost and schedule impact analysis upon receipt of direction.

${contractData?.noticeWindow ? `This notice is submitted within the ${contractData.noticeWindow} requirement specified in the Contract.` : 'This notice is submitted within the contractually required timeframe.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ATTACHMENTS:
${photos.map((_, index) => `  - Photo ${index + 1}: Field Evidence`).join('\n')}

This notice is submitted in good faith and in accordance with the Contract requirements.
`.trim()
  
  return notice
}

function generateContractReferences(contractData: ContractData): string {
  let references = 'Relevant Contract Provisions:\n\n'
  
  contractData.relevantClauses.forEach(clause => {
    references += `Section ${clause.number} - ${clause.title}\n`
    const truncatedText = clause.text.substring(0, 200)
    const ellipsis = clause.text.length > 200 ? '...' : ''
    references += `"${truncatedText}${ellipsis}"\n\n`
  })
  
  if (contractData.noticeRequirements.length > 0) {
    references += 'Notice Requirements Met:\n'
    contractData.noticeRequirements.forEach((req, index) => {
      references += `  ${index + 1}. ${req}\n`
    })
  }
  
  return references.trim()
}

function generateDefaultContractReferences(): string {
  return `Relevant Contract Provisions:

Section 7.3 - Change Orders
"Subcontractor shall provide written notice of any changes in scope, unforeseen conditions, or additional work within the time specified in the contract."

Section 7.3.1 - Notice Requirements
"Written notice must include: (a) description of the change or condition; (b) date of discovery; (c) photographic evidence; (d) estimated impact on schedule and cost."

Notice Requirements Met:
  1. Written notice to General Contractor
  2. Description of the change or condition
  3. Date and time of discovery
  4. Photographic evidence where applicable
  5. Request for direction or change order`
}
