/**
 * Toast component that displays a message to the user.
 * @param props - The props object containing the text to display.
 * @returns A JSX element that displays the message.
 */
const ToastComponent = ({ props }: any) => {

    return (
        <div className="flex flex-row items-center justify-start">
            {props.text &&
                <div className="flex flex-col w-full items-start justify-start p-2">
                    <div className="max-w-sm flex flex-row items-start justify-start p-2">
                        {props.text}
                    </div>
                </div>
            }
        </div>
    )
}

export default ToastComponent;