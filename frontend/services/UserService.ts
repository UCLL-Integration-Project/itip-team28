import { User } from "@/types";

const loginUser = (user: User) => {
    const url = process.env.NEXT_PUBLIC_API_URL + "users/login";
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

const UserService = {
    loginUser,
};
export default UserService;