import { onAuthStateChanged, User } from 'firebase/auth'
import { useEffect, useState } from 'react'

import { firebaseAuth } from '@/lib/firebase/fireabase.config'

/**
 * Custom hook to get the current user session from Firebase Authentication.
 * @returns An object containing the current user session.
 */
export function useUserSession() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (authUser) => {
            authUser ? setUser(authUser) : setUser(null)
        })

        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { user }
}