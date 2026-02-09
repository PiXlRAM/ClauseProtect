'use client'

import { useState } from 'react'
import { Upload, FileText, Camera, Mail, Download, AlertCircle } from 'lucide-react'
import { generateNotice } from '@/lib/notice-generator-ai'
import { generatePDF } from '@/lib/pdf-generator'
import { parseContract } from '@/lib/contract-parser-ai'

interface UploadedFile {
  file: File
  preview: string
  timestamp: Date
}

export default function Home() {
  const [photos, setPhotos] = useState<UploadedFile[]>([])
  const [contract, setContract] = useState<File | null>(null)
  const [note, setNote] = useState('')
  const [projectName, setProjectName] = useState('')
  const [gcName, setGcName] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedNotice, setGeneratedNotice] = useState<string | null>(null)
  const [contractData, setContractData] = useState<any>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newPhotos = files.slice(0, 5 - photos.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      timestamp: new Date()
    }))
    setPhotos([...photos, ...newPhotos])
  }

  const handleContractUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setContract(file)
      setLoading(true)
      try {
        const parsed = await parseContract(file)
        setContractData(parsed)
      } catch (error) {
        console.error('Error parsing contract:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const removePhoto = (index: number) => {
    const newPhotos = [...photos]
    URL.revokeObjectURL(newPhotos[index].preview)
    newPhotos.splice(index, 1)
    setPhotos(newPhotos)
  }

  const handleGenerate = async () => {
    if (!contract || photos.length === 0 || !projectName || !gcName) {
      alert('Please upload contract, at least one photo, and fill in project details')
      return
    }

    setLoading(true)
    try {
      const notice = await generateNotice({
        photos,
        note,
        projectName,
        gcName,
        contractData
      })
      setGeneratedNotice(notice)
    } catch (error) {
      console.error('Error generating notice:', error)
      alert('Error generating notice. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!generatedNotice) return
    
    setLoading(true)
    try {
      const pdfBytes = await generatePDF({
        notice: generatedNotice,
        photos,
        projectName,
        gcName,
        contractData
      })
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Change-Notice-${projectName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmail = () => {
    if (!generatedNotice) return
    
    const subject = encodeURIComponent(`Change Order Notice - ${projectName}`)
    const body = encodeURIComponent(
      `Please find attached the Change Order Notice for ${projectName}.\n\n` +
      `This notice is submitted in accordance with the contract requirements.\n\n` +
      `Best regards`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Change Order Copilot
          </h1>
          <p className="text-slate-600 text-lg">
            From field notes to contract-compliant notice in under 2 minutes
          </p>
        </div>

        {!generatedNotice ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Project Info */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Project Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Downtown Office Building"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    General Contractor
                  </label>
                  <input
                    type="text"
                    value={gcName}
                    onChange={(e) => setGcName(e.target.value)}
                    placeholder="e.g., ABC Construction Co."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Contract Upload */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Contract</h2>
              {!contract ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-10 h-10 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Click to upload contract</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PDF (one-time per project)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleContractUpload}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-slate-900">{contract.name}</p>
                      <p className="text-sm text-slate-600">
                        {(contract.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setContract(null)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Photo Upload */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Field Evidence ({photos.length}/5)
              </h2>
              {photos.length < 5 && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors mb-4">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-10 h-10 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Click to upload photos</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      JPG, PNG, HEIC (max {5 - photos.length} more)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}

              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo.preview}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-slate-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                        <button
                          onClick={() => removePhoto(index)}
                          className="opacity-0 group-hover:opacity-100 bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 text-center">
                        {photo.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Note */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Description</h2>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Brief description of the change (e.g., 'Additional conduit runs required due to unforeseen structural conflicts')"
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !contract || photos.length === 0 || !projectName || !gcName}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Generate Notice
                </>
              )}
            </button>

            {(!contract || photos.length === 0 || !projectName || !gcName) && (
              <div className="mt-4 flex items-start gap-2 text-amber-700 bg-amber-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Please upload contract, at least one photo, and fill in project details to generate notice
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Generated Notice</h2>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700 bg-slate-50 p-6 rounded-lg border border-slate-200">
                  {generatedNotice}
                </pre>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleDownloadPDF}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button
                  onClick={handleEmail}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Email to GC
                </button>
                <button
                  onClick={() => {
                    setGeneratedNotice(null)
                    setPhotos([])
                    setNote('')
                  }}
                  className="flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  New Notice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
