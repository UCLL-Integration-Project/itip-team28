import RouteService from "@/services/RouteService";
import ReaderService from "@/services/ReaderService";
import { Reader, Route, StatusMessage, User } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Props = {
    readers: Array<Reader>;
    selectReader: (reader: Reader) => void;
}

const Navigation: React.FC<Props> = ({readers, selectReader}: Props) => {
    const [LoggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [StatusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [MacAddress, setMacAddress] = useState("");
    const [coordinates, setCoordinates] = useState("");
    const [nameError, setNameError] = useState("");
    const [macAddressError, setMacAddressError] = useState("");
    const [coordinatesError, setCoordinatesError] = useState("");
    const router = useRouter();

    const clearErrors = () => {
        setNameError("");
        setMacAddressError("");
        setCoordinatesError("");
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let result = true;
        clearErrors();

        if (!name || name.trim() === "") {
            setNameError("Name is required");
            result = false;
        }
        //check if this validation is in the correct format
        if (!MacAddress || MacAddress.trim() === "") {
        setMacAddressError("Mac address is required");
        result = false;
        } else if (!/^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/.test(MacAddress)) {
        setMacAddressError("Mac address must be in the format: XX:XX:XX:XX:XX:XX");
        result = false;
        }
        // extra validation for mac coordinates might be wanted/needed at a later point
        if (!coordinates || coordinates.trim() === "") {
            setCoordinatesError("Coordinates are required");
            result = false;
        }

        return result;
    };

    useEffect(() => {
        const LoggedInUserString = sessionStorage.getItem('LoggedInUser');
        if (LoggedInUserString !== null) {
            setLoggedInUser(JSON.parse(LoggedInUserString));
        } else {
            setLoggedInUser(null);
            router.push("/login");
        }
    }, []);

    const handleDrive = async (destination: Reader) => {
        setStatusMessages([]);

        try {
            const route: Route = {
                destination,
                status: false,
            };

            await RouteService.createRoute(route);
            setStatusMessages([{ message: "Route created successfully", type: "success" }]);
            selectReader(destination);
        } catch (err) {
            setStatusMessages([{ message: "Failed to create route", type: "error" }]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        if (!validate()) {
            return;
        }

        try{
            const response = await ReaderService.createReader({
                name,
                MacAddress,
                coordinates,
            });

            const result = await response.json();

            if (response.status === 200) {
                setStatusMessages([{ message: "Reader created successfully", type: "success" }]);
                setIsModalOpen(false);
                setName("");
                setMacAddress("");
                setCoordinates("");
                setTimeout(() => {
                    router.push("/navigation");
                }, 2000);
            } else if (response.status === 400) {
                setStatusMessages([{ message: result.message || "Failed to create reader", type: "error" }]);
            } else {
                setStatusMessages([{ message: "Failed to create reader", type: "error" }]);
            }
        } catch (error:any) {
            setStatusMessages([{ message: error.message || "Failed to create reader", type: "error" }]);
        }
    };

    const IsManager = LoggedInUser && (LoggedInUser.role?.toUpperCase() === "MANAGER");
    
    if (!IsManager) {
        return <p className="text-center mt-10 text-red-600">You are not authorized to view this page.</p>;
    }

    return (
        <>
            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
                <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-center text-gray-800">
                        Navigation
                    </h3>
                </div>
            </div>

            {StatusMessages.length > 0 && (
                <div className="p-3 sm:p-4 rounded-md">
                    <ul className="space-y-1 sm:space-y-2">
                        {StatusMessages.map(({ message, type }, index) => (
                            <li
                                key={index}
                                className={`text-sm text-center ${
                                    type === "success" ? "text-green-600" : "text-red-600"
                                }`}>
                                {message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-md">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-700 border-b border-gray-300">
                                Name
                            </th>
                            <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-700 border-b border-gray-300">
                                Mac adress
                            </th>
                            <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-700 border-b border-gray-300">
                                Coordinates
                            </th>
                            <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-700 border-b border-gray-300">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {readers.map((reader, index) => (
                            <tr key={reader.id || index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm border-b border-gray-300">
                                    {reader.name || "N/A"}
                                </td>
                                <td className="px-4 py-2 text-sm border-b border-gray-300">
                                    {reader.MacAddress || "N/A"}
                                </td>
                                <td className="px-4 py-2 text-sm border-b border-gray-300">
                                    {reader.coordinates || "N/A"}
                                </td>
                                <td className="px-4 py-2 text-sm border-b border-gray-300">
                                    <button
                                        onClick={() => handleDrive(reader)}
                                        className="bg-gray-800 text-white py-1 px-3 rounded-md text-xs sm:text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                                    >
                                        Drive here
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-indigo-600 hover:underline text-xs sm:text-sm"
                >
                    Add Location
                </button>
            </div>
            
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-40 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4 sm:space-y-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-center text-gray-800">
                            Add New Location
                        </h4>

                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                            <div>
                                <label 
                                    htmlFor="name" 
                                    className="block text-xs sm:text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input 
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {nameError && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{nameError}</p>
                                )}
                            </div>

                            <div>
                                <label 
                                    htmlFor="macAddress"
                                    className="block text-xs sm:text-sm font-medium text-gray-700"
                                >
                                    Mac Address
                                </label>
                                <input 
                                    type="text" 
                                    id="macAddress"
                                    value={MacAddress}
                                    onChange={(e) => setMacAddress(e.target.value)}
                                    className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {macAddressError && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{macAddressError}</p>
                                )}
                            </div>

                            <div>
                                <label 
                                    htmlFor="coordinates"
                                    className="block text-xs sm:text-sm font-medium text-gray-700"
                                >
                                    Coordinates
                                </label>
                                <input 
                                    type="text"
                                    id="coordinates"
                                    value={coordinates}
                                    onChange={(e) => setCoordinates(e.target.value)}
                                    className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {coordinatesError && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-600">{coordinatesError}</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setName("");
                                        setMacAddress("");
                                        setCoordinates("");
                                        clearErrors();
                                    }}
                                    className="bg-gray-300 text-gray-800 py-1 px-4 rounded-md text-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gray-800 text-white py-1 px-4 rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                                >
                                    Add Location
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );

}
export default Navigation;