import UserService from "@/services/UserService";
import { StatusMessage } from "@/types";
import { useRouter } from "next/router";
import { useState } from "react";

const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
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

        if (password !== confirmPassword) {
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

        const response = await UserService.register({
            username,
            email,
            password,
            role: "user"
        });

        const result = await response.json();

        if (response.status === 200) {
            setStatusMessages([{ message: "Registration successful", type: "success" }]);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } else {
            setStatusMessages([{ message: result.errorMessage, type: "error" }]);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800">Register</h2>

            {statusMessages.length > 0 && (
                <ul className="space-y-2">
                    {statusMessages.map(({ message, type }, index) => (
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
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {usernameError && <p className="text-red-600 text-sm">{usernameError}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {emailError && <p className="text-red-600 text-sm">{emailError}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {confirmPasswordError && <p className="text-red-600 text-sm">{confirmPasswordError}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;