import { Reader } from "@/types";

const getToken = (): string => {
    const loggedInUserString = sessionStorage.getItem('loggedInUser');
    return loggedInUserString ? JSON.parse(loggedInUserString).token : '';
};


const getReaders = () => { 
    const token = getToken();
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/readers", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
};

const createReader = (reader: Reader) => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/readers";
    const token = getToken();
    console.log("fetching: ", url);
    try {
        const response = fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(reader),
        });
        return response;
    }catch (error) {
        console.error("Error during registration:", error);
        throw new Error("Network error during registration. Please try again.");
    }
}

const ReaderService = {
    getReaders,
    createReader
};
export default ReaderService;