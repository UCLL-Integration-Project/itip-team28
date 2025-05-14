import UserService from "@/services/UserService";
import { StatusMessage } from "@/types";
import { useRouter } from "next/router";
import { useState } from "react";

const UserLoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const[usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState(''); 
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
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

    const handleSubmit = async (e: {preventDefault: () => void}) => {
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
                'loggedInUser',
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
            const {errorMessage} = await response.json();
            setStatusMessages([{ message: errorMessage, type: "error" }]);
        } else {
            setStatusMessages([
                {
                    message: "An error occurred. Please try again later.",
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
        {statusMessages && (
            <div>
                <ul>
                    {statusMessages.map(({message,type}, index) => (
                        <li key={index}>
                            {message}
                        </li>
                    ))}
                </ul>
            </div>
        )}
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {usernameError && <p>{usernameError}</p>}
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <p>{passwordError}</p>}
            </div>
            <div>
                <button type="submit">Login</button>
            </div>
        </form>
        <div>
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
    </div>
    );
};

export default UserLoginForm;