'use client'

import { useEffect, useState } from 'react';
import { AppProvider } from '@/components/AppContext';
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'
import { logAnalyticsEvent } from '@/lib/firebase/analytics';
import { useTheme } from 'next-themes'
/**
 * Provides the necessary context providers for the app.
 * @param children The child components to be wrapped by the providers.
 * @returns The wrapped child components with the necessary context providers.
 */
export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        logAnalyticsEvent('page_view');
    }, [])

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <AppProvider>
            <NextUIProvider
                className='flex min-h-[100dvh] w-full flex-col items-center justify-start'
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme={resolvedTheme}
                    storageKey='theme'
                    enableSystem
                    enableColorScheme
                >
                    {children}
                </ThemeProvider>
            </NextUIProvider>
        </AppProvider>
    )
}