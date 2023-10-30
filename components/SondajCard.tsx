/**
 * Renders a card component for a sondaj (poll) with details such as name, position, image, and votes.
 * @param {SondajProps} props - The props object containing sondaj details such as name, position, image, and votes.
 * @returns {JSX.Element} - A JSX element representing the sondaj card component.
 */
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AppContext } from './AppContext';
import Image from 'next/image';
import { firestoreDB } from '@/lib/firebase/fireabase.config';
import { deleteDoc, doc } from "firebase/firestore";
import { isAdmin } from '@/lib/firebase/auth';
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { motion } from 'framer-motion';
import { mergeProps, useHover, useLongPress, usePress } from 'react-aria'
import notify from '../lib/utils/toast';
import Sondaj from './Sondaj';
import AddEditSondaj from './AddEditSondaj';

export default function SondajCard(props: any) {
    const { nume, poza, updatedAt, createdAt, detalii, sursa, id, pozitie, tipSondaj, timestamp } = props;
    const [termsAgreed, setTermsAgreed] = useState(!!window.localStorage.getItem('termsAgreed'));
    const [isHovering, setIsHovering] = useState(false);
    const [votes, setVotes] = useState({ likes: 0, dislikes: 0, percent: 0, total: 0 });

    const context = useContext(AppContext);
    if (!context) {
        throw new Error('Sondaje must be used within an AppProvider');
    }
    const { modal, closeModal } = context;

    const { hoverProps, isHovered } = useHover({
        onHoverStart: (e) => { onHover() },
        onHoverEnd: (e) => { onHoverEnd() },
        onHoverChange: (e) => { onHoverChange() }
    })
    const { longPressProps } = useLongPress({
        accessibilityDescription: 'Long press to open sondaj',
        onLongPress: (e) => { setIsHovering(true); },
        onLongPressStart: (e) => { },
    })
    const { pressProps } = usePress({
        onPress: (e) => { onClick() },
        // onPressStart: (e) => { console.log(e.pointerType) },
        // onPressEnd: (e) => { onHoverEnd() },
        // onPressChange: (e) => { onHoverChange() }
    })

    const onHover = () => {
        setIsHovering(true);
    }

    //TODO: fix hovering when modal is closed
    const onHoverEnd = () => {
        setIsHovering(false);
    }

    const onHoverChange = () => {
        // setIsHovering(isHovering);
    }

    const onClick = () => {
        // console.log("item clicked");
        handleOpenSondajModal();
    }

    const handleCloseSondajModal = useCallback((id: string) => {
        closeModal(id);
        // clear searchParams from url
        const url = new URL(window.location.href);
        url.searchParams.delete('sondaj');
        url.searchParams.delete('commentsLimit');
        window.history.replaceState({}, '', url);

        // replace title in head
        const title = "Sondaj";
        const description = "O aplicatie sondaj";
        document.title = title;
        if (title) document.querySelector('meta[name="title"]')?.setAttribute("content", title);
        if (description) document.querySelector('meta[name="description"]')?.setAttribute("content", description);
        if (url) document.querySelector('meta[name="url"]')?.setAttribute("content", url.href);
    }, [closeModal]);

    const handleOpenSondajModal = useCallback(() => {
        const share = () => {
            const url = new URL(window.location.href);
            url.searchParams.set('sondaj', nume.replace(/ /g, '-'));
            url.searchParams.set('tipSondaj', tipSondaj);
            const title = `${nume}${pozitie ? ` - ${pozitie}` : ''}`;
            const description = detalii?.split('</p>')[0].replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
            const image = poza;
            const url2 = window.location.href;
            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: description,
                    url: url2,
                })
                    .then(() => {
                        notify({ text: 'Link shared' }, 'success', 'colored', 'bottom-right', 5000, true);
                    })
                    .catch((error) => {
                        notify({ text: error.message }, 'error', 'colored', 'bottom-right', 5000, true);
                    });
            } else {
                notify({ text: 'Web Share API not supported.' }, 'error', 'colored', 'bottom-right', 5000, true);
            }
        }
        modal({
            id: id as string,
            isOpen: true,
            onClose: () => handleCloseSondajModal(id as string),
            hideCloseButton: false,
            backdrop: 'blur',
            size: 'full',
            scrollBehavior: 'inside',
            isDismissable: false,
            modalHeader: `${nume}${pozitie ? ` - ${pozitie}` : ''}`,
            modalBody: <Sondaj
                id={id}
                nume={nume}
                detalii={detalii}
                sursa={sursa}
                poza={poza}
                createdAt={createdAt}
                updatedAt={updatedAt}
                tipSondaj={tipSondaj}
                pozitie={pozitie}
                timestamp={timestamp}
            />,
            headerDisabled: false,
            footerDisabled: false,
            footerButtonClick: share,
            footerButtonText: 'Share',
        });
        onHoverEnd();
        //add searchParams to url
        const url = new URL(window.location.href);
        url.searchParams.set('sondaj', nume.replace(/ /g, '-'));
        // url.searchParams.set('tipSondaj', props.tipSondaj);
        window.history.replaceState({}, '', url);
        // replace title in head
        const title = nume + " - " + pozitie;
        const description = detalii?.split('</p>')[0].replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
        const image = poza;
        const url2 = window.location.href;
        document.title = title;
        if (title) document.querySelector('meta[name="title"]')?.setAttribute("content", title);
        if (description) document.querySelector('meta[name="description"]')?.setAttribute("content", description);
        if (image) document.querySelector('meta[name="image"]')?.setAttribute("content", image);
        if (url2) document.querySelector('meta[name="url"]')?.setAttribute("content", url2);
    }, [modal, nume, pozitie, detalii, sursa, poza, createdAt, updatedAt, tipSondaj, timestamp, id, handleCloseSondajModal]);


    const deleteSondaj = useCallback(() => {
        if (!id) return;
        if (confirm(`Esti sigur ca vrei sa stergi sondajul ${nume}?`)) {
            deleteDoc(doc(firestoreDB, "sondaje", id)).then(() => {
                notify({ text: `Sondajul ${nume} a fost sters` }, 'success', 'colored', 'bottom-right', 5000, true);
            }).catch((error) => {
                notify({ text: error.message }, 'error', 'colored', 'bottom-right', 5000, true);
            });
        }
    }, [id, nume]);

    const editSonaj = useCallback(() => {
        modal({
            id: `edit-${id as string}`,
            isOpen: true,
            onClose: () => closeModal(`edit-${id as string}`),
            hideCloseButton: false,
            backdrop: 'blur',
            size: 'full',
            scrollBehavior: 'inside',
            isDismissable: false,
            modalHeader: `${nume}${pozitie ? ` - ${pozitie}` : ''}`,
            modalBody: <AddEditSondaj sondaj={props} onClose={() => {
                closeModal(`edit-${id as string}`)
                handleOpenSondajModal();
            }} />,
            headerDisabled: false,
            footerDisabled: true
        });

    }, [modal, nume, pozitie, id, closeModal, handleOpenSondajModal, props]);

    //useEffect to add target="_blank" to all links in detalii
    useEffect(() => {
        if (detalii) {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(detalii, 'text/html');
            const links = htmlDoc.querySelectorAll('a');
            links.forEach(link => {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            });
            // setDetalii(htmlDoc.body.innerHTML);
        }

    }, [detalii])

    const checkLocalStorage = useCallback(() => {
        const currentAgreement = !!window.localStorage.getItem('termsAgreed');
        if (currentAgreement !== termsAgreed) {
            setTermsAgreed(currentAgreement);
        }
    }, [termsAgreed]);

    // useEffect to check for query params and open sondaj modal
    useEffect(() => {
        const intervalId = setInterval(() => {
            checkLocalStorage();
        }, 1000);

        if (termsAgreed) {
            const checkForQueryParam = () => {
                const searchParams = new URLSearchParams(window.location.search);
                const querySondaj = searchParams.get('sondaj');
                if (querySondaj) {
                    const sondaj = querySondaj.replace(/-/g, ' ');
                    if (sondaj === nume.toLowerCase() || sondaj === nume) {
                        clearInterval(intervalId);
                        handleOpenSondajModal();
                    }
                }
            };
            checkForQueryParam();
        }
        return () => clearInterval(intervalId);
    }, [termsAgreed, nume, handleOpenSondajModal, checkLocalStorage]);

    //useEffect to calculate votes
    useEffect(() => {
        if (props.votes) {
            // console.log(props.votes);
            const upVotes = props.votes.filter((vote: any) => vote.vot === true).length;
            const downVotes = props.votes.filter((vote: any) => vote.vot === false).length;
            const totalVotes = upVotes + downVotes;
            const percent = Math.round((upVotes / totalVotes) * 100);
            setVotes({ likes: upVotes, dislikes: downVotes, percent: percent, total: totalVotes });
        }
    }, [props.votes])

    //useEffect to check for hover
    useEffect(() => {
        if (isHovered) {
            // console.log("item hovered");
        }
    }, [isHovered])

    return (
        <div {...hoverProps}>
            <Card
                isFooterBlurred
                radius="lg"
                className={`group border border-white/20 rounded-md w-[300px] min-h-[176px] m-2 col-span-12 sm:col-span-5 hover:scale-105 transition-all ease-in-out`}
                isPressable
                isHoverable
            // onPress={onClick}
            >
                <CardBody className="overflow-visible p-0" {...mergeProps(pressProps, longPressProps)}>
                    <div className='w-[300px] h-[176px] relative '>
                        <Image
                            alt={nume}
                            fill
                            priority
                            sizes='300px'
                            src={poza}
                        />
                    </div>
                    {isAdmin() &&
                        <div className="flex flex-row justify-end w-full items-center absolute gap-2 p-2">
                            <div className="flex flex-col w-[30px] items-center justify-center p-1 rounded-md border border-white/20 bg-blue-500"
                                onClick={editSonaj}
                            >
                                E
                            </div>
                            <div
                                className="flex flex-col w-[30px] items-center justify-center p-1 rounded-md border border-white/20 bg-red-500"
                                onClick={deleteSondaj}
                            >
                                D
                            </div>
                        </div>
                    }
                    <CardFooter className="justify-center before:bg-white/10 border-white/20 border overflow-hidden py-1 absolute before:rounded-xl rounded-lg bottom-2 w-[calc(100%-8px)] shadow-small ml-1 z-10">
                        <span className="text-lg md:text-base font-black text-center text-white text-stroke text-stroke-gray-800">{nume}{pozitie ? ` - ${pozitie}` : ''}</span>
                    </CardFooter>
                    {votes.total > 0 &&
                        <motion.div
                            className={`absolute bottom-0 w-full rounded-full bg-red-600 transition-all ease-in-out duration-1000`}
                        >
                            <motion.div
                                className={` bg-green-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none ${votes.percent > 99 ? 'rounded-full' : 'rounded-l-full'} transition-all ease-in-out duration-1000 `}
                                style={{ width: `${votes.percent}%` }}
                            >
                            </motion.div>
                        </motion.div>
                    }
                </CardBody>
                <motion.div
                    animate={{
                        opacity: isHovering ? 1 : 0,
                        height: isHovering ? 'auto' : 0,
                        padding: isHovering ? '0.5rem' : 0,
                        transition: {
                            duration: 0.5,
                            delay: 0.3,
                            ease: "easeInOut"
                        },
                    }}
                    className={`h-0 opacity-0 justify-center before:bg-white/10 border-white/20 border-t z-10`}>
                    <div className="flex flex-col items-center" dangerouslySetInnerHTML={{ __html: detalii.split('</p>')[0] }}></div>
                </motion.div>

            </Card>

        </div>
    )
}