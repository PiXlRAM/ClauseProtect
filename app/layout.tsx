import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Change Order Copilot',
  description: 'Generate contract-compliant change notices in under 2 minutes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
