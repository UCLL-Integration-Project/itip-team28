import { User } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from "react";

const Header: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    useEffect(() => {
        const loggedInUserString = sessionStorage.getItem('loggedInUser');
        if (loggedInUserString !== null) {
            setLoggedInUser(JSON.parse(loggedInUserString));
        } else {
            setLoggedInUser(null);
        }
    }, []); 

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        sessionStorage.removeItem('loggedInUser');
        setLoggedInUser(null);
    }; 

    const isManager = loggedInUser && (loggedInUser.role === "MANAGER");

    return (
        <header className="bg-gray-800 text-white py-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center px-6">
                <ul className="flex gap-6">
                    {loggedInUser && (
                        <li>
                            <Link href="/" className="hover:text-indigo-400 transition-colors duration-200">
                                Home
                            </Link>
                        </li>
                    )}
                    {isManager && (
                        <li>
                            <Link href="/navigation" className="hover:text-indigo-400 transition-colors duration-200">
                                Navigation
                            </Link>
                        </li>
                    )}
                    <li>
                        {!loggedInUser ? (
                            <Link href="/login" className="hover:text-indigo-400 transition-colors duration-200">
                                Login
                            </Link>
                        ) : (
                            <a href="/login" onClick={handleClick} className="hover:text-red-400 transition-colors duration-200">
                                Logout
                            </a>
                        )}
                    </li>
                </ul>
            </nav>
            
        </header>
    );
};

export default Header;