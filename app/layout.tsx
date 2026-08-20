import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ShortVideoApp',
  description: 'Short video mobile app scaffold',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
