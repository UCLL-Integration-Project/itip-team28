import { GridInput } from "@/types";

const getToken = (): string => {
  const LoggedInUserString = sessionStorage.getItem('LoggedInUser');
  return LoggedInUserString ? JSON.parse(LoggedInUserString).token : '';
};

const createGrid = (grid: GridInput) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/grids", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify(grid),
    }).catch((error) => {
        console.error("Error:", error);
        throw error;
    });
}

const GridService = {
  createGrid,
};
export default GridService;
