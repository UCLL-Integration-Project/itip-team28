import { User } from "@/types";

const loginUser = (user: User) => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/users/login";
    console.log("fetching: ", url);
    return fetch(url, {
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
    const url = process.env.NEXT_PUBLIC_API_URL + "/users/signup";
    console.log("fetching: ", url);
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        return response;
    } catch (error) {
        console.error("Error during registration:", error);
        throw new Error("Network error during registration. Please try again.");
    }
}

const UserService = {
    loginUser,
    register
};
export default UserService;