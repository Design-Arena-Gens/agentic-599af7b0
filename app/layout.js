import './globals.css'

export const metadata = {
  title: 'Website Cards - Interactive Gallery',
  description: 'Add and explore your favorite websites',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
