import { useEffect, useContext } from "react";
import Comments from "./Comments";
import { AppContext } from "./AppContext";

/**
 * Renders the Sugestii component which displays comments for the "sugestii" sondaj.
 * @returns JSX element
 */
export default function Sugestii() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('Sondaje must be used within an AppProvider');
    }
    const { changeCurrentSondaj } = context;

    useEffect(() => {
        changeCurrentSondaj('sugestii');
    }, [changeCurrentSondaj]);

    return (
        <div className='rounded w-full p-2 flex flex-col gap-2'>
            <Comments sondajId='sugestii' />
        </div>
    )
}