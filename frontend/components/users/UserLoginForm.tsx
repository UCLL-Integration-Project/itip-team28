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
            const { errorMessage } = await response.json();
            setStatusMessages([{ message: errorMessage, type: "error" }]);
        } else {
            const error = await response.json();
            setStatusMessages([
                {
                    message: error.message,
                    type: "error"
                },
            ]);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-semibold text-center text-gray-800">Login</h3>
            </div>
            {StatusMessages && (
                <div>
                    <ul className="space-y-2">
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
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block mb-1 font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {UsernameError && <p className="text-sm text-red-600 mt-1">{UsernameError}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {PasswordError && <p className="text-sm text-red-600 mt-1">{PasswordError}</p>}
                </div>
                <div>
                    <button type="submit" className="w-full bg-gray-800 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition">Login</button>
                </div>
            </form>
            <div>
                <p className="text-sm text-center text-gray-600">Don't have an account? <a href="/login/register" className="text-indigo-600 hover:underline">Register</a></p>
            </div>
        </div>
    );
};

export default UserLoginForm;