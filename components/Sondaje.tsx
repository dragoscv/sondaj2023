import { JSX, useContext, useEffect, useState } from 'react';
import { AppContext } from '@/components/AppContext';
import SondajCard from './SondajCard';
import CardSkeleton from './CardSkeleton';
import { SondajeProps, SondajeFlatAndGroupedType, SondajProps } from '@/types';
import { motion } from 'framer-motion';

/**
 * Renders a list of sondaje cards based on the provided sondajType.
 * @param {SondajeProps} props - The props object containing the sondajType.
 * @returns {JSX.Element} - The Sondaje component.
 */
export default function Sondaje({ sondajType }: SondajeProps): JSX.Element {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('Sondaje must be used within a SondajeProvider');
    }

    const { sondajeData, shuffledSondajeFlat } = context;
    const [sondaje, setSondaje] = useState<SondajeFlatAndGroupedType>({ flat: [], grouped: {} });

    useEffect(() => {
        // Clear the sondaje state when sondajType changes
        setSondaje({ flat: [], grouped: {} });

        // Check if sondajeData.flat is an array and has items
        if (Array.isArray(sondajeData.flat) && sondajeData.flat.length > 0) {
            sondajeData.flat.forEach((sondaj: any) => {
                if (sondaj.tipSondaj === sondajType) {
                    setSondaje(prevSondaje => ({
                        ...prevSondaje,
                        flat: [...prevSondaje.flat, sondaj],
                    }));
                }
            });
        }

    }, [sondajType, sondajeData]);

    return (
        <div className='flex flex-row items-start justify-center flex-wrap'>
            {sondaje.flat.length === 0 && (
                //new empty array with length 3
                [...Array(3)].map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.2, duration: 0.5, ease: 'easeInOut' }}
                        exit={{ opacity: 0 }}
                    >
                        <CardSkeleton />
                    </motion.div>
                ))

            )}


            {sondaje.flat.map((sondaj: JSX.IntrinsicAttributes & SondajProps, index: number) => (
                <motion.div
                    key={sondaj.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2, duration: 1.5, ease: 'easeInOut' }}
                >
                    <SondajCard {...sondaj} />
                </motion.div>
            ))}
        </div>
    )
}