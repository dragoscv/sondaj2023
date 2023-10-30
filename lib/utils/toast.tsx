import { toast, TypeOptions, ToastPosition, Theme } from 'react-toastify';
import ToastComponent from "../../components/Toast";

/**
 * Displays a toast notification with the given message and options.
 * @param message - The message to display in the toast notification.
 * @param type - The type of the toast notification (default, success, error, warning, info).
 * @param theme - The theme of the toast notification (colored or dark).
 * @param position - The position of the toast notification on the screen.
 * @param autoClose - The time in milliseconds after which the toast notification will automatically close.
 * @param pauseOnHover - Whether to pause the autoClose timer when the user hovers over the toast notification.
 */
const notify = (message: any, type?: TypeOptions, theme?: Theme, position?: ToastPosition, autoClose?: number, pauseOnHover?: boolean) => {

    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'colored'
    const currentToast = toast(message.text, {
        position: position || "bottom-right",
        autoClose: autoClose || 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        pauseOnHover: pauseOnHover || true,
        theme: theme || colorScheme,
        type: type || 'default',
        bodyClassName: 'w-full flex flex-row items-center justify-start',
        className: 'w-full flex flex-row items-center justify-start z-50',

    });
    toast.update(currentToast, {
        render: <ToastComponent props={message} />,
    });
}

export default notify;
