import { Route } from "@/types";

const getToken = (): string => {
    const loggedInUserString = sessionStorage.getItem('LoggedInUser');
    return loggedInUserString ? JSON.parse(loggedInUserString).token : '';
};

const createRoute = (route: Route) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/routes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify(route),
    }).catch((error) => {
        console.error("Error:", error);
        throw error;
    });
}

const getAllRoutes = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/routes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    }).catch((error) => {
        console.error("Error:", error);
        throw error;
    });
};

const NavigationService = {
    createRoute,
    getAllRoutes
};
export default NavigationService;