/**
 * Header component that displays the navigation bar and user information.
 * @returns ReactNode
 */
'use client'

import { useEffect, useCallback, useContext } from "react";
import { useUserSession } from "@/lib/utils/auth";
import { signOut, isAdmin } from "@/lib/firebase/auth";
import { AppContext } from "./AppContext";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownSection,
    Avatar,
    Tooltip,
    User as UserUI
} from "@nextui-org/react";
import { ThemeSwitcher } from './ThemeSwitcher';
import Login from './Login';
import AddEditSondaj from './AddEditSondaj';
import Terms from './Terms';
import Sugestii from './Sugestii';
import notify from "@/lib/utils/toast";
import { ModalProps } from "@/types";
import Image from "next/image";

export default function Header() {
    const { user } = useUserSession();

    const context = useContext(AppContext);
    if (!context) {
        throw new Error('Sondaje must be used within an AppProvider');
    }
    const { modal, closeModal } = context;

    const handleCloseModal = useCallback((id: string) => {
        // console.log('close modal')
        closeModal(id);

        const url = new URL(window.location.href);
        url.searchParams.delete('action');
        window.history.replaceState({}, '', url);
    }, [closeModal]);

    const handleOpenModal = useCallback(({
        id, isOpen, hideCloseButton, backdrop, size, scrollBehavior, isDismissable, modalHeader, modalBody, headerDisabled, footerDisabled, footerButtonClick, footerButtonText, noReplaceURL
    }: ModalProps) => {
        modal({
            id,
            isOpen,
            onClose: () => handleCloseModal(id),
            hideCloseButton,
            backdrop,
            size,
            scrollBehavior,
            isDismissable,
            modalHeader,
            modalBody,
            headerDisabled,
            footerDisabled,
            footerButtonClick,
            footerButtonText,
            noReplaceURL
        });

        if (!noReplaceURL) {
            //add searchParams to url
            const url = new URL(window.location.href);
            url.searchParams.set('action', modalHeader.toLowerCase().replace(/ /g, '-'))
            window.history.replaceState({}, '', url);
        }

    }, [modal, handleCloseModal]);



    const handleSignOut = () => {
        signOut().then(() => {
            notify({ text: 'Deautentificare cu succes' }, 'success');
        }).catch((error) => {
            notify({ text: `Deautentificare cu succes dar, ${error.message}` }, 'error');
        });
    }

    useEffect(() => {
        const termsAgreed = window.localStorage.getItem('termsAgreed');
        const searchParams = new URLSearchParams(window.location.search);
        const action = searchParams.get('action');
        if (!termsAgreed) {
            // console.log('terms not agreed')

            handleOpenModal({
                id: 'terms',
                isOpen: true,
                hideCloseButton: true,
                backdrop: 'blur',
                size: 'full',
                scrollBehavior: 'inside',
                isDismissable: false,
                modalHeader: 'Termeni si conditii',
                modalBody: <Terms onClose={() => closeModal('terms')} />,
                headerDisabled: true,
                footerDisabled: true,
                noReplaceURL: true
            })
        }

        const interval = setInterval(() => {
            const termsAgreed = window.localStorage.getItem('termsAgreed');
            if (termsAgreed) {
                checkForQueryParam();
                clearInterval(interval);
            }
        }, 1000);

        const checkForQueryParam = () => {

            if (action) {
                switch (action) {
                    case 'autentificare':
                        handleOpenModal({
                            id: 'login',
                            isOpen: true,
                            hideCloseButton: false,
                            backdrop: 'blur',
                            size: 'full',
                            scrollBehavior: 'inside',
                            isDismissable: false,
                            modalHeader: 'Autentificare',
                            modalBody: <Login onClose={() => closeModal('login')} />,
                            headerDisabled: true,
                            footerDisabled: true,
                            noReplaceURL: true
                        })
                        break;
                    case 'sugestii':
                        handleOpenModal({
                            id: 'sugestii',
                            isOpen: true,
                            hideCloseButton: false,
                            backdrop: 'blur',
                            size: 'full',
                            scrollBehavior: 'inside',
                            isDismissable: true,
                            modalHeader: 'Sugestii',
                            modalBody: <Sugestii />,
                            headerDisabled: false,
                            footerDisabled: true,
                            noReplaceURL: true
                        })
                        break;
                    case 'termeni-si-conditii':
                        handleOpenModal({
                            id: 'terms',
                            isOpen: true,
                            hideCloseButton: true,
                            backdrop: 'blur',
                            size: 'full',
                            scrollBehavior: 'inside',
                            isDismissable: false,
                            modalHeader: 'Termeni si conditii',
                            modalBody: <Terms onClose={() => closeModal('terms')} />,
                            headerDisabled: true,
                            footerDisabled: true,
                            noReplaceURL: true
                        })
                        break;
                    default:
                        break;
                }
            }
        }


    }, [handleOpenModal, closeModal]);

    const handleDropdownClick = (e: any) => {
        console.log(e.target)
    }

    const handleDropdownTrigger = (e: any) => {
        console.log('trigger', e.target)
    }


    return (
        <>
            <Navbar
                shouldHideOnScroll
                maxWidth='full'
                className='flex flex-row w-full flex-wrap justify-between items-center border-b border-b-gray-200 dark:border-b-gray-200/20 mx-0'
            >
                <NavbarBrand
                >
                    <Image
                        src="/logo-transparent.svg"
                        alt="Sondaj"
                        priority
                        width={50}
                        height={50}
                    />
                    <span className="self-center whitespace-nowrap text-lg font-semibold dark:text-white ml-2">
                        Sondaj
                    </span>
                </NavbarBrand>
                <NavbarContent justify='end' as='div'>
                    <ThemeSwitcher />
                    <Dropdown
                        backdrop="blur"
                        placement="bottom-end"
                        // showArrow={true}
                        classNames={{
                            base: "py-1 px-1 border rounded-lg border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-gray-500 dark:to-black z-50",
                            arrow: "bg-default-200",
                            backdrop: "pointer-events-none"
                        }}
                    >
                        <DropdownTrigger
                            className="z-50 cursor-pointer"
                        >
                            <Avatar
                                isBordered
                                // as="button"
                                className="transition-transform z-50"
                                color="secondary"
                                name={user?.displayName ? user.displayName : 'User'}
                                size="sm"
                                src={user?.photoURL ? user.photoURL : "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Profile Actions"
                            variant="faded"
                            itemClasses={{
                                base: [
                                    "rounded-md",
                                    "text-sm",
                                    "transition-opacity",
                                    "data-[hover=true]:text-foreground",
                                    "data-[hover=true]:bg-default-100",
                                    "dark:data-[hover=true]:bg-default-50",
                                    "data-[selectable=true]:focus:bg-default-50",
                                    "data-[pressed=true]:opacity-70",
                                    "data-[focus-visible=true]:ring-default-500",
                                ],
                            }}
                            className="z-50"
                        >
                            <DropdownSection
                                aria-label="Profile & Actions"
                                showDivider
                                className={`${user ? '' : 'hidden'}`}
                            >
                                <DropdownItem
                                    isReadOnly
                                    key="profile"
                                    className="h-14 gap-2 opacity-100"
                                    textValue='Profile'
                                >
                                    <UserUI
                                        name={user?.displayName}
                                        description={user?.email}
                                        classNames={{
                                            name: "text-default-600",
                                            description: "text-default-500",
                                        }}
                                        avatarProps={{
                                            size: "sm",
                                            src: user?.photoURL ? user.photoURL : 'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
                                        }}
                                    />
                                </DropdownItem>
                                <DropdownItem
                                    key="addNew"
                                    textValue='Adauga sondaj'
                                    className='p-0'
                                >
                                    {isAdmin() && (
                                        <div
                                            className='cursor-pointer hover:bg-slate-800/40 rounded-lg p-2'
                                            onClick={() => handleOpenModal({
                                                id: 'addNew',
                                                isOpen: true,
                                                hideCloseButton: false,
                                                backdrop: 'blur',
                                                size: 'full',
                                                scrollBehavior: 'inside',
                                                isDismissable: true,
                                                modalHeader: 'Adauga un nou sondaj',
                                                modalBody: <AddEditSondaj onClose={() => closeModal('addNew')} />,
                                                headerDisabled: false,
                                                footerDisabled: true,
                                                noReplaceURL: true
                                            })}
                                        >
                                            Adauga sondaj
                                        </div>
                                    )}
                                </DropdownItem>
                            </DropdownSection>


                            <DropdownSection aria-label="Help & Feedback">
                                <DropdownItem
                                    key="sugestii"
                                    textValue='Sugestii'
                                    className='p-0'
                                >
                                    <div
                                        className='cursor-pointer hover:bg-slate-800/40 rounded-lg p-2'
                                        onClick={() => handleOpenModal({
                                            id: 'sugestii',
                                            isOpen: true,
                                            hideCloseButton: false,
                                            backdrop: 'blur',
                                            size: 'full',
                                            scrollBehavior: 'inside',
                                            isDismissable: true,
                                            modalHeader: 'Sugestii',
                                            modalBody: <Sugestii />,
                                            headerDisabled: false,
                                            footerDisabled: true,
                                            noReplaceURL: true
                                        })}
                                    >
                                        Sugestii
                                    </div>
                                </DropdownItem>
                                <DropdownItem
                                    key="statistici"
                                    textValue='Statistici'
                                    className='p-0'
                                >
                                    <div
                                        className='hover:bg-[rgb(243,209,18)]/20 hover:text-[rgb(243,209,18)] rounded-lg p-2'
                                    >
                                        Statistici (in curand)
                                    </div>
                                </DropdownItem>
                                <DropdownItem
                                    key="donate"
                                    textValue='Donate'
                                    className='p-0'
                                >
                                    <div
                                        className='cursor-pointer hover:bg-[rgb(18,52,243)]/20 hover:text-[rgb(143,159,252)] rounded-lg p-2'
                                        onClick={() => window.open('https://github.com/sponsors/dragoscv', '_blank')}
                                    >
                                        Doneaza
                                    </div>
                                </DropdownItem>
                                <DropdownItem
                                    key="terms"
                                    textValue='Termeni si conditii'
                                    className='p-0'
                                >
                                    <div
                                        className='cursor-pointer hover:bg-slate-800/40 rounded-lg p-2'
                                        onClick={() => handleOpenModal({
                                            id: 'terms',
                                            isOpen: true,
                                            hideCloseButton: true,
                                            backdrop: 'blur',
                                            size: 'full',
                                            scrollBehavior: 'inside',
                                            isDismissable: false,
                                            modalHeader: 'Termeni si conditii',
                                            modalBody: <Terms onClose={() => closeModal('terms')} />,
                                            headerDisabled: true,
                                            footerDisabled: true,
                                            noReplaceURL: true
                                        })}
                                    >
                                        Termeni si conditii
                                    </div>
                                </DropdownItem>
                                <DropdownItem
                                    key="account"
                                    textValue='Account'
                                    color="danger"
                                    className='p-0'
                                >
                                    {user ? (
                                        <div
                                            className='cursor-pointer hover:bg-[rgb(243,18,96)]/20 hover:text-[rgb(243,18,96)] rounded-lg p-2'
                                            onClick={handleSignOut}
                                        >
                                            Deautentificare
                                        </div>
                                    ) : (
                                        <div
                                            className='cursor-pointer hover:bg-[rgb(18,243,67)]/20 hover:text-[rgb(18,243,67)] rounded-lg p-2'
                                            onClick={() => handleOpenModal({
                                                id: 'login',
                                                isOpen: true,
                                                hideCloseButton: false,
                                                backdrop: 'blur',
                                                size: 'full',
                                                scrollBehavior: 'inside',
                                                isDismissable: false,
                                                modalHeader: 'Autentificare',
                                                modalBody: <Login onClose={() => closeModal('login')} />,
                                                headerDisabled: true,
                                                footerDisabled: true,
                                                noReplaceURL: true
                                            })}
                                        >
                                            Autentificare
                                        </div>
                                    )}
                                </DropdownItem>
                                <DropdownItem
                                    key="social"
                                    textValue='Social'
                                    color="danger"
                                    className='p-0'
                                >
                                    <div className='flex flex-row justify-between items-center w-full'>
                                        <div
                                            className='cursor-pointer hover:bg-[rgb(59,89,152)]/20 hover:text-[rgb(59,89,152)] rounded-lg p-2'
                                            onClick={() => window.open('https://github.com/dragoscv/sondaj2023', '_blank')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill='currentColor' viewBox="0 0 20 20" version="1.1">

                                                <title>https://github.com/dragoscv/sondaj2023</title>
                                                <desc>Created with Sketch.</desc>
                                                <defs>

                                                </defs>
                                                <g id="Page-1" stroke="currentColor" strokeWidth="1" fill="currentColor" fillRule="evenodd">
                                                    <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)" fill="currentColor">
                                                        <g id="icons" transform="translate(56.000000, 160.000000)">
                                                            <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399" id="github-[#142]">

                                                            </path>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                        </div>
                                        <div
                                            className='cursor-pointer hover:bg-[rgb(59,89,152)]/20 hover:text-[rgb(59,89,152)] rounded-lg p-2'
                                            onClick={() => window.open('https://dragoscatalin.ro', '_blank')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="currentColor">
                                                <title>https://dragoscatalin.ro</title>
                                                <g id="style=linear" clipPath="url(#clip0_1_1825)">
                                                    <g id="web">
                                                        <path id="vector" d="M7.8 12L7.05 12L7.8 12ZM16.2 12H16.95H16.2ZM12 16.2V16.95V16.2ZM14.1729 22.2749L14.3273 23.0088L14.1729 22.2749ZM9.82712 22.2749L9.67269 23.0088L9.82712 22.2749ZM2.27554 8.03225L1.58122 7.74867H1.58122L2.27554 8.03225ZM1.7251 14.1729L0.991173 14.3273L1.7251 14.1729ZM9.82712 1.7251L9.67269 0.991173L9.82712 1.7251ZM14.1729 1.7251L14.3273 0.991174L14.1729 1.7251ZM21.6399 8.07014L21.8576 8.78785L21.6399 8.07014ZM2.35887 8.06976L2.14116 8.78747L2.35887 8.06976ZM21.0312 8.3185C21.4944 9.45344 21.75 10.6959 21.75 12H23.25C23.25 10.4983 22.9553 9.06352 22.42 7.75174L21.0312 8.3185ZM21.75 12C21.75 12.6927 21.6779 13.3678 21.541 14.0184L23.0088 14.3273C23.167 13.5757 23.25 12.7972 23.25 12H21.75ZM21.541 14.0184C20.7489 17.7827 17.7828 20.7489 14.0184 21.541L14.3273 23.0088C18.6735 22.0943 22.0943 18.6735 23.0088 14.3273L21.541 14.0184ZM14.0184 21.541C13.3678 21.6779 12.6927 21.75 12 21.75V23.25C12.7972 23.25 13.5757 23.167 14.3273 23.0088L14.0184 21.541ZM12 21.75C11.3072 21.75 10.6322 21.6779 9.98156 21.541L9.67269 23.0088C10.4242 23.167 11.2028 23.25 12 23.25V21.75ZM2.25 12C2.25 10.6949 2.50601 9.45149 2.96986 8.31584L1.58122 7.74867C1.0451 9.06127 0.75 10.4971 0.75 12H2.25ZM9.98156 21.541C6.21724 20.7489 3.25112 17.7827 2.45903 14.0184L0.991173 14.3273C1.90571 18.6735 5.32647 22.0943 9.67269 23.0088L9.98156 21.541ZM2.45903 14.0184C2.32213 13.3678 2.25 12.6927 2.25 12H0.75C0.75 12.7972 0.83303 13.5757 0.991173 14.3273L2.45903 14.0184ZM2.96986 8.31584C4.17707 5.36016 6.79381 3.1298 9.98155 2.45903L9.67269 0.991173C5.99032 1.76602 2.97369 4.33941 1.58122 7.74867L2.96986 8.31584ZM9.98155 2.45903C10.6322 2.32213 11.3072 2.25 12 2.25V0.75C11.2028 0.75 10.4242 0.83303 9.67269 0.991173L9.98155 2.45903ZM12 2.25C12.6927 2.25 13.3678 2.32213 14.0184 2.45903L14.3273 0.991174C13.5757 0.833031 12.7972 0.75 12 0.75V2.25ZM14.0184 2.45903C17.2071 3.13 19.8245 5.3615 21.0312 8.3185L22.42 7.75174C21.0281 4.34096 18.0108 1.76625 14.3273 0.991174L14.0184 2.45903ZM13.4584 1.95309C13.7482 2.8614 14.8215 6.35621 15.2615 9.5682L16.7476 9.36461C16.289 6.01664 15.1813 2.41835 14.8874 1.49712L13.4584 1.95309ZM15.2615 9.5682C15.3795 10.4292 15.45 11.2568 15.45 12L16.95 12C16.95 11.1681 16.8715 10.269 16.7476 9.36461L15.2615 9.5682ZM21.4222 7.35242C20.2692 7.70212 18.1033 8.3164 15.8685 8.72886L16.1407 10.204C18.4546 9.7769 20.6809 9.14473 21.8576 8.78785L21.4222 7.35242ZM15.8685 8.72886C14.5129 8.97904 13.1579 9.15 12 9.15L12 10.65C13.2874 10.65 14.743 10.4619 16.1407 10.204L15.8685 8.72886ZM15.45 12C15.45 13.1009 15.2954 14.3808 15.0647 15.671L16.5413 15.935C16.7797 14.6019 16.95 13.2252 16.95 12L15.45 12ZM15.0647 15.671C14.5591 18.4992 13.7097 21.2593 13.4584 22.0469L14.8874 22.5029C15.145 21.6956 16.0181 18.8613 16.5413 15.935L15.0647 15.671ZM22.0469 13.4584C21.2593 13.7097 18.4992 14.5591 15.671 15.0647L15.935 16.5413C18.8613 16.0181 21.6956 15.145 22.5029 14.8874L22.0469 13.4584ZM15.671 15.0647C14.3808 15.2954 13.1009 15.45 12 15.45L12 16.95C13.2252 16.95 14.6019 16.7797 15.935 16.5413L15.671 15.0647ZM12 15.45C10.8991 15.45 9.61923 15.2954 8.32897 15.0647L8.06496 16.5413C9.39807 16.7797 10.7748 16.95 12 16.95L12 15.45ZM8.32897 15.0647C5.50076 14.5591 2.74066 13.7097 1.95309 13.4584L1.49712 14.8874C2.30437 15.145 5.13873 16.0181 8.06496 16.5413L8.32897 15.0647ZM7.05 12C7.05 13.2252 7.22032 14.6019 7.45867 15.935L8.93526 15.671C8.70456 14.3808 8.55 13.1009 8.55 12L7.05 12ZM7.45867 15.935C7.98188 18.8613 8.85504 21.6956 9.11261 22.5029L10.5416 22.0469C10.2903 21.2593 9.44094 18.4992 8.93526 15.671L7.45867 15.935ZM9.11261 1.49712C8.81867 2.41835 7.711 6.01664 7.25235 9.36461L8.73846 9.5682C9.17849 6.35621 10.2518 2.8614 10.5416 1.95309L9.11261 1.49712ZM7.25235 9.36461C7.12846 10.269 7.05 11.1681 7.05 12L8.55 12C8.55 11.2568 8.62052 10.4292 8.73846 9.5682L7.25235 9.36461ZM12 9.15C10.8421 9.15 9.4871 8.97904 8.13152 8.72886L7.85929 10.204C9.25697 10.4619 10.7126 10.65 12 10.65L12 9.15ZM8.13152 8.72886C5.89586 8.31625 3.72921 7.70168 2.57657 7.35205L2.14116 8.78747C3.3175 9.14428 5.54457 9.77675 7.85929 10.204L8.13152 8.72886ZM21.38 7.3695C21.3919 7.3633 21.4065 7.35719 21.4222 7.35242L21.8576 8.78785C21.933 8.76498 22.0039 8.73569 22.0712 8.70074L21.38 7.3695ZM1.88425 8.67209C1.96322 8.72038 2.04888 8.75948 2.14116 8.78747L2.57657 7.35205C2.60983 7.36214 2.64048 7.3763 2.66683 7.39242L1.88425 8.67209Z" fill="currentColor" />
                                                    </g>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_1_1825">
                                                        <rect width="24" height="24" fill="currentColor" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                        <div
                                            className='cursor-pointer hover:bg-[rgb(59,89,152)]/20 hover:text-[rgb(59,89,152)] rounded-lg p-2'
                                            onClick={() => window.open('https://tiktok.com/@dragoscatalin.ro', '_blank')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20px" height="20px" viewBox="0 0 32 32" version="1.1">
                                                <title>https://tiktok.com/@dragoscatalin.ro</title>
                                                <path d="M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z" />
                                            </svg>
                                        </div>
                                        <div
                                            className='cursor-pointer hover:bg-[rgb(59,89,152)]/20 hover:text-[rgb(59,89,152)] rounded-lg p-2'
                                            onClick={() => window.open('https://instagram.com/dragoscatalin.ro', '_blank')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="currentColor">
                                                <title>https://instagram.com/dragoscatalin.ro</title>
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor" />
                                                <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="currentColor" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="currentColor" />
                                            </svg>
                                        </div>
                                    </div>

                                </DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            </Navbar>
        </>
    )
}