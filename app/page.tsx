import MainTabs from '../components/MainTabs';
import type { Metadata } from 'next'

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
    applicationName: 'Sondaj',
    manifest: '/manifest.json',
    description: 'O aplicatie sondaj',
    title: 'Sondaj',
}

/**
 * Renders the Home page component.
 * @returns The Home page component.
 */
export default function Home() {

    return (
        <main className="flex flex-grow justify-center">
            <MainTabs />
        </main>
    )
}
