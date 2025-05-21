import { Route } from "@/types";

const getToken = (): string => {
    const loggedInUserString = sessionStorage.getItem('loggedInUser');
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

const NavigationService = {
    createRoute
};
export default NavigationService;