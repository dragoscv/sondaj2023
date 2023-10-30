/**
 * Renders a tabbed interface for displaying different types of surveys.
 * @returns A React component that displays a tabbed interface.
 */
'use client'

import { useState, useCallback } from 'react'
import Sondaje from '@/components/Sondaje'
import { Tabs, Tab } from "@nextui-org/react";

export default function MainTabs() {
    const [activeTab, setActiveTab] = useState<string>('persoana');
    const [first, setFirst] = useState<boolean>(false);

    const handleTabChange = useCallback((key: any) => {
        if (!first) {
            setFirst(true);
            const urlParams = new URLSearchParams(window.location.search);
            const tipSondaj = urlParams.get('tipSondaj');
            if (!tipSondaj) return;
            setActiveTab(tipSondaj);
            return;
        }
        const url = new URL(window.location.href);
        url.searchParams.set('tipSondaj', key.toString() as string);
        window.history.replaceState({}, '', url);
        setActiveTab(key.toString());
    }, [first]);

    return (
        <div className="flex h-full flex-col items-center justify-start mt-4">
            <Tabs
                aria-label="Options"
                role='group'
                variant='bordered'
                classNames={{
                    base: 'inline-flex',
                    tabList: 'overflow-hidden flex flex-wrap justify-center rounded-md shadow-sm',
                    tab: `inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white w-auto`,
                    tabContent: "group-data-[selected=true]:text-[#06b6d4]",
                }}
                // selectedKey={selectedTab}
                onSelectionChange={handleTabChange}
            >
                <Tab
                    as={'button'}
                    key="persoana"
                    title={
                        <div className='flex flex-row justify-center items-center gap-2 w-auto'>
                            <svg width='20px' height='20px' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 -1 22 22">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                            </svg> Candidati
                        </div>
                    }
                />
                <Tab
                    key="partid"
                    title={
                        <div className={`flex flex-row justify-center items-center gap-2`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="2 2 20 20" fill="currentColor">
                                <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M15.2679 8C15.5332 7.54063 15.97 7.20543 16.4824 7.06815C16.9947 6.93086 17.5406 7.00273 18 7.26795C18.4594 7.53317 18.7946 7.97 18.9319 8.48236C19.0691 8.99472 18.9973 9.54063 18.7321 10C18.4668 10.4594 18.03 10.7946 17.5176 10.9319C17.0053 11.0691 16.4594 10.9973 16 10.7321C15.5406 10.4668 15.2054 10.03 15.0681 9.51764C14.9309 9.00528 15.0027 8.45937 15.2679 8L15.2679 8Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M5.26795 8C5.53317 7.54063 5.97 7.20543 6.48236 7.06815C6.99472 6.93086 7.54063 7.00273 8 7.26795C8.45937 7.53317 8.79457 7.97 8.93185 8.48236C9.06914 8.99472 8.99727 9.54063 8.73205 10C8.46683 10.4594 8.03 10.7946 7.51764 10.9319C7.00528 11.0691 6.45937 10.9973 6 10.7321C5.54063 10.4668 5.20543 10.03 5.06815 9.51764C4.93086 9.00528 5.00273 8.45937 5.26795 8L5.26795 8Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M16.8816 18L15.9013 18.1974L16.0629 19H16.8816V18ZM20.7202 16.9042L21.6627 16.5699L20.7202 16.9042ZM14.7808 14.7105L14.176 13.9142L13.0194 14.7927L14.2527 15.5597L14.7808 14.7105ZM19.8672 17H16.8816V19H19.8672V17ZM19.7777 17.2384C19.7707 17.2186 19.7642 17.181 19.7725 17.1354C19.7804 17.0921 19.7982 17.0593 19.8151 17.0383C19.8474 16.9982 19.874 17 19.8672 17V19C21.0132 19 22.1414 17.9194 21.6627 16.5699L19.7777 17.2384ZM17 15C18.6416 15 19.4027 16.1811 19.7777 17.2384L21.6627 16.5699C21.1976 15.2588 19.9485 13 17 13V15ZM15.3857 15.5069C15.7702 15.2148 16.282 15 17 15V13C15.8381 13 14.9028 13.3622 14.176 13.9142L15.3857 15.5069ZM14.2527 15.5597C15.2918 16.206 15.7271 17.3324 15.9013 18.1974L17.8619 17.8026C17.644 16.7204 17.0374 14.9364 15.309 13.8614L14.2527 15.5597Z" fill="currentColor" />
                                <path d="M9.21918 14.7105L9.7473 15.5597L10.9806 14.7927L9.82403 13.9142L9.21918 14.7105ZM3.2798 16.9041L4.22227 17.2384L4.22227 17.2384L3.2798 16.9041ZM7.11835 18V19H7.93703L8.09867 18.1974L7.11835 18ZM7.00001 15C7.71803 15 8.22986 15.2148 8.61433 15.5069L9.82403 13.9142C9.09723 13.3621 8.1619 13 7.00001 13V15ZM4.22227 17.2384C4.59732 16.1811 5.35842 15 7.00001 15V13C4.0515 13 2.80238 15.2587 2.33733 16.5699L4.22227 17.2384ZM4.13278 17C4.126 17 4.15264 16.9982 4.18486 17.0383C4.20176 17.0593 4.21961 17.0921 4.22748 17.1354C4.2358 17.181 4.22931 17.2186 4.22227 17.2384L2.33733 16.5699C1.85864 17.9194 2.98677 19 4.13278 19V17ZM7.11835 17H4.13278V19H7.11835V17ZM8.09867 18.1974C8.27289 17.3324 8.70814 16.206 9.7473 15.5597L8.69106 13.8614C6.96257 14.9363 6.356 16.7203 6.13804 17.8026L8.09867 18.1974Z" fill="currentColor" />
                                <path d="M12 14C15.5715 14 16.5919 16.5512 16.8834 18.0089C16.9917 18.5504 16.5523 19 16 19H8C7.44772 19 7.00829 18.5504 7.11659 18.0089C7.4081 16.5512 8.42846 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg> Partide
                        </div>
                    }
                />
                <Tab
                    key="lege"
                    title={
                        <div className='flex flex-row justify-center items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20px" height="20px" viewBox="0 2 16 16"><path d="M14.443 4.445a1.615 1.615 0 0 1-1.613 1.614h-.506v8.396a1.615 1.615 0 0 1-1.613 1.613H2.17a1.613 1.613 0 1 1 0-3.227h.505V4.445A1.615 1.615 0 0 1 4.289 2.83h8.54a1.615 1.615 0 0 1 1.614 1.614zM2.17 14.96h7.007a1.612 1.612 0 0 1 0-1.01H2.172a.505.505 0 0 0 0 1.01zm9.045-10.515a1.62 1.62 0 0 1 .08-.505H4.29a.5.5 0 0 0-.31.107l-.002.001a.5.5 0 0 0-.193.397v8.396h6.337a.61.61 0 0 1 .6.467.632.632 0 0 1-.251.702.505.505 0 1 0 .746.445zm-.86 1.438h-5.76V6.99h5.76zm0 2.26h-5.76V9.25h5.76zm0 2.26h-5.76v1.108h5.76zm2.979-5.958a.506.506 0 0 0-.505-.505.496.496 0 0 0-.31.107h-.002a.501.501 0 0 0-.194.398v.505h.506a.506.506 0 0 0 .505-.505z" /></svg> Legi
                        </div>
                    }
                />
                <Tab
                    key="altele"
                    title={
                        <div className='flex flex-row justify-center items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="20px" width="20px" version="1.1" id="Layer_1" viewBox="0 0 512 512">
                                <g>
                                    <g>
                                        <circle cx="156.903" cy="156.903" r="33.032" />
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M256,0C114.842,0,0,114.842,0,256s114.842,256,256,256s256-114.842,256-256S397.158,0,256,0z M172.151,67.361    c43.249,7.308,75.591,45.39,75.591,89.542c0,50.089-40.75,90.839-90.839,90.839c-44.154,0-82.234-32.342-89.544-75.591    C88.125,125.617,125.617,88.125,172.151,67.361z M256,462.452c-19.248,0-37.886-2.656-55.575-7.607    c6.914-24.181,29.202-41.941,55.575-41.941c26.373,0,48.66,17.76,55.575,41.941C293.885,459.796,275.248,462.452,256,462.452z     M357.473,435.735c-14.541-42.07-54.521-72.38-101.473-72.38s-86.933,30.31-101.475,72.38    C91.902,400.24,49.548,332.978,49.548,256c0-2.836,0.073-5.654,0.187-8.461c4.534,5.359,9.46,10.42,14.805,15.091    c25.569,22.351,58.37,34.661,92.363,34.661c77.409,0,140.387-62.978,140.387-140.387c0-33.993-12.31-66.794-34.659-92.363    c-4.671-5.343-9.733-10.27-15.091-14.805c2.806-0.112,5.624-0.187,8.46-0.187c79.286,0,148.264,44.934,182.84,110.666    c-34.948,17.725-58.969,53.991-58.969,95.785s24.021,78.06,58.969,95.785C420.339,386.96,391.989,416.173,357.473,435.735z     M429.419,256c0-20.617,10.858-38.737,27.148-48.972c3.835,15.705,5.885,32.102,5.885,48.972s-2.05,33.267-5.885,48.972    C440.277,294.737,429.419,276.617,429.419,256z" />
                                    </g>
                                </g>
                            </svg> Altele
                        </div>
                    }
                />
            </Tabs>
            <div key={activeTab}>
                <Sondaje sondajType={activeTab as string} />
            </div>
        </div>
    )
}
