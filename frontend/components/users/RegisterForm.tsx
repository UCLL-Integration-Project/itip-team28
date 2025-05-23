import UserService from "@/services/UserService";
import { StatusMessage } from "@/types";
import { useRouter } from "next/router";
import { useState } from "react";

const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [UsernameError, setUsernameError] = useState('');
    const [EmailError, setEmailError] = useState('');
    const [PasswordError, setPasswordError] = useState('');
    const [ConfirmPasswordError, setConfirmPasswordError] = useState('');
    const [StatusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const router = useRouter();

    const clearErrors = () => {
        setUsernameError('');
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let result = true;
        clearErrors();

        if (!username || username.trim() === '') {
            setUsernameError('Username is required');
            result = false;
        }

        if (!email || email.trim() === '') {
            setEmailError('Email is required');
            result = false;
        }

        if (!password || password.trim() === '') {
            setPasswordError('Password is required');
            result = false;
        }

        if (password !== ConfirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            result = false;
        }

        return result;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        if (!validate()) {
            return;
        }

        try {
            const response = await UserService.register({
                username,
                email,
                password,
                role: "user",
            });

            const result = await response.json();

            if (response.status === 200) {
                setStatusMessages([{ message: "Registration successful", type: "success" }]);
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else if (response.status === 400) {
                setStatusMessages([{ message: result.ServiceException || "Registration failed", type: "error" }]);
            } else {
                setStatusMessages([
                    { message: "An unexpected error occurred. Please try again later.", type: "error" },
                ]);
            }
        } catch (error: any) {
            setStatusMessages([
                { message: error.message || "Network error. Please try again.", type: "error" },
            ]);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-center text-text">Register</h2>

            {StatusMessages.length > 0 && (
                <ul className="space-y-1 sm:space-y-2">
                    {StatusMessages.map(({ message, type }, index) => (
                        <li
                            key={index}
                            className={`text-sm ${type === 'error' ? 'text-red-600' : 'text-green-600'}`}
                        >
                            {message}
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-text">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="text-text w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {UsernameError && <p className="text-red-600 text-sm">{UsernameError}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-text w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {EmailError && <p className="text-red-600 text-sm">{EmailError}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-text w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {PasswordError && <p className="text-red-600 text-sm">{PasswordError}</p>}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-text">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={ConfirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="text-text w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {ConfirmPasswordError && <p className="text-red-600 text-sm">{ConfirmPasswordError}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        className="text-text w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;