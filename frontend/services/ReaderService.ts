import { Reader } from "@/types";

const getToken = (): string => {
    const loggedInUserString = sessionStorage.getItem('LoggedInUser');
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

const updateReader = (reader: Reader) => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/readers/" + reader.id;
    const token = getToken();
    console.log("fetching: ", url);
    try {
        const readerInput = {
            MacAddress: reader.macAddress,
            name: reader.name,
            coordinates: {
                longitude: reader.coordinates?.longitude,
                latitude: reader.coordinates?.latitude,
            },
        };
        const response = fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(readerInput),
        });
        return response;
    } catch (error) {
        console.error("Error during update:", error);
        throw new Error("Network error during update. Please try again.");
    }
};

const ReaderService = {
    getReaders,
    createReader,
    updateReader
};
export default ReaderService;