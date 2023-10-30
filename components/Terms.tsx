/**
 * Component for displaying the terms and conditions of the application.
 * @param props - The component props.
 * @param props.onClose - Function to close the terms and conditions modal.
 * @returns A React component that displays the terms and conditions.
 */
import notify from "../lib/utils/toast";

export default function Terms(props: any) {

    const onAgree = () => {
        window.localStorage.setItem('termsAgreed', 'true');
        props.onClose();
        notify({ text: 'Termeni și Condiții acceptate' }, 'success');
    }

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold mb-4">Termeni și Condiții</h1>

                {/* <!-- Introducere --> */}
                <section>
                    <h2 className="text-xl font-semibold mb-2">Introducere</h2>
                    <p className="mb-4">Bun venit pe platforma noastră! Această aplicație web este dezvoltată și întreținută de Dragoș Catalin. Scopul aplicației este să ofere un sondaj interactiv despre posibili candidați la alegerile prezidențiale și partidele politice din România. Toate informațiile sunt generate și preluate cu ajutorul Bing AI. Ultima modificare a acestor termeni a fost in data de 19.10.2023</p>
                </section>

                {/* <!-- Condiții de Utilizare --> */}
                <section>
                    <h2 className="text-xl font-semibold mb-2">Condiții de Utilizare</h2>
                    <p className="mb-4">Prin utilizarea acestei aplicații, vă exprimați acordul față de următorii termeni și condiții. Dacă nu sunteți de acord, vă rugăm să nu utilizați aplicația.</p>
                </section>

                {/* <!-- Politica de Confidențialitate și GDPR --> */}
                <section id="privacy-policy">
                    <h2 className="text-xl font-semibold mb-2">Politică de Confidențialitate și GDPR</h2>

                    {/* <!-- Colectarea Datelor --> */}
                    <h3 className="text-lg font-semibold mb-1">Colectarea Datelor</h3>
                    <p className="mb-2">Pentru autentificarea în aplicație este necesar un cont Google. Nu colectăm sau stocăm informații personale în afara celor necesare pentru funcționarea aplicației. Acest lucru ar putea include adresa dvs. de e-mail, poza de profil și numele de utilizator. Suntem conformi cu Regulamentul General privind Protecția Datelor (GDPR).</p>

                    {/* <!-- Utilizarea Datelor --> */}
                    <h3 className="text-lg font-semibold mb-1">Utilizarea Datelor</h3>
                    <p className="mb-2">Datele colectate sunt utilizate exclusiv pentru scopurile aplicației și nu vor fi distribuite terților.</p>

                    {/* <!-- Securitatea Datelor --> */}
                    <h3 className="text-lg font-semibold mb-1">Securitatea Datelor</h3>
                    <p className="mb-2">Implementăm măsuri de securitate pentru a proteja datele dvs. personale.</p>

                    {/* <!-- Drepturile dvs. --> */}
                    <h3 className="text-lg font-semibold mb-1">Drepturile dvs.</h3>
                    <p className="mb-2">Conform GDPR, aveți dreptul de a accesa, modifica sau șterge datele personale colectate.</p>

                    {/* <!-- Cookies --> */}
                    <h3 className="text-lg font-semibold mb-1">Cookies</h3>
                    <p className="mb-2">Utilizăm cookies pentru a îmbunătăți experiența utilizatorului. Acestea sunt conforme cu legile UE privind cookies. Acestea sunt strict necesare pentru funcționarea platformei.</p>

                    {/* <!-- Schimbări în Politica de Confidențialitate --> */}
                    <h3 className="text-lg font-semibold mb-1">Schimbări în Politica de Confidențialitate</h3>
                    <p className="mb-2">Această politică poate fi actualizată. Vă recomandăm să o verificați periodic.</p>
                </section>

                {/* <!-- Proprietatea Intelectuală --> */}
                <section>
                    <h2 className="text-xl font-semibold mb-2">Proprietatea Intelectuală</h2>
                    <p className="mb-4">Toate textele și imaginile legate de candidați și partide nu ne aparțin. Scopul nostru nu este de a încălca drepturile de autor și nu suntem afiliați politic cu nimeni. Nu am fost sponsorizat de nimeni și nu reprezentăm interesele niciunui partid sau candidat.</p>
                </section>

                {/* <!-- Limitele de Răspundere --> */}
                <section>
                    <h2 className="text-xl font-semibold mb-2">Limitele de Răspundere</h2>
                    <p className="mb-4">Nu putem fi ținuți responsabili pentru acțiuni sau evenimente care depășesc controlul nostru direct, incluzând, dar fără a se limita la, pierderi financiare sau de date. În timp ce ne străduim să oferim informații exacte și actualizate, nu putem garanta exactitatea sau actualitatea informațiilor.</p>
                </section>

                {/* <!-- Modificări ale Termenilor --> */}
                <section>
                    <h2 className="text-xl font-semibold mb-2">Modificări ale Termenilor</h2>
                    <p className="mb-4">Ne rezervăm dreptul de a modifica acești termeni și condiții oricând.</p>
                </section>

                {/* <!-- Jurisdicție Legală --> */}
                <section>
                    <h2 className="text-xl font-semibold mb-2">Jurisdicție Legală</h2>
                    <p className="mb-4">Acești termeni și condiții sunt guvernați de legislația română.</p>
                </section>

                {/* <!-- Opt-Out și Dezabonare --> */}
                <section>
                    <h2 className="text-xl font-semibold mb-2">Opt-Out și Dezabonare</h2>
                    <p className="mb-4">Aveți posibilitatea să vă dezabonați și să vă ștergeți contul în orice moment.</p>
                </section>

                {/* <!-- Contact --> */}
                <section>
                    <h2 className="text-xl font-semibold mb-2">Contact</h2>
                    <p className="mb-4">Pentru orice întrebări legate de acești termeni, vă rugăm să ne contactați la: [<a href="mailto:contact@metu.ro">contact@metu.ro</a>]</p>
                </section>
            </div>
            <div className="flex flex-row items-center justify-center">
                <button
                    type="button"
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    onClick={onAgree}
                >
                    Sunt de acord
                </button>
            </div>
        </div>
    )
}