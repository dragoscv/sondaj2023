import { useEffect, useState, useCallback, useContext } from "react";
import { AppContext } from './AppContext';
import { useUserSession } from "../lib/utils/auth";
import { Avatar, Card, CardBody, CardHeader } from '@nextui-org/react';
import { User } from 'firebase/auth';
import Login from './Login';
import notify from '../lib/utils/toast';

import { SondajProps, CommentProps } from '@/types';

/**
 * Check if the comment has been voted by the user.
 * @param comment - The comment to check.
 * @param user - The user to check.
 * @returns True if the comment has been voted by the user, false otherwise. Null if the user is not logged in.
 */
const isVoted = (comment: CommentProps, user: User) => {
    const isUser = comment.votes && user && comment.votes[user.uid];
    return isUser ? comment.votes && user && comment.votes[user.uid] && comment.votes[user.uid].vot : null;
};

/**
 * Component that displays a comment.
 * @param sondajId - The ID of the sondaj that the comment belongs to.
 * @param comment - The comment to display.
 * @returns The Comment component.
 */
export default function Comment({ sondajId, comment }: any) {

    const { user } = useUserSession();
    const [unHiddenComments, setUnHiddenComments] = useState<any[]>([]);
    const [tempLikeDislike, setTempLikeDislike] = useState<boolean | null>(null);
    const [likesCount, setLikesCount] = useState<number>(0);
    const [dislikesCount, setDislikesCount] = useState<number>(0);

    const context = useContext(AppContext);
    if (!context) {
        throw new Error('Sondaje must be used within an AppProvider');
    }
    const { updateCommentLikeDislike, modal, closeModal } = context;

    /**
     * Handles the like action for the comment.
     */
    const handleLike = useCallback(async () => {
        if (!user) {
            setTempLikeDislike(true);
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
            return;
        }
        updateCommentLikeDislike(sondajId, comment.id, user, true).then(() => {
            notify({ text: 'Comentariul a fost votat cu succes.' }, 'success');
        })
    }, [sondajId, comment?.id, user, updateCommentLikeDislike, modal, closeModal]);

    /**
     * Handles the dislike action for the comment.
     */
    const handleDislike = useCallback(async () => {
        if (!user) {
            setTempLikeDislike(false);
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
            return;
        }
        updateCommentLikeDislike(sondajId, comment.id, user, false).then(() => {
            notify({ text: 'Comentariul a fost votat cu succes.' }, 'success');
        })
    }, [sondajId, comment?.id, user, updateCommentLikeDislike, modal, closeModal]);

    /**
     * Unhides the comment with the specified ID.
     * @param commentId - The ID of the comment to unhide.
     */
    const unHideComment = (commentId: string) => {
        setUnHiddenComments([...unHiddenComments, commentId]);
    }

    /**
     * Updates the likes and dislikes count for the comment.
     */
    useEffect(() => {
        if (!comment) return;
        const votes = Object.values(comment?.votes || {});
        if (votes.length === 0) return;
        let likesCount = 0;
        let dislikesCount = 0;
        votes.forEach(vote => {
            if ((vote as any)?.vot) {
                likesCount++;
            } else {
                dislikesCount++;
            }
        });
        setLikesCount(likesCount);
        setDislikesCount(dislikesCount);
    }, [comment]);

    /**
     * Handles the temporary like/dislike state.
     */
    useEffect(() => {
        if (tempLikeDislike !== null) {
            if (tempLikeDislike) {
                handleLike();
            } else {
                handleDislike();
            }
        }
    }, [handleLike, handleDislike, tempLikeDislike]);

    if (!comment) return null;

    return (
        <>
            <Card className="w-full border border-white/20 rounded">
                <CardHeader className="justify-between">
                    <div className="flex gap-5">
                        <Avatar isBordered radius="full" size="md" src={comment?.photoURL} />
                        <div className="flex flex-col gap-1 items-start justify-center">
                            <h4 className="text-small font-semibold leading-none text-default-600">{comment?.displayName}</h4>
                            <h5 className="text-xs tracking-tight text-default-400">
                                {new Date(comment?.timestamp).toLocaleDateString('ro-RO', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric'
                                })}
                            </h5>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="flex flex-row items-end justify-between clear-both">
                        {unHiddenComments.includes(comment?.id) ? (
                            <p className="text-xs text-default-700">{comment?.comentariu}</p>
                        ) : (
                            comment?.dislikesCount > 10 ? (
                                <div className="text-xs text-default-700 cursor-pointer underline"
                                    onClick={() => unHideComment(comment?.id)}
                                >
                                    Acest comentariu a fost ascuns din cauza prea multor dislike-uri. Apasa pentru a-l afisa.
                                </div>
                            )
                                : (
                                    <p className="text-xs text-default-700">{comment?.comentariu}</p>
                                )
                        )}
                        <div className="inline-flex float-right rounded-md shadow-sm transition-all ease-in-out duration-1000" role="group">
                            <button type="button" className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white transition-all ease-in-out duration-300 ${user && isVoted(comment, user) ? 'bg-green-600 dark:bg-green-600' : ''}`}
                                onClick={handleLike}
                            > {likesCount > 0 && <span className='text-xs mr-1'>{likesCount}</span>}
                                <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 -0.5 21 21" version="1.1">

                                    <title>like [#1385]</title>
                                    <desc>Created with Sketch.</desc>
                                    <defs>

                                    </defs>
                                    <g id="Page-1" stroke="none" strokeWidth="1" fill="currentColor" fillRule="evenodd">
                                        <g id="Dribbble-Light-Preview" transform="translate(-259.000000, -760.000000)" fill="currentColor">
                                            <g id="icons" transform="translate(56.000000, 160.000000)">
                                                <path d="M203,620 L207.200006,620 L207.200006,608 L203,608 L203,620 Z M223.924431,611.355 L222.100579,617.89 C221.799228,619.131 220.638976,620 219.302324,620 L209.300009,620 L209.300009,608.021 L211.104962,601.825 C211.274012,600.775 212.223214,600 213.339366,600 C214.587817,600 215.600019,600.964 215.600019,602.153 L215.600019,608 L221.126177,608 C222.97313,608 224.340232,609.641 223.924431,611.355 L223.924431,611.355 Z" id="like-[#1385]">

                                                </path>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </button>
                            <button type="button" className={` inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white transition-all ease-in-out duration-300 ${user && isVoted(comment, user) !== null ? isVoted(comment, user) ? '' : 'bg-red-500 dark:bg-red-600' : ''}`}
                                onClick={handleDislike}
                            >
                                {dislikesCount > 0 && <span className='text-xs mr-1'>{dislikesCount}</span>}
                                <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 -0.5 21 21" version="1.1">

                                    <title>dislike [#1388]</title>
                                    <desc>Created with Sketch.</desc>
                                    <defs>

                                    </defs>
                                    <g id="Page-1" stroke="none" strokeWidth="1" fill="currentColor" fillRule="evenodd">
                                        <g id="Dribbble-Light-Preview" transform="translate(-139.000000, -760.000000)" fill="currentColor">
                                            <g id="icons" transform="translate(56.000000, 160.000000)">
                                                <path d="M101.900089,600 L99.8000892,600 L99.8000892,611.987622 L101.900089,611.987622 C103.060339,611.987622 104.000088,611.093545 104.000088,609.989685 L104.000088,601.997937 C104.000088,600.894077 103.060339,600 101.900089,600 M87.6977917,600 L97.7000896,600 L97.7000896,611.987622 L95.89514,618.176232 C95.6819901,619.491874 94.2455904,620.374962 92.7902907,619.842512 C91.9198408,619.52484 91.400091,618.66273 91.400091,617.774647 L91.400091,612.986591 C91.400091,612.43516 90.9296911,611.987622 90.3500912,611.987622 L85.8728921,611.987622 C84.0259425,611.987622 82.6598928,610.35331 83.0746427,608.641078 L84.8995423,602.117813 C85.1998423,600.878093 86.360092,600 87.6977917,600" id="dislike-[#1388]">

                                                </path>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}