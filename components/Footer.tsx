/**
 * Renders the footer component with the last build time.
 * @returns JSX element
 */
export default function Footer() {
    return (
        <div>
            <p>Last build time: {process.env.NEXT_PUBLIC_BUILD_TIME}</p>
        </div>
    )
}