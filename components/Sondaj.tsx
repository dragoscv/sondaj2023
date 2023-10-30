import React from 'react';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Comments from './Comments';
import Votes from './Votes';

import { SondajProps } from '@/types';

/**
 * Renders a poll component with the given props.
 * @param {SondajProps} props - The props for the poll component.
 * @returns {JSX.Element} - The rendered poll component.
 */

export default function Sondaj(props: SondajProps): JSX.Element {
    const { poza, nume, detalii, sursa, createdAt, updatedAt, id } = props;
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <motion.div
                initial={{ opacity: 0, transform: "translateZ(0)" }}
                animate={{ opacity: 1, transform: "translateZ(0)" }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className='w-[400px] md:w-[500px] relative'>
                <Image
                    alt={nume}
                    layout="responsive"
                    objectFit="cover"
                    width={200}
                    height={200}
                    src={poza}
                    className='rounded-lg'
                />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, transform: "translateZ(0)" }}
                animate={{ opacity: 1, transform: "translateZ(0)" }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className='flex flex-row gap-2 bg-red-600/20 text-red-300 rounded-lg p-2'
            >
                Atentie! Aceste informatii pot sa nu mai fie de actualitate sau pot fi incorecte.
            </motion.div>
            <motion.div
                initial={{ opacity: 0, transform: "translateZ(0)" }}
                animate={{ opacity: 1, transform: "translateZ(0)" }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className='flex flex-row justify-start w-full gap-2'
            >
                Ultima actualizare: {updatedAt ?
                    new Date(updatedAt).toLocaleString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) :
                    createdAt ?
                        new Date(createdAt).toLocaleString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                        : ''
                }
            </motion.div>
            <motion.div
                initial={{ opacity: 0, height: 0, transform: "translateZ(0)" }}
                animate={{ opacity: 1, height: 'auto', transform: "translateZ(0)" }}
                transition={{
                    duration: 0.5,
                    delay: 0.1,
                    ease: 'easeInOut',
                }}
                className="text-sm" dangerouslySetInnerHTML={{ __html: detalii }}></motion.div>
            {sursa && <motion.div
                initial={{ opacity: 0, transform: "translateZ(0)" }}
                animate={{ opacity: 1, transform: "translateZ(0)" }}
                transition={{
                    duration: 1,
                    delay: 0.2,
                    ease: 'easeInOut',
                }}
                className='flex flex-row w-full justify-start gap-2 text-sm'
            >Sursa: <a href={sursa} target="_blank" rel="noreferrer"
                className='text-blue-700 dark:text-blue-500 hover:underline'
            >{sursa}</a>
            </motion.div>}
            <motion.div
                initial={{ opacity: 0, transform: "translateZ(0)" }}
                animate={{ opacity: 1, transform: "translateZ(0)" }}
                transition={{
                    duration: 1,
                    delay: 0.3,
                    ease: 'easeInOut',
                }}
                className='flex flex-col w-full justify-center gap-2'
            >
                {id && <Votes sondajId={id} />}
            </motion.div>
            <motion.div
                initial={{ opacity: 0, transform: "translateZ(0)" }}
                animate={{ opacity: 1, transform: "translateZ(0)" }}
                transition={{
                    duration: 1.5,
                    delay: 0.6,
                    ease: 'easeInOut',
                }}
                className='flex flex-col w-full justify-center gap-2'
            >
                {id && <Comments sondajId={id} />}
            </motion.div>
        </div>
    )
}