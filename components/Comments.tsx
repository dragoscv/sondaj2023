import { useEffect, useState, useContext, useCallback } from "react";
import { Accordion, AccordionItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Selection } from "@nextui-org/react";
import Comment from './Comment';
import AddNewComment from './AddNewComment';
import { motion } from 'framer-motion';
import { AppContext } from './AppContext';

import { CommentsProps, CommentProps, SondajProps, OrderByProps } from '@/types';

/**
 * Renders the comments section for a sondaj.
 * @param {CommentsProps} props - The props for the component.
 * @param {string} props.sondajId - The ID of the sondaj for which to render the comments.
 * @returns {JSX.Element} - The rendered component.
 */
export default function Comments({ sondajId }: CommentsProps): JSX.Element {
    const [commentsOpened, setCommentsOpened] = useState<boolean>(false);
    const [currentSondajData, setCurrentSondajData] = useState<SondajProps | null>(null);
    const [comments, setComments] = useState<CommentProps[]>([]);
    const [orderBy, setOrderBy] = useState<OrderByProps>({ field: 'timestamp', direction: 'desc' });
    const [loading, setLoading] = useState(false);

    const context = useContext(AppContext);
    if (!context) {
        throw new Error('Sondaje must be used within an AppProvider');
    }
    const { sondajeData, updateCommentsLimit, changeCommentsOrder, changeCurrentSondaj } = context;

    const loadMoreComments = useCallback(() => {
        setLoading(true);
        updateCommentsLimit(sondajId, 5);
        setLoading(false);
    }, [sondajId, updateCommentsLimit]);

    const handleSelectionChange = (selection: Selection) => {
        const selectedKey = Array.from(selection)[0] as string as 'timestamp' | 'upvotesCount';
        setOrderBy({ field: selectedKey, direction: 'desc' });
    }

    useEffect(() => {
        if (!commentsOpened && sondajId !== 'sugestii') return;
        changeCurrentSondaj(sondajId);
        const currentSondaj: SondajProps = sondajeData.flat.find((sondaj: SondajProps) => sondaj.id === sondajId);
        // if (!currentSondaj.comments) return;
        // console.log(currentSondaj)
        setCurrentSondajData(currentSondaj);
    }, [sondajeData, sondajId, commentsOpened, changeCurrentSondaj]);

    useEffect(() => {
        if (!currentSondajData?.comments) return;
        // console.log(currentSondajData.comments)
        setComments(currentSondajData.comments);
    }, [currentSondajData]);

    useEffect(() => {
        changeCommentsOrder(orderBy);
    }, [orderBy, changeCommentsOrder]);


    return (
        <>
            <Accordion className='px-0' defaultExpandedKeys={sondajId === 'sugestii' ? ['1'] : ''} >
                <AccordionItem
                    key="1"
                    aria-label={sondajId === 'sugestii' ? 'Sugestii' : 'Comentarii'}
                    title={sondajId === 'sugestii' ? 'Sugestii' : 'Comentarii'}
                    className={`rounded w-full flex flex-col`}
                    classNames={{
                        base: 'border border-white/20 rounded-md shadow-sm p-2',
                        heading: 'bg-white/20 p-2 rounded-md',
                    }}
                    keepContentMounted={true}
                    onPress={() => setCommentsOpened(true)}
                >
                    <AddNewComment
                        sondajId={sondajId}
                    />
                    {comments.length > 0 ?
                        <div className='flex flex-col w-full items-center justify-start gap-2'>
                            <div className='flex flex-row w-full items-center justify-between gap-2'>
                                <h3 className='text-lg font-semibold'>{currentSondajData ? currentSondajData.commentsCount : ''} comentarii</h3>
                                <>
                                    <Dropdown
                                        backdrop="blur"
                                        placement="bottom-end"
                                        showArrow={true}
                                        classNames={{
                                            base: "py-1 px-1 border rounded-lg border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-gray-500 dark:to-black",
                                            arrow: "bg-default-200",
                                            backdrop: "pointer-events-none",
                                        }}
                                    >
                                        <DropdownTrigger>
                                            <Button
                                                variant="bordered"
                                                className="capitalize"
                                            >
                                                Sorteaza: {orderBy.field === 'timestamp' ? 'Cele mai noi' : 'Cele mai apreciate'}
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            aria-label="Sorteaza dupa"
                                            variant="flat"
                                            disallowEmptySelection
                                            selectionMode="single"
                                            selectedKeys={orderBy.field}
                                            onSelectionChange={handleSelectionChange}
                                        >
                                            <DropdownItem key="timestamp">Cele mai noi</DropdownItem>
                                            <DropdownItem key="upvotesCount">Cele mai apreciate</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </>
                            </div>
                            {comments.map((comment: any, index: number) => (
                                <motion.div
                                    key={comment.id}
                                    className='w-full h-0 opacity-0'
                                    initial={{ opacity: 0, height: 0, transform: "translateZ(0)" }}
                                    animate={{ opacity: 1, height: 'auto', transform: "translateZ(0)" }}
                                    transition={{
                                        duration: 2,
                                        delay: 0.1 / (1 + Math.log(1 + index)),
                                        ease: [1, -0.23, 0.32, 1.1],
                                    }}
                                >
                                    <Comment
                                        comment={comment}
                                        sondajId={sondajId}
                                        type='sondaj'
                                        index={index}
                                    />
                                </motion.div>
                            ))}
                            {((currentSondajData?.comments?.length) ?? 0) < (currentSondajData?.commentsCount ?? 0) && (
                                <div className='flex flex-col items-center justify-center'>
                                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={loadMoreComments}>
                                        {((currentSondajData?.comments?.length) ?? 0)} / {currentSondajData?.commentsCount ?? 0} {loading ? 'Se incarca...' : 'Incarca mai multe comentarii'}
                                    </button>
                                </div>
                            )}

                        </div>
                        : (currentSondajData?.commentsCount ?? 0) > 0 ?

                            <div className="flex w-full justify-center items-center">
                                <svg aria-hidden="true" role="status" className="inline w-6 h-6 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                </svg> Se incarca comentariile...
                            </div>
                            :
                            <div className='flex flex-col w-full items-center justify-center gap-2'>
                                <h3 className='text-lg font-semibold'>Nu exista comentarii</h3>
                            </div>

                    }
                </AccordionItem>
            </Accordion>
        </>

    )
}