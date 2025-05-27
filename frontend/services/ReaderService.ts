import { Reader, StockInput } from "@/types";
import { get } from "http";

const getToken = (): string => {
    const loggedInUserString = sessionStorage.getItem('LoggedInUser');
    return loggedInUserString ? JSON.parse(loggedInUserString).token : '';
};


const getReaders = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/readers", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
    }).catch((error) => {
        console.error("Error:", error);
        throw error;
    });
};

const createReader = (reader: Reader) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/readers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify(reader)
    }).catch((error) => {
        console.error("Error:", error);
        throw error;
    });
}

const updateReader = (reader: Reader) => {
    console.log(JSON.stringify(reader));
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/readers", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify(reader),

    }).catch((error) => {
        console.error("Error:", error);
        throw error;
    });
};

const getReadersStock = (readerId: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/readers/${readerId}/stocks`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
    }).catch((error) => {
        console.error("Error:", error);
        throw error;
    });
};

// const addStockToReader = async ({
//   readerId,
//   itemId,
//   quantity,
// }: {
//   readerId: string;
//   itemId: number;
//   quantity: number;
// }): Promise<any> => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/readers/${readerId}/stocks`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify({ itemId, quantity }),
//   });

//   if (!res.ok) {
//     const errorText = await res.text();
//     throw new Error(`Failed to update stock: ${errorText}`);
//   }

//   return res.json();
// };


const ReaderService = {
    getReaders,
    createReader,
    updateReader,
    getReadersStock,
    // addStockToReader
};
export default ReaderService;