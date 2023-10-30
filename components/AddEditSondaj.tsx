/**
 * Component for adding a new sondaj by uploading an image to Firebase Storage and adding the sondaj data to Firestore.
 * @param {any} props - The component props.
 * @returns {JSX.Element} - The JSX element for the AddNewSondaj component.
 */
import { useState } from "react";
import { firebaseApp, firestoreDB } from '@/lib/firebase/fireabase.config';
import { doc, collection, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { DefaultEditor } from 'react-simple-wysiwyg';
import notify from '../lib/utils/toast';

import { SondajProps, SondajTypesProps } from "../types/index";

export default function AddEditSondaj(props: any) {
    const [tipSondaj, setTipSondaj] = useState<SondajTypesProps>(props.sondaj?.tipSondaj || 'persoana');
    const [nume, setNume] = useState(props.sondaj?.nume || "");
    const [pozitie, setPozitie] = useState(props.sondaj?.pozitie || "");
    const [detalii, setDetalii] = useState(props.sondaj?.detalii || "");
    const [poza, setPoza] = useState<File | string | null>(props.sondaj?.poza || null);
    const [sursa, setSursa] = useState(props.sondaj?.sursa || "");
    const [loading, setLoading] = useState(false);
    const [loadingPercentage, setLoadingPercentage] = useState(0);
    const [error, setError] = useState("");

    /**
     * Handles saving a new sondaj by uploading the selected image to Firebase Storage and adding the sondaj data to Firestore.
     * @returns {Promise<void>}
     */
    const handleSave = async (): Promise<void> => {
        setLoading(true);

        const addToDatabese = async (pictureURL?: string) => {


            if (props.sondaj?.id) {
                const docRef = doc(firestoreDB, "sondaje", props.sondaj?.id);
                const docData: SondajProps = {
                    nume: nume,
                    pozitie: pozitie,
                    detalii: detalii,
                    sursa: sursa,
                    tipSondaj: tipSondaj,
                    poza: pictureURL ? pictureURL : typeof (poza) === 'string' ? poza as string : '',
                    timestamp: Date.now(),
                    updatedAt: Date.now(),
                };
                await setDoc(docRef, docData, { merge: true }).then(() => {
                    setLoading(false);
                    props.onClose();
                    notify({ text: 'Sondaj adaugat cu succes' }, 'success');
                }).catch((error) => {
                    console.log(error);
                    setError(error.message);
                    setLoading(false);
                    notify({ text: error.message }, 'error');
                });
            } else {
                const docRef = doc(collection(firestoreDB, "sondaje"));
                const docData: SondajProps = {
                    nume: nume,
                    pozitie: pozitie,
                    detalii: detalii,
                    sursa: sursa,
                    tipSondaj: tipSondaj,
                    poza: pictureURL ? pictureURL : typeof (poza) === 'string' ? poza as string : '',
                    timestamp: Date.now(),
                    createdAt: Date.now(),
                };
                await setDoc(docRef, docData, { merge: true }).then(() => {
                    setLoading(false);
                    props.onClose();
                    notify({ text: 'Sondaj adaugat cu succes' }, 'success');
                }).catch((error) => {
                    console.log(error);
                    setError(error.message);
                    setLoading(false);
                    notify({ text: error.message }, 'error');
                });
            }
        }

        if (poza) {
            if (typeof (poza) !== 'string') {
                const storage = getStorage(firebaseApp);
                const storageRef = ref(storage, 'images/' + poza.name);

                // Create a FileReader object to read the contents of the selected file
                const reader = new FileReader();
                reader.readAsArrayBuffer(poza);

                // Wait for the reader to finish reading the file
                await new Promise<void>((resolve) => {
                    reader.onload = () => {
                        resolve();
                    };
                });

                // Convert the file contents to a Blob
                const fileBlob = new Blob([reader.result as ArrayBuffer], { type: poza.type });


                const uploadTask = uploadBytesResumable(storageRef, fileBlob as Blob);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setLoadingPercentage(progress);
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        console.log(error);
                        setError(error.message);
                        setLoading(false);
                        notify({ text: error.message }, 'error');
                    },
                    async () => {
                        // Get the download URL for the uploaded file
                        const url = await getDownloadURL(storageRef);
                        await addToDatabese(url);

                        // const docRef = doc(collection(firestoreDB, "sondaje"));
                        // const docData: SondajProps = {
                        //     nume: nume,
                        //     pozitie: pozitie,
                        //     detalii: detalii,
                        //     tipSondaj: tipSondaj,
                        //     poza: url,
                        //     timestamp: Date.now(),
                        //     createdAt: Date.now(),
                        // };
                        // await setDoc(docRef, docData, { merge: true }).then(() => {
                        //     setLoading(false);
                        //     props.onClose();
                        //     notify({ text: 'Sondaj adaugat cu succes' }, 'success');
                        // }).catch((error) => {
                        //     console.log(error);
                        //     setError(error.message);
                        //     setLoading(false);
                        //     notify({ text: error.message }, 'error');
                        // });
                    }
                );
            } else {
                await addToDatabese(poza);
            }
        } else {
            setError("Adauga o poza");
            setLoading(false);
            notify({ text: 'Adauga o poza' }, 'error');
        }
    }

    return (
        <div className='flex flex-col'>
            <div className='flex flex-col'>
                <form>
                    <div className="relative z-0 mb-6 group">
                        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selecteaza tipul sondajului</label>
                        <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            defaultValue={tipSondaj}
                            onChange={(e) => setTipSondaj(e.target.value as SondajTypesProps)}
                        >
                            <option value='persoana'>Candidat</option>
                            <option value='partid'>Partid</option>
                            <option value='lege'>Lege</option>
                            <option value='altele'>Altele</option>
                        </select>
                    </div>
                    <div className="relative z-0 mb-6 group">
                        <input type="name" name="floating_name" id="floating_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required
                            value={nume}
                            onChange={(e) => setNume(e.target.value)}
                        />
                        <label htmlFor="floating_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nume</label>
                    </div>
                    <div className="relative z-0 mb-6 group">
                        <input type="pozitie" name="floating_pozitie" id="floating_pozitie" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required
                            value={pozitie}
                            onChange={(e) => setPozitie(e.target.value)}
                        />
                        <label htmlFor="floating_pozitie" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Pozitie</label>
                    </div>
                    <div className="relative z-0 mb-6 group">
                        <label htmlFor="detalii" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Detalii</label>
                        {/* <textarea id="detalii" rows={4} className="max-h-72 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Adauga detalii..."
                            value={detalii}
                            onChange={(e) => setDetalii(e.target.value)}
                        ></textarea> */}
                        <DefaultEditor
                            value={detalii}
                            dangerouslySetInnerHTML={{ __html: detalii }}
                            containerProps={{
                                style: {
                                    // height: 200,
                                    border: '1px solid #ccc',
                                    resize: 'vertical',
                                    maxHeight: 200,
                                    overflow: 'auto',
                                },
                            }}
                            onChange={(e) => setDetalii(e.target.value)}
                            className='max-h-72 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        />
                    </div>
                    <div className="relative z-0 mb-6 group">
                        <input type="name" name="floating_sursa" id="floating_sursa" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required
                            value={sursa}
                            onChange={(e) => setSursa(e.target.value)}
                        />
                        <label htmlFor="floating_sursa" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Sursa</label>
                    </div>
                    <div className="relative z-0 mb-6 group">

                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Adauga poza</label>
                        <div className='flex flex-row justify-between'>
                            {poza &&
                                // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                                (<img src={typeof (poza) !== 'string' ? URL.createObjectURL(poza) : poza} alt={typeof (poza) !== 'string' ? poza.name : ''} key={typeof (poza) !== 'string' ? poza.name : ''} className='w-20 h-20 rounded-lg' />)}
                            <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file" accept="image/*"
                                onChange={(e) => setPoza(e.target.files ? e.target.files[0] : null)}
                            />
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">*Doar imagini</p>
                    </div>
                </form>
            </div>
            <div className='flex flex-row border-t border-gray-500 w-full pt-2 mt-2'>
                {!loading ?
                    <div className='flex flex-row w-full justify-between'>
                        <div className='text-red-500'>{error}</div>
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            onClick={handleSave}
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
                            Se incarca {loadingPercentage}%
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}