import { User } from "@/types";

const getToken = (): string => {
    const loggedInUserString = sessionStorage.getItem('LoggedInUser');
    return loggedInUserString ? JSON.parse(loggedInUserString).token : '';
};

const loginUser = (user: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    }).catch((error) => {
        console.error("Error:", error);
        throw error;
    });
}

const register = async (user: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    }).catch((error) => {
        console.error("Error:", error);
        throw error;
    });
}

const getCurrentUser = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/me", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
    }).catch((error) => {
        console.error("Error:", error);
        throw error;
    });
};

const changePassword = (oldPassword: string|null, newPassword: string, confirmNewPassword: string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/changePassword", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
            oldPassword,
            newPassword,
            confirmNewPassword
        }),
    }).catch((error) => {
        console.error("Error:", error);
        throw error;
    });
};

const UserService = {
    loginUser,
    register,
    getCurrentUser,
    changePassword,
};
export default UserService;