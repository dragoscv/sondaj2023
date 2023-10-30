/**
 * Firebase authentication functions.
 * @packageDocumentation
 */

import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged as _onAuthStateChanged,
    Auth,
    User
} from "firebase/auth";

import { firebaseAuth } from "@/lib/firebase/fireabase.config";

/**
 * The Firebase authentication object.
 */
const auth: Auth = firebaseAuth;

/**
 * Calls the provided function when the user's sign-in state changes.
 * @param cb - The function to call when the user's sign-in state changes.
 * @returns A function to unsubscribe from the listener.
 */
export function onAuthStateChanged(cb: (user: any) => void) {
    return _onAuthStateChanged(auth, cb);
}

/**
 * Signs in the user with Google.
 */
export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error signing in with Google", error);
    }
}

/**
 * Signs out the current user.
 * @returns A promise that resolves when the user is signed out.
 */
export async function signOut() {
    try {
        return auth.signOut();
    } catch (error) {
        console.error("Error signing out with Google", error);
    }
}

/**
 * Gets the current user.
 * @returns An object containing the current user.
 */
export function currentUser() {
    const currentUser: User | null = auth.currentUser;
    return { currentUser };
}

/**
 * Checks if the current user is an admin.
 * @returns A boolean indicating if the current user is an admin.
 */
export function isAdmin() {
    const currentUser: User | null = auth.currentUser;
    const admin = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    return currentUser?.email === admin;
}