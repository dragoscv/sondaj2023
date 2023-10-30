import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@nextui-org/react";

import { ModalProps } from "@/types";

/**
 * A customizable modal component that can be used to display content and actions to the user.
 * @param isOpen - Whether the modal is currently open or not.
 * @param onClose - Function to be called when the modal is closed.
 * @param hideCloseButton - Whether to hide the close button or not.
 * @param backdrop - Whether to show the backdrop or not.
 * @param size - The size of the modal.
 * @param scrollBehavior - The scroll behavior of the modal.
 * @param isDismissable - Whether the modal can be dismissed or not.
 * @param modalHeader - The header content of the modal.
 * @param modalBody - The body content of the modal.
 * @param footerDisabled - Whether to disable the footer or not.
 * @param footerButtonClick - Function to be called when the footer button is clicked.
 * @param footerButtonText - The text to be displayed on the footer button.
 * @param classNames - Custom class names to be applied to the modal.
 * @returns A modal component.
 */
export default function ModalComponent({ isOpen, onClose, hideCloseButton, backdrop, size, scrollBehavior, isDismissable, modalHeader, modalBody, footerDisabled, footerButtonClick, footerButtonText, classNames }: ModalProps) {

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            hideCloseButton={hideCloseButton}
            backdrop={backdrop ? backdrop : 'blur'}
            size={size}
            classNames={{
                backdrop: "z-50 backdrop-blur-md backdrop-saturate-150 bg-white/70 dark:bg-black/60 w-screen max-h-[100dvh] fixed inset-0"
            }}
            scrollBehavior={scrollBehavior}
            isDismissable={isDismissable}
        >
            <ModalContent
                className='max-h-[100dvh] overflow-hidden'
            >
                {(onClose) => (
                    <>
                        <ModalHeader>
                            {modalHeader}
                        </ModalHeader>
                        <ModalBody
                            className='flex flex-col gap-2 w-full'
                        >
                            {modalBody}
                        </ModalBody>
                        {!footerDisabled &&
                            <ModalFooter className='flex flex-row justify-between gap-2 z-50'>
                                <div className='flex flex-row justify-start gap-2 cursor-pointer'
                                    onClick={footerButtonClick}
                                >
                                    {footerButtonText}
                                </div>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Inchide
                                </Button>
                            </ModalFooter>
                        }
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}