'use client';

import { DarkModeSwitch } from 'react-toggle-dark-mode';
import * as React from 'react';

export default function SettingsPage() {

    const [isDarkMode, setDarkMode] = React.useState<boolean>(false);

    React.useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const isDark = savedTheme === 'dark';
        setDarkMode(isDark);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    const toggleDarkMode = (checked: boolean) => {
        const newTheme = checked ? 'dark' : 'light';
        setDarkMode(checked);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
       <div className="flex flex-col m-20 w-8/10 h-8/10 rounded-[8] bg-background">
               <div className="flex flex-row justify-between w-full h-1/12 bg-background border-b-2 border-lightforeground items-center">
                    <h2 className="m-5 p-2 text-2xl font-bold">Your Settings</h2>
                </div>
                <div className="flex flex-col m-4 p-4 bg-background gap-10">
                    <div className="flex items-center">
                        <span className="text-lg flex-grow">light/darkmode</span>
                        <DarkModeSwitch
                          checked={isDarkMode}
                          onChange={toggleDarkMode}
                          size={40}
                          sunColor="#FDB813"
                          moonColor="#F4F4F5"
                        />
                    </div>
                    <div className='flex items-center bg-background'>
                        <span className="text-lg flex-grow">placeholder languade won´t be useful</span>
                        <select className="bg-lightforeground text-font p-2 rounded-[8]">
                            <option value="en">English</option>
                            <option value="de">German</option>
                            <option value="fr">French</option>
                            <option value="es">Spanish</option>
                        </select>
                    </div>
                </div>
        </div>
    );
}