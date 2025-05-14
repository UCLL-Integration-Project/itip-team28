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
        <header>
            <nav>
                <ul>
                    {loggedInUser && (
                        <li>
                            <Link href="/">
                                Home
                            </Link>
                        </li>
                    )}
                    {isManager && (
                        <li>
                            <Link href="/navigation">
                                Navigation
                            </Link>
                        </li>
                    )}
                    <li>
                        {!loggedInUser ? (
                            <Link href="/login">
                                Login
                            </Link>
                        ) : (
                            <a href="/login" onClick={handleClick}>
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