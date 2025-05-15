import { User } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from "react";

const Header: React.FC = () => {
    const [LoggedInUser, setLoggedInUser] = useState<User | null>(null);

    useEffect(() => {
        const LoggedInUserString = sessionStorage.getItem('LoggedInUser');
        if (LoggedInUserString !== null) {
            setLoggedInUser(JSON.parse(LoggedInUserString));
        } else {
            setLoggedInUser(null);
        }
    }, []);

    const handleClick = () => {
        sessionStorage.removeItem('LoggedInUser');
        setLoggedInUser(null);
    };

    const IsManager = LoggedInUser && (LoggedInUser.role === "MANAGER");

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
                    <li>
                        {!LoggedInUser && (<Link href="/login" className="hover:text-indigo-400 transition-colors duration-200">
                            Login
                        </Link>)}

                        {LoggedInUser && (<Link href="/login" onClick={handleClick} className="hover:text-red-400 transition-colors duration-200">
                            Logout
                        </Link>)}
                    </li>
                </ul>
            </nav>

        </header>
    );
};

export default Header;