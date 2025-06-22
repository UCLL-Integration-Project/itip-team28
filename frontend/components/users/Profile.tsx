import UserService from "@/services/UserService";
import { StatusMessage } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
    pushNotification: (message: StatusMessage) => void;
};

const Profile: React.FC<Props> = ({ pushNotification }) => {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const router = useRouter();

    useEffect(() => {
        const loggedInUserString = sessionStorage.getItem("LoggedInUser");
        if (!loggedInUserString) {
            pushNotification({ message: "You are not logged in. Redirecting to login.", type: "error" });
            setTimeout(() => router.push("/login"), 2000);
            return;
        }

        UserService.getCurrentUser()
            .then(async (response) => {
                if (response.ok) {
                    const user = await response.json();
                    setUsername(user.username);
                    setRole(user.role);
                    sessionStorage.setItem("LoggedInUser", JSON.stringify({ ...user, token: JSON.parse(loggedInUserString).token }));
                } else {
                    pushNotification({ message: "Failed to fetch user information", type: "error" });
                    setStatusMessages([{ message: "Failed to fetch user information", type: "error" }]);
                    if (response.status === 401) {
                        pushNotification({ message: "Unauthorized: Please log in again", type: "error" });
                        setStatusMessages([{ message: "Unauthorized: Please log in again", type: "error" }]);
                        sessionStorage.removeItem("LoggedInUser");
                        setTimeout(() => router.push("/login"), 2000);
                    }
                }
            })
            .catch((error) => {
                pushNotification({ message: `Error: ${error.message}`, type: "error" });
                setStatusMessages([{ message: `Error: ${error.message}`, type: "error" }]);
            });
    }, [router, pushNotification]);

    useEffect(() => {
        if (statusMessages.length > 0 && statusMessages[0].type === "success") {
        const timer = setTimeout(() => {
            setStatusMessages([]);
        }, 3000);
        return () => clearTimeout(timer);
        }
    }, [statusMessages]);

    const clearErrors = () => {
        setOldPasswordError("");
        setNewPasswordError("");
        setConfirmNewPasswordError("");
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let result = true;
        clearErrors();
        
        if (!newPassword || newPassword.trim() === "") {
            setNewPasswordError("New password cannot be empty");
            pushNotification({ message: "New password cannot be empty", type: "error" });
            setStatusMessages([{ message: "New password cannot be empty", type: "error" }]);
            result = false;
        }
        if (!confirmNewPassword || confirmNewPassword.trim() === "") {
            setConfirmNewPasswordError("Confirm new password cannot be empty");
            pushNotification({ message: "Confirm new password cannot be empty", type: "error" });
            setStatusMessages([{ message: "Confirm new password cannot be empty", type: "error" }]);
            result = false;
        }
        if (!oldPassword || oldPassword.trim() === "") {
            setOldPasswordError("Current password cannot be empty");
            pushNotification({ message: "Current password cannot be empty", type: "error" });
            setStatusMessages([{ message: "Current password cannot be empty", type: "error" }]);
            result = false;
        }



        if (newPassword !== confirmNewPassword) {
            setConfirmNewPasswordError("New password and confirmation do not match");
            pushNotification({ message: "New password and confirmation do not match", type: "error" });
            setStatusMessages([{ message: "New password and confirmation do not match", type: "error" }]);
            result = false;
        }


        return result;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        if (!validate()) return;

        try {
            const response = await UserService.changePassword(oldPassword || null, newPassword, confirmNewPassword);
            const result = await response.json();

            if (response.ok) {
                pushNotification({ message: "Password changed successfully", type: "success" });
                setStatusMessages([{ message: "Password changed successfully", type: "success" }]);
                setOldPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            } else {
                const errorMessage = result.ServiceException || "Failed to change password";
                pushNotification({ message: errorMessage, type: "error" });
                setStatusMessages([{ message: errorMessage, type: "error" }]);
                if (response.status === 401) {
                    pushNotification({ message: "Unauthorized: Please log in again", type: "error" });
                    setStatusMessages([{ message: "Unauthorized: Please log in again", type: "error" }]);
                    sessionStorage.removeItem("LoggedInUser");
                    setTimeout(() => router.push("/login"), 2000);
                }
            }
        } catch (error: any) {
            pushNotification({ message: `Failed to change password: ${error.message}`, type: "error" });
            setStatusMessages([{ message: `Failed to change password: ${error.message}`, type: "error" }]);
        }
    };

    return (
        <div className="bg-comp rounded-lg shadow-md px-6 py-6 flex flex-col items-start gap-6 w-full max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-text">Profile</h1>

        {statusMessages.length > 0 && (
            <div className="mb-4 w-full p-3 rounded-md bg-table animate-fade-in shadow-sm">
                <ul className="space-y-1">
                    {statusMessages.map(({ message, type }, index) => (
                    <li
                        key={index}
                        className={`text-sm text-center ${type === "success" ? "text-green-400" : "text-red-400"}`}
                    >
                        {message}
                    </li>
                    ))}
                </ul>
            </div>
        )}

        <div className="w-full space-y-6">
            <div>
                <h2 className="text-lg font-medium text-text">User Information</h2>
                    <p className="text-sm text-gray-300 dark:text-gray-400">
                        <strong>Username:</strong> {username || "Loading..."}
                    </p>
                    <p className="text-sm text-gray-300 dark:text-gray-400">
                        <strong>Role:</strong> {role || "Loading..."}
                    </p>
            </div>

            <div>
                <h2 className="text-lg font-medium text-text">Change Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="oldPassword"
                            className="block text-sm font-medium text-text"
                        >
                            Current Password 
                        </label>
                        <input
                            type="password"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="mt-1 w-full p-2 border border-dk rounded-md text-sm bg-background text-text focus:ring-2 focus:ring-link-text focus:border-link-text placeholder-gray-400 dark:placeholder-gray-500"
                        />
                        {oldPasswordError && (
                            <p className="mt-1 text-sm text-red-500">{oldPasswordError}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-text"
                        >
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 w-full p-2 border border-dk rounded-md text-sm bg-background text-text focus:ring-2 focus:ring-link-text focus:border-link-text placeholder-gray-400 dark:placeholder-gray-500"
                        />
                        {newPasswordError && (
                            <p className="mt-1 text-sm text-red-500">{newPasswordError}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="confirmNewPassword"
                            className="block text-sm font-medium text-text"
                        >
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="mt-1 w-full p-2 border border-dk rounded-md text-sm bg-background text-text focus:ring-2 focus:ring-link-text focus:border-link-text placeholder-gray-400 dark:placeholder-gray-500"
                        />
                        {confirmNewPasswordError && (
                            <p className="mt-1 text-sm text-red-500">{confirmNewPasswordError}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            className="bg-button text-white py-2 px-4 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-link-text transition-colors duration-200"
                        >
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default Profile;