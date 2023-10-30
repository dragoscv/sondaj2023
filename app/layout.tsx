import './globals.css'
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '../components/Header'
import { Providers } from "./providers";
import { ToastContainer } from 'react-toastify';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] })

/**
 * Metadata for the Sondaj application.
 */
export const metadata: Metadata = {
  title: 'Sondaj',
  description: 'O aplicatie sondaj',
  applicationName: 'Sondaj',
}

/**
 * The root layout component for the Sondaj application.
 * @param children The child components to render within the layout.
 * @returns The rendered layout component.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col justify-between bg-white dark:bg-gradient-to-r dark:from-black dark:via-blue-900 dark:to-black dark:bg-opacity-75 dark:text-white min-h-[100dvh] transition-all ease-in-out`}>
        <Providers>
          <Header />
          {children}
          <Footer />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
}
