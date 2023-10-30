/**
 * This file exports the AppContext and AppProvider components, which provide global state management for the application.
 * 
 * The AppContext is created using the createContext function from React and exports an AppContextProps object.
 * 
 * The AppProvider component is a wrapper component that provides the AppContext to its children using the useContext hook.
 * 
 * The AppProvider component also defines an initialState object and a reducer function to manage state changes.
 * 
 * The reducer function handles various actions that can be dispatched to update the state, such as setting sondaje data, current sondaj id, comments limits, comments order by, path, modal props, casting vote, updating votes, changing current sondaj, updating comments limit, updating comments, and updating comment votes.
 * 
 * The file also imports various types from the types.ts file and other modules, such as firebase and ModalComponent.
 */
'use client'

import React, { createContext, useEffect, useReducer, useMemo, useCallback } from 'react';
import { firestoreDB } from '@/lib/firebase/fireabase.config';
import { useUserSession } from "@/lib/utils/auth";
import { doc, setDoc, collection, addDoc, onSnapshot, getCountFromServer, query, orderBy, limit, runTransaction, QuerySnapshot, DocumentSnapshot } from "firebase/firestore";
import { User } from "firebase/auth";
import {
    AppContextProps,
    AppProviderProps,
    SondajProps,
    SondajeGroupedType,
    VoteProps,
    UpdatedVotesProps,
    CommentProps,
    OrderByProps,
    ModalProps,
    State, Action
} from '@/types';
import ModalComponent from './Modal';
import notify from '@/lib/utils/toast';

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: AppProviderProps) {
    const { user } = useUserSession();

    const initialState: State = useMemo(() => ({
        sondajeData: { flat: [], grouped: {} },
        currentSondajId: '',
        commentsLimits: {},
        commentsOrderBy: { field: 'timestamp', direction: 'desc' },
        path: 'sondaje',
        modalProps: []
    }), []);

    const shuffledSondajeFlat = useMemo(() => {
        const sondajeFlat = [...initialState.sondajeData.flat];
        // Shuffle sondajeFlat...
        for (let i = sondajeFlat.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sondajeFlat[i], sondajeFlat[j]] = [sondajeFlat[j], sondajeFlat[i]];
        }
        return sondajeFlat;
    }, [initialState.sondajeData.flat]);

    const reducer = (state: State, action: Action): State => {
        const updatedSondajeData = { ...state.sondajeData };
        let sondajIndex: number | null = null;
        let updatedSondaj: SondajProps | null = null;


        switch (action.type) {
            case 'SET_SONDAJE_DATA':
                return { ...state, sondajeData: action.payload };
            case 'SET_CURRENT_SONDAJ_ID':
                return { ...state, currentSondajId: action.payload };
            case 'SET_COMMENTS_LIMITS':
                return { ...state, commentsLimits: action.payload };
            case 'SET_COMMENTS_ORDER_BY':
                return { ...state, commentsOrderBy: action.payload };
            case 'SET_PATH':
                return { ...state, path: action.payload };
            case 'CAST_VOTE':
                sondajIndex = updatedSondajeData.flat.findIndex(sondaj => sondaj.id === action.payload.sondajId);
                if (sondajIndex !== -1) {
                    const updatedSondaj = { ...updatedSondajeData.flat[sondajIndex] };
                    updatedSondaj.votes = updatedSondaj.votes || [];
                    updatedSondaj.votes.push({ userId: action.payload.userId, vote: action.payload.vote });
                    updatedSondajeData.flat[sondajIndex] = updatedSondaj;
                }
                return { ...state, sondajeData: updatedSondajeData };
            case 'UPDATE_VOTES':
                sondajIndex = updatedSondajeData.flat.findIndex(sondaj => sondaj.id === action.payload.sondajId);
                if (sondajIndex !== -1) {
                    const updatedSondaj = { ...updatedSondajeData.flat[sondajIndex], votes: action.payload.votes };
                    updatedSondajeData.flat[sondajIndex] = updatedSondaj;
                }
                return { ...state, sondajeData: updatedSondajeData };
            case 'CHANGE_CURRENT_SONDAJ':
                return { ...state, currentSondajId: action.payload.sondajId };
            case 'UPDATE_COMMENTS_LIMIT':
                return {
                    ...state,
                    commentsLimits: {
                        ...state.commentsLimits,
                        [action.payload.sondajId]: action.payload.limit,
                    },
                };
            case 'UPDATE_COMMENTS':
                const { sondajId: updateCommentsSondajId, comments, commentsCount } = action.payload;
                sondajIndex = updatedSondajeData.flat.findIndex(sondaj => sondaj.id === updateCommentsSondajId);
                if (sondajIndex !== -1) {
                    updatedSondaj = { ...updatedSondajeData.flat[sondajIndex] };
                    updatedSondaj.comments = comments;
                    updatedSondaj.commentsCount = commentsCount;
                    updatedSondajeData.flat[sondajIndex] = updatedSondaj;
                }
                return { ...state, sondajeData: updatedSondajeData };
            case 'UPDATE_COMMENT_VOTES':
                const { sondajId: updateVotesSondajId, commentId, updatedVotes, upvotesCount } = action.payload;
                sondajIndex = updatedSondajeData.flat.findIndex(sondaj => sondaj.id === updateVotesSondajId);
                if (sondajIndex !== -1) {
                    updatedSondaj = { ...updatedSondajeData.flat[sondajIndex] };
                    const commentIndex = updatedSondaj.comments?.findIndex(comment => comment.id === commentId);
                    if (commentIndex !== undefined && commentIndex !== -1) {
                        updatedSondaj.comments![commentIndex] = {
                            ...updatedSondaj.comments![commentIndex],
                            votes: updatedVotes,
                            upvotesCount,
                        };
                        updatedSondajeData.flat[sondajIndex] = updatedSondaj;
                    }
                }
                return { ...state, sondajeData: updatedSondajeData };
            case 'ADD_MODAL': {
                const existingModalIndex = state.modalProps.findIndex(modal => modal.id === action.payload.id);
                if (existingModalIndex !== -1) {
                    // Modal with the specified id already exists. Update its properties.
                    return {
                        ...state,
                        modalProps: state.modalProps.map((modal, index) =>
                            index === existingModalIndex
                                ? {
                                    ...modal,
                                    isOpen: true,
                                    modalBody: action.payload.modalBody,
                                    modalHeader: action.payload.modalHeader,
                                    footerButtonClick: action.payload.footerButtonClick,
                                }
                                : modal
                        ),
                    };
                } else {
                    // Modal with the specified id does not exist. Add the new modal to the modalProps array.
                    return { ...state, modalProps: [...state.modalProps, action.payload] };
                }
            }
            case 'CLOSE_MODAL':
                return {
                    ...state,
                    modalProps: state.modalProps.map(modal =>
                        modal.id === action.payload
                            ? { ...modal, isOpen: false }
                            : modal
                    )
                };
            case 'HANDLE_ERROR':
                notify({ text: action.payload }, 'error');
                return state;
            default:
                throw new Error(`Unhandled action type: ${action.type}`);
        }
    };
    const [state, dispatch] = useReducer(reducer, initialState);

    //useEffect to get sondaje from firestore
    useEffect(() => {
        dispatch({ type: 'SET_SONDAJE_DATA', payload: { flat: [], grouped: {} } });

        const parseDetalii = (htmlString: string) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');
            const anchorElements = doc.querySelectorAll('a');

            anchorElements.forEach(anchor => {
                anchor.setAttribute('target', '_blank');
                anchor.setAttribute('rel', 'noopener noreferrer');
                anchor.setAttribute('class', 'text-blue-700 dark:text-blue-500 hover:underline');
            });

            return doc.body.innerHTML;
        };

        const q = query(collection(firestoreDB, 'sondaje'));
        const unsubscribe: () => void = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
            // your code here
            const sondajeGrouped: SondajeGroupedType = {};
            const sondajeFlat: SondajProps[] = [];
            querySnapshot.forEach((doc: DocumentSnapshot) => {
                const docData = doc.data();
                if (docData) {
                    docData.id = doc.id;
                    if (docData.detalii) {
                        docData.detalii = parseDetalii(docData.detalii);
                    }
                    sondajeGrouped[docData.tipSondaj] = sondajeGrouped[docData.tipSondaj] || [];
                    sondajeGrouped[docData.tipSondaj].push(docData as SondajProps);
                    sondajeFlat.push(docData as SondajProps);
                }
            });

            // Shuffle sondajeFlat...
            for (let i = sondajeFlat.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [sondajeFlat[i], sondajeFlat[j]] = [sondajeFlat[j], sondajeFlat[i]];
            }

            dispatch({ type: 'SET_SONDAJE_DATA', payload: { flat: sondajeFlat, grouped: sondajeGrouped } });
        });
        return () => {
            unsubscribe();
        }
    }, [dispatch]);

    //save vote to firestore
    const saveVoteToFirestore = useCallback(async (sondajId: string, userId: string, vote: boolean) => {
        const docRef = doc(firestoreDB, `sondaje/${sondajId}/voturi`, userId);

        try {
            // Update Firebase
            await setDoc(docRef, {
                vot: vote,
                timestamp: Date.now()
            }, { merge: true });
        } catch (error) {
            console.error('Error updating Firebase:', error);
            // Optionally, dispatch another action to handle the error
        }
    }, []);

    //cast vote
    const castVote = useCallback(async (sondajId: string, userId: string, vote: boolean) => {
        await saveVoteToFirestore(sondajId, userId, vote);
        // dispatch({ type: 'CAST_VOTE', payload: { sondajId, userId, vote } });
    }, [saveVoteToFirestore]);

    //change current active sondaj
    const changeCurrentSondaj = useCallback((sondajId: string) => {
        dispatch({ type: 'CHANGE_CURRENT_SONDAJ', payload: { sondajId } });
    }, [dispatch]);

    //useEffect to get votes of currentSondaj from firestore
    useEffect(() => {
        if (!user) return;
        if (!state.currentSondajId) return;

        const q = collection(firestoreDB, `sondaje/${state.currentSondajId}/voturi`);
        const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
            const votes: VoteProps[] = [];
            querySnapshot.forEach((doc: any) => {
                const docData = doc.data();
                docData.uid = doc.id;
                votes.push(docData);
            });

            dispatch({
                type: 'UPDATE_VOTES',
                payload: { sondajId: state.currentSondajId, votes },
            });
        });
        return unsubscribe;
    }, [state.currentSondajId, user, dispatch]);

    // useEffect to get commentsLimit from url
    useEffect(() => {
        const url = new URL(window.location.href);
        const currentCommentsLimit = url.searchParams.get('commentsLimit');
        if (currentCommentsLimit) {
            const limit = Number(currentCommentsLimit);
            if (!isNaN(limit) && state.commentsLimits[state.currentSondajId] !== limit) {
                dispatch({
                    type: 'UPDATE_COMMENTS_LIMIT',
                    payload: { sondajId: state.currentSondajId, limit }
                });
            }
        }
    }, [state.currentSondajId, state.commentsLimits]);

    //change comments order
    const changeCommentsOrder = useCallback((orderBy: OrderByProps) => {
        dispatch({ type: 'SET_COMMENTS_ORDER_BY', payload: orderBy });
    }, [dispatch]);

    //useEffect to get comments of currentSondaj from firestore
    useEffect(() => {
        if (!state.currentSondajId) return;
        const getComments = async () => {
            const docRef = collection(firestoreDB, `sondaje/${state.currentSondajId}/comentarii`);
            const countFromServer = await getCountFromServer(query(docRef));
            const count = countFromServer.data().count;

            const q = query(
                docRef,
                orderBy(state.commentsOrderBy.field, state.commentsOrderBy.direction),
                limit(state.commentsLimits[state.currentSondajId] || 5)
            );

            const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
                const comments: CommentProps[] = [];
                querySnapshot.forEach((doc: any) => {
                    const docData = doc.data();
                    docData.id = doc.id;

                    const comment: CommentProps = {
                        id: docData.id,
                        uid: docData.uid,
                        displayName: docData.displayName,
                        photoURL: docData.photoURL,
                        comentariu: docData.comentariu,
                        timestamp: docData.timestamp,
                        votes: docData.votes,
                    };

                    comments.push(comment);
                });

                dispatch({
                    type: 'UPDATE_COMMENTS',
                    payload: {
                        sondajId: state.currentSondajId,
                        comments,
                        commentsCount: count,
                    },
                });
            });

            return unsubscribe;
        }

        getComments();

    }, [state.currentSondajId, state.commentsLimits, state.commentsOrderBy, dispatch]);

    //update the commentsLimit and the url
    const updateCommentsLimit = useCallback((sondajId: string, limit?: number) => {
        const newLimit = (limit || 5) + (state.commentsLimits[sondajId] || 5);
        dispatch({ type: 'UPDATE_COMMENTS_LIMIT', payload: { sondajId, limit: newLimit } });  // adjusted here

        const url = new URL(window.location.href);
        url.searchParams.set('commentsLimit', newLimit.toString());
        window.history.replaceState({}, '', url);
    }, [state.commentsLimits]);

    // add new comment
    const addNewComment = useCallback(async (sondajId: string, comment: string, user: User): Promise<string> => {
        try {
            const docRef = await addDoc(collection(firestoreDB, `sondaje/${sondajId}/comentarii`), {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                comentariu: comment,
                timestamp: new Date().getTime(),
                upvotesCount: 0,
            });
            dispatch({ type: 'UPDATE_COMMENTS_LIMIT', payload: { sondajId, limit: state.commentsLimits[sondajId] + 1 } });  // Assuming you have a relevant action type and payload structure in your reducer
            return docRef.id;
        } catch (error) {
            console.error('Error adding comment:', error);
            // Optionally, dispatch another action to handle the error
            // dispatch({ type: 'HANDLE_ERROR', payload: error });
            return 'Error';  // This ensures a string is always returned
        }
    }, [state.commentsLimits]);

    //update comment like/dislike
    const updateCommentLikeDislike = useCallback(async (sondajId: string, commentId: string, user: User, vote: boolean) => {
        const docRef = doc(firestoreDB, `sondaje/${sondajId}/comentarii/${commentId}`);

        // Run this in a transaction to ensure data consistency
        await runTransaction(firestoreDB, async (transaction) => {
            // Get the current document data
            const docSnapshot = await transaction.get(docRef);
            if (!docSnapshot.exists()) {
                console.error('Document does not exist!');
                return;
            }

            // Get the current votes data
            const currentVotes = docSnapshot.data().votes || {};

            // Update the vote for this user
            const updatedVotes = {
                ...currentVotes,
                [user.uid]: {
                    vot: vote,
                    timestamp: Date.now(),
                },
            };

            // Count the number of true votes
            const upvotesCount = Object.values(updatedVotes as UpdatedVotesProps).filter(vote => vote.vot).length;

            // Update the document with the new votes data and upvotesCount
            transaction.set(docRef, {
                votes: updatedVotes,
                upvotesCount,
            }, { merge: true });

            // Dispatch action to update local state once transaction is successful
            dispatch({ type: 'UPDATE_COMMENT_VOTES', payload: { sondajId, commentId, updatedVotes, upvotesCount } });
        });
    }, []);

    // This code sets the modal props for the modal component.
    const modal = useCallback((props: ModalProps) => {
        dispatch({ type: 'ADD_MODAL', payload: props });
    }, [dispatch]);

    const closeModal = useCallback((id: string) => {
        dispatch({ type: 'CLOSE_MODAL', payload: id });
    }, [dispatch]);

    return (
        <AppContext.Provider value={{
            sondajeData: state.sondajeData,
            shuffledSondajeFlat,
            castVote,
            changeCurrentSondaj,
            updateCommentsLimit,
            addNewComment,
            updateCommentLikeDislike,
            changeCommentsOrder,
            commentsOrderBy: state.commentsOrderBy,
            modal,
            closeModal
        }}>
            {children}
            {state.modalProps.map(modalProps => (
                <ModalComponent key={modalProps.id} {...modalProps} />
            ))}
        </AppContext.Provider>
    );
}
