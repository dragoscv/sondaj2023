/**
 * Renders a component that displays the votes for a given sondaj.
 * @param {VotesProps} props - The props object containing the sondajId.
 * @returns {JSX.Element} - The JSX element representing the Votes component.
 */
import React, { useCallback, useEffect, useState, useContext } from "react";
import { AppContext } from './AppContext';
import { useUserSession } from "@/lib/utils/auth";
import Login from './Login';
import notify from "../lib/utils/toast";
import { motion } from "framer-motion";

import { VotesProps, VoteProps, SondajProps } from "@/types";

export default function Votes({ sondajId }: VotesProps) {
    const { user } = useUserSession();

    const [currentSondajData, setCurrentSondajData] = useState<SondajProps | null>(null);
    const [percent, setPercent] = useState(0);
    const [voturi, setVoturi] = useState<VoteProps[]>([]);
    const [voturiPentru, setVoturiPentru] = useState(0);
    const [voturiImpotriva, setVoturiImpotriva] = useState(0);
    const [totalVoturi, setTotalVoturi] = useState(0);
    const [tempVote, setTempVote] = useState<boolean | null>(null);

    const context = useContext(AppContext);
    if (!context) {
        throw new Error('Sondaje must be used within an AppProvider');
    }
    const { castVote, changeCurrentSondaj, sondajeData, modal, closeModal } = context;

    const vote = useCallback(async (vot: boolean) => {
        if (!user) {
            modal({
                id: 'login',
                onClose: () => closeModal('login'),
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
            setTempVote(vot);
            return;
        }
        setTempVote(null);
        castVote(sondajId, user?.uid as string, vot)
            .then(() => {
                notify({ text: 'Votul tau a fost inregistrat cu succes!' }, 'success');
            })
            .catch((error: any) => {
                notify({ text: error.message }, 'error');
            });
    }, [sondajId, user, castVote, closeModal, modal]);

    useEffect(() => {
        if (!user) return;
        if (!sondajeData) return;
        const currentSondaj: SondajProps = sondajeData.flat.find((sondaj: SondajProps) => sondaj.id === sondajId);
        if (!currentSondaj) return;
        setCurrentSondajData(currentSondaj);
        if (!currentSondaj.votes?.length) changeCurrentSondaj(sondajId);

    }, [sondajeData, sondajId, changeCurrentSondaj, user]);

    useEffect(() => {
        if (!currentSondajData || !currentSondajData?.votes) return;
        setVoturi(currentSondajData.votes);
        const voturi = currentSondajData.votes;
        const voturiPentru = voturi.filter((vot) => vot.vot === true).length;
        const voturiImpotriva = voturi.filter((vot) => vot.vot === false).length;
        const totalVoturi = voturi.length || 0;
        const percent = Math.round((voturiPentru / totalVoturi) * 100);
        setVoturiPentru(voturiPentru);
        setVoturiImpotriva(voturiImpotriva);
        setTotalVoturi(totalVoturi);
        setPercent(percent);
    }, [currentSondajData]);

    useEffect(() => {
        if (user) {
            if (tempVote !== null) {
                vote(tempVote);
            }
        }
    }, [tempVote, vote, user]);

    return (
        <>
            <motion.div
                className="flex flex-col w-full py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.1, ease: 'easeInOut' }}
            >
                <div className="flex flex-row justify-center mb-1">
                    {/* <span className="text-base font-medium text-blue-700 dark:text-white">Tu ai vota pentru sau impotriva?</span> */}
                </div>
                <div className="inline-flex justify-center rounded-md shadow-sm" role="group">
                    <button type="button" className="inline-flex gap-2 items-center px-4 py-2 text-sm font-medium text-gray-900 bg-green-700 border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-green-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white transition-all ease-in-out duration-1000"
                        onClick={() => vote(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 -0.5 21 21" version="1.1">

                            <title>like [#1385]</title>
                            <desc>Created with Sketch.</desc>
                            <defs>

                            </defs>
                            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Dribbble-Light-Preview" transform="translate(-259.000000, -760.000000)" fill="#ffffff">
                                    <g id="icons" transform="translate(56.000000, 160.000000)">
                                        <path d="M203,620 L207.200006,620 L207.200006,608 L203,608 L203,620 Z M223.924431,611.355 L222.100579,617.89 C221.799228,619.131 220.638976,620 219.302324,620 L209.300009,620 L209.300009,608.021 L211.104962,601.825 C211.274012,600.775 212.223214,600 213.339366,600 C214.587817,600 215.600019,600.964 215.600019,602.153 L215.600019,608 L221.126177,608 C222.97313,608 224.340232,609.641 223.924431,611.355 L223.924431,611.355 Z" id="like-[#1385]">

                                        </path>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        {(voturi.find((vot: any) => vot.uid === user?.uid)?.vot === true) && '(ales)'}
                    </button>
                    <button type="button" className="inline-flex gap-2 items-center px-4 py-2 text-sm font-medium text-gray-900 bg-red-700 border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-red-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white transition-all ease-in-out duration-1000"
                        onClick={() => vote(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 -0.5 21 21" version="1.1">

                            <title>dislike [#1388]</title>
                            <desc>Created with Sketch.</desc>
                            <defs>

                            </defs>
                            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Dribbble-Light-Preview" transform="translate(-139.000000, -760.000000)" fill="#ffffff">
                                    <g id="icons" transform="translate(56.000000, 160.000000)">
                                        <path d="M101.900089,600 L99.8000892,600 L99.8000892,611.987622 L101.900089,611.987622 C103.060339,611.987622 104.000088,611.093545 104.000088,609.989685 L104.000088,601.997937 C104.000088,600.894077 103.060339,600 101.900089,600 M87.6977917,600 L97.7000896,600 L97.7000896,611.987622 L95.89514,618.176232 C95.6819901,619.491874 94.2455904,620.374962 92.7902907,619.842512 C91.9198408,619.52484 91.400091,618.66273 91.400091,617.774647 L91.400091,612.986591 C91.400091,612.43516 90.9296911,611.987622 90.3500912,611.987622 L85.8728921,611.987622 C84.0259425,611.987622 82.6598928,610.35331 83.0746427,608.641078 L84.8995423,602.117813 C85.1998423,600.878093 86.360092,600 87.6977917,600" id="dislike-[#1388]">

                                        </path>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        {(voturi.find((vot: any) => vot.uid === user?.uid)?.vot === false) && '(ales)'}
                    </button>
                </div>
            </motion.div>
            {(voturi.find((vot: any) => vot.uid === user?.uid)) && (
                <motion.div
                    className='flex flex-col w-full transition-all ease-in-out duration-1000'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.2, ease: 'easeInOut' }}
                >
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-blue-700 dark:text-white">Rating ( {voturiPentru} pentru | {voturiImpotriva} impotriva)</span>
                        <span className="text-sm font-medium text-blue-700 dark:text-white">{percent}% pentru / {totalVoturi} (total voturi)</span>
                    </div>
                    <div className={`w-full rounded-full bg-red-600 transition-all ease-in-out duration-1000`}>
                        <div
                            className={` bg-green-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none ${percent > 99 ? 'rounded-full' : 'rounded-l-full'} transition-all ease-in-out duration-1000 `}
                            style={{ width: `${percent}%` }}
                        >
                            {percent}%
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    )
}
