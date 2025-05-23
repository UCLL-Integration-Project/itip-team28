import { User } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from "react";
import {MdSunny, MdDarkMode} from 'react-icons/md';

const Header: React.FC = () => {
    const [LoggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [DarkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {

        const storedDarkMode = localStorage.getItem('darkmode');
        if (storedDarkMode === 'true') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
        }

        const LoggedInUserString = sessionStorage.getItem('LoggedInUser');

        if (LoggedInUserString !== null) {
            setLoggedInUser(JSON.parse(LoggedInUserString));
        } else {
            setLoggedInUser(null);
        }

    }, []);

    const handleDarkmode = (darkmode: boolean) => {
        setDarkMode(darkmode);
        localStorage.setItem('darkmode', darkmode.toString());

        if (darkmode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }


    const handleClick = () => {
        sessionStorage.removeItem('LoggedInUser');
        setLoggedInUser(null);
    };

    const IsManager = LoggedInUser && (LoggedInUser.role?.toUpperCase() === "MANAGER");

    return (
        <header className="bg-gray-800 text-white py-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center px-6">
                <ul className="flex gap-6">
                    {LoggedInUser && (
                        <li>
                            <Link href="/" className="hover:text-indigo-400 transition-colors duration-200">
                                Home
                            </Link>
                        </li>
                    )}
                    {IsManager && (
                        <li>
                            <Link href="/navigation" className="hover:text-indigo-400 transition-colors duration-200">
                                Navigation
                            </Link>
                        </li>
                    )}
                    {IsManager && (
                        <li>
                            <Link href="/cars" className="hover:text-indigo-400 transition-colors duration-200">
                                Cars
                            </Link>
                        </li>
                    )}
                    {IsManager && (
                        <li>
                            <Link href="/route" className="hover:text-indigo-400 transition-colors duration-200">
                                Route
                            </Link>
                        </li>
                    )}
                    <li>
                        {!LoggedInUser && (<Link href="/login" className="hover:text-indigo-400 transition-colors duration-200">
                            Login
                        </Link>)}

                        {LoggedInUser && (<Link href="/login" onClick={handleClick} className="hover:text-red-400 transition-colors duration-200">
                            Logout
                        </Link>)}
                    </li>
                </ul>
                <div className="flex items-center">
                    {!DarkMode && (
                        <button onClick={() => handleDarkmode(true)} aria-label="Switch to Dark Mode">
                            <MdDarkMode className="text-2xl hover:text-indigo-400 transition-colors duration-200" />
                        </button>)}
                    {DarkMode && (
                        <button onClick={() => handleDarkmode(false)} aria-label="Switch to Light Mode">
                            <MdSunny className="text-2xl hover:text-indigo-400 transition-colors duration-200" />
                        </button>)}
                </div>
            </nav>

        </header>
    );
};

export default Header;