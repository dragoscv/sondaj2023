/**
 * Renders a form for adding a new comment to a sondaj.
 * @param {Object} props - The component props.
 * @param {string} props.sondajId - The ID of the sondaj to add the comment to.
 * @returns {JSX.Element} - The rendered component.
 */
import { useState, useContext } from "react";
import { AppContext } from './AppContext';
import { useUserSession } from "../lib/utils/auth";
import Login from './Login';
import notify from '../lib/utils/toast';

export default function AddNewComment({ sondajId }: any) {
    const { user } = useUserSession();
    const [comentariu, setComentariu] = useState<string>('');
    const [loadingSaveComment, setLoadingSaveComment] = useState<boolean>(false);
    const [errorSaveComment, setErrorSaveComment] = useState<string>('');

    const context = useContext(AppContext);
    if (!context) {
        throw new Error('Sondaje must be used within an AppProvider');
    }
    const { addNewComment } = context;

    /**
     * Handles the submission of a new comment.
     * @param {React.FormEvent} event - The form event.
     * @returns {Promise<void>} - A promise that resolves when the comment has been added successfully.
     */
    const handleAddComment = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        if (!user || !comentariu) return;
        setLoadingSaveComment(true);
        setErrorSaveComment('');

        if (comentariu.trim() === '') {
            setErrorSaveComment('Comentariul nu poate fi gol.');
            notify({ text: 'Comentariul nu poate fi gol.' }, 'error');
            setLoadingSaveComment(false);
            return;
        } else if (comentariu.trim().length < 3) {
            setErrorSaveComment('Comentariul trebuie sa contina minim 3 caractere.');
            notify({ text: 'Comentariul trebuie sa contina minim 3 caractere.' }, 'error');
            setLoadingSaveComment(false);
            return;
        } else if (comentariu.trim().length > 5000) {
            setErrorSaveComment('Comentariul trebuie sa contina maxim 5000 caractere.');
            notify({ text: 'Comentariul trebuie sa contina maxim 5000 caractere.' }, 'error');
            setLoadingSaveComment(false);
            return;
        } else {
            addNewComment(sondajId, comentariu, user).then((id: string) => {
                // onNewComment(id);
                setLoadingSaveComment(false);
                setComentariu('');
                notify({ text: 'Comentariul a fost adaugat cu succes.' }, 'success');
            }).catch((error) => {
                console.log(error);
                setErrorSaveComment('Something went wrong while saving your comment.');
                notify({ text: 'Something went wrong while saving your comment.' }, 'error');
                setLoadingSaveComment(false);
            });
        }
    };

    return (
        <>
            {user ? (
                <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <div className=" bg-white rounded-t-lg dark:bg-gray-800">
                        <label htmlFor="comment" className="sr-only">Comentariul tau</label>
                        <textarea id="comment" rows={4} className="max-h-72 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={sondajId === 'sugestii' ? 'Sugestia ta...' : 'Comentariul tau...'}
                            value={comentariu}
                            onChange={(e) => setComentariu(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-end px-3 py-2 border-t dark:border-gray-600">
                        {!loadingSaveComment ?
                            <div className='flex flex-row w-full justify-between'>
                                <div className='text-red-500'>{errorSaveComment}</div>
                                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    onClick={handleAddComment}
                                >
                                    Salveaza
                                </button>
                            </div>
                            :
                            <div className='flex flex-row justify-end'>
                                <button disabled type="button" className="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">
                                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                                    </svg>
                                    Se salveaza
                                </button>
                            </div>
                        }
                    </div>
                </div>
            ) : (
                <div className='flex gap-2 justify-center items-center'>
                    Trebuie sa te autentifici pentru a putea adauga comentarii <Login />
                </div>
            )}
        </>
    )
}