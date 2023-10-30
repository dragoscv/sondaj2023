/**
 * Logs an analytics event with the given name and parameters.
 * @param name - The name of the event to log.
 * @param params - (Optional) The parameters to include with the event.
 * @returns A Promise that resolves when the event is logged.
 */
import { logEvent, Analytics } from "firebase/analytics";

import { firebaseAnalytics } from "./fireabase.config";

export async function logAnalyticsEvent(name: string, params?: any) {
    const analytics = await firebaseAnalytics;
    if (analytics) {
        logEvent(analytics, name, params);
    }
}


