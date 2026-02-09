import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { format } from 'date-fns'
import { ContractData } from './contract-parser'

interface UploadedFile {
  file: File
  preview: string
  timestamp: Date
}

interface PDFParams {
  notice: string
  photos: UploadedFile[]
  projectName: string
  gcName: string
  contractData: ContractData | null
}

export async function generatePDF(params: PDFParams): Promise<Uint8Array> {
  const { notice, photos, projectName } = params
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  const courierFont = await pdfDoc.embedFont(StandardFonts.Courier)
  
  // Add first page for the notice
  let page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const margin = 50
  const contentWidth = width - 2 * margin
  
  let yPosition = height - margin
  
  // Helper function to add text
  const addText = (text: string, fontSize: number, font: any, isBold = false) => {
    const lines = splitTextIntoLines(text, contentWidth, fontSize, font)
    
    for (const line of lines) {
      if (yPosition < margin + 50) {
        // Add new page if we're running out of space
        page = pdfDoc.addPage()
        yPosition = height - margin
      }
      
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      })
      
      yPosition -= fontSize + 4
    }
  }
  
  // Split notice into lines and render
  const noticeLines = notice.split('\n')
  
  for (const line of noticeLines) {
    if (line.trim() === '') {
      yPosition -= 8
      continue
    }
    
    // Check if it's a header line
    if (line.includes('CHANGE ORDER NOTICE') || 
        line.includes('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')) {
      addText(line, 14, timesRomanBold, true)
    } else if (line.match(/^\d+\.\s+[A-Z]/)) {
      // Section headers
      addText(line, 11, timesRomanBold, true)
      yPosition -= 4
    } else {
      addText(line, 10, timesRomanFont)
    }
  }
  
  // Add photos on new pages
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i]
    
    try {
      // Convert image to bytes
      const imageBytes = await photo.file.arrayBuffer()
      
      // Embed image
      let image
      const fileType = photo.file.type.toLowerCase()
      
      if (fileType.includes('png')) {
        image = await pdfDoc.embedPng(imageBytes)
      } else if (fileType.includes('jpg') || fileType.includes('jpeg')) {
        image = await pdfDoc.embedJpg(imageBytes)
      } else {
        // Skip unsupported formats
        continue
      }
      
      // Add new page for photo
      const photoPage = pdfDoc.addPage()
      const pageWidth = photoPage.getSize().width
      const pageHeight = photoPage.getSize().height
      
      // Calculate scaled dimensions
      const imgWidth = image.width
      const imgHeight = image.height
      const maxWidth = pageWidth - 2 * margin
      const maxHeight = pageHeight - 2 * margin - 100
      
      let scaledWidth = imgWidth
      let scaledHeight = imgHeight
      
      if (imgWidth > maxWidth) {
        scaledWidth = maxWidth
        scaledHeight = (imgHeight * maxWidth) / imgWidth
      }
      
      if (scaledHeight > maxHeight) {
        scaledHeight = maxHeight
        scaledWidth = (imgWidth * maxHeight) / imgHeight
      }
      
      // Center the image
      const x = (pageWidth - scaledWidth) / 2
      const y = (pageHeight - scaledHeight) / 2
      
      // Draw image
      photoPage.drawImage(image, {
        x,
        y,
        width: scaledWidth,
        height: scaledHeight,
      })
      
      // Add caption
      const caption = `Photo ${i + 1}: Field Evidence - ${format(photo.timestamp, 'MMM d, yyyy h:mm:ss a')}`
      photoPage.drawText(caption, {
        x: margin,
        y: margin,
        size: 10,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })
      
    } catch (error) {
      console.error(`Error embedding photo ${i + 1}:`, error)
    }
  }
  
  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

function splitTextIntoLines(text: string, maxWidth: number, fontSize: number, font: any): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const testWidth = font.widthOfTextAtSize(testLine, fontSize)
    
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  
  if (currentLine) {
    lines.push(currentLine)
  }
  
  return lines
}
