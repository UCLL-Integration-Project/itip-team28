import UserService from "@/services/UserService";
import { StatusMessage } from "@/types";
import React from "react";
import { useRouter } from "next/router";
import { useState } from "react";

const UserLoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [UsernameError, setUsernameError] = useState('');
    const [PasswordError, setPasswordError] = useState('');
    const [StatusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const router = useRouter();

    const clearErrors = () => {
        setUsernameError('');
        setPasswordError('');
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let result = true;

        if (!username && username.trim() === '') {
            setUsernameError('Username is required');
            result = false;
        }

        if (!password && password.trim() === '') {
            setPasswordError('Password is required');
            result = false;
        }

        return result;
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        clearErrors();

        if (!validate()) {
            return;
        }

        const user = { username, password };
        const response = await UserService.loginUser(user);


        if (response.status === 200) {
            setStatusMessages([{ message: "Login successful", type: "success" }]);

            const user = await response.json();
            sessionStorage.setItem(
                'LoggedInUser',
                JSON.stringify({
                    token: user.token,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    id: user.id
                })
            );
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } else if (response.status === 401) {
            setStatusMessages([{ message: "Incorrect credentials", type: "error" }]);
        } else {
            const result = await response.json();
            setStatusMessages([
                {
                    message: result.ServiceException,
                    type: "error"
                },
            ]);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-center text-text">Login</h3>
            </div>
            {StatusMessages && (
                <div className="p-3 sm:p-4 rounded-md">
                    <ul className="space-y-1 sm:space-y-2">
                        {StatusMessages.map(({ message, type }, index) => (
                            <li
                                key={index}
                                className={`text-sm ${type === 'success' ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                    <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-text">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="text-text mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                    />
                    {UsernameError && <p className="mt-1 text-xs sm:text-sm text-red-600">{UsernameError}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-text">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-text mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                    />
                    {PasswordError && <p className="mt-1 text-xs sm:text-sm text-red-600">{PasswordError}</p>}
                </div>
                <div >
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm sm:text-base hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-500 transition">Login</button>
                </div>
            </form>
            <div className="text-center">
                <p className="text-xs sm:text-sm text-text">Don't have an account? <a href="/login/register" className="link-text hover:underline">Register</a></p>
            </div>
        </div>
    );
};

export default UserLoginForm;