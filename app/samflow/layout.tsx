import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'SAMFlow - AI-Powered Project Management',
  description: 'Beautiful modern project management with AI assistance',
}

export default function SAMFlowLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}