import ReaderService from "@/services/ReaderService";
import { Coordinates, Reader, StatusMessage } from "@/types";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
    IsOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

const createReader: React.FC<Props> = ({ IsOpen, onClose, onSuccess }) => {
    const [name, setName] = useState("");
    const [MacAddress, setMacAddress] = useState("");
    const [longitude, setLongtitude] = useState<number>(0);
    const [latitude, setLatitude] = useState<number>(0);
    const [NameError, setNameError] = useState("");
    const [MacAddressError, setMacAddressError] = useState("");
    const [LongitudeError, setLongitudeError] = useState("");
    const [LatitudeError, setLatitudeError] = useState("");
    const [StatusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const router = useRouter();


    const clearErrors = () => {
        setNameError("");
        setMacAddressError("");
        setLongitudeError("");
        setLatitudeError("");
        setStatusMessages([]);
    };


    const validate = (): boolean => {
        let result = true;
        clearErrors();

        if (!name || name.trim() === "") {
            setNameError("Name is required");
            result = false;
        }

        if (!MacAddress || MacAddress.trim() === "") {
            setMacAddressError("Mac address is required");
            result = false;
        } else if (!/^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/.test(MacAddress)) {
            setMacAddressError("Mac address must be in the format: XX:XX:XX:XX:XX:XX");
            result = false;
        }
        // extra validation for mac coordinates might be wanted/needed at a later point
        if (longitude.toString().trim() === "") {
            setLongitudeError("Coordinates are required");
            result = false;
        }

        if (latitude.toString().trim() === "") {
            setLatitudeError("Coordinates are required");
            result = false;
        }

        return result;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        clearErrors();

        if (!validate()) {
            return;
        }

        try {
            const response = await ReaderService.createReader({
                name,
                macAddress: MacAddress,
                coordinates: {
                    longitude,
                    latitude,
                },
            });

            const result = await response.json();

            if (response.ok) {
                setStatusMessages([{ message: "Reader created successfully", type: "success" }]);
                onSuccess();
                setTimeout(() => {
                    router.push("/navigation");
                }, 1000);
                onClose();

                setName("");
                setMacAddress("");
                setLatitude(0);
                setLongtitude(0);
            } else if (response.status === 401) {
                setStatusMessages([{ message: "Unauthorized: Please log in again", type: "error" }]);
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setStatusMessages([{ message: result.ServiceException, type: "error" }]);
            }
        } catch (error: any) {
            setStatusMessages([{ message: error.message || "Failed to create reader", type: "error" }]);
        }
    };

    if (!IsOpen) { return null; }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-40 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4 sm:space-y-6 transform transition-all duration-300 scale-95"
                onClick={(e) => e.stopPropagation()}
            >
                <h4 className="text-lg sm:text-xl font-semibold text-center text-gray-800">
                    Add new Location
                </h4>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    {StatusMessages.length > 0 && (
                        <div className="p-3 sm:p-4 rounded-md">
                            <ul className="space-y-1 sm:space-y-2">
                                {StatusMessages.map(({ message, type }, index) => (
                                    <li
                                        key={index}
                                        className={`text-sm text-center ${type === "success" ? "text-green-600" : "text-red-600"}`}
                                    >
                                        {message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
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
                        {NameError && (
                            <p className="mt-1 text-xs sm:text-sm text-red-600">{NameError}</p>
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
                        {MacAddressError && (
                            <p className="mt-1 text-xs sm:text-sm text-red-600">{MacAddressError}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="longitude"
                            className="block text-xs sm:text-sm font-medium text-gray-700"
                        >
                            Longitude
                        </label>
                        <input
                            type="number"
                            id="longitude"
                            value={longitude}
                            onChange={(e) =>
                                setLongtitude(parseInt(e.target.value))
                            }
                            className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                        {LongitudeError && (
                            <p className="mt-1 text-xs sm:text-sm text-red-600">{LongitudeError}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="latitude"
                            className="block text-xs sm:text-sm font-medium text-gray-700"
                        >
                            Latitude
                        </label>
                        <input
                            type="number"
                            id="latitude"
                            value={latitude}
                            onChange={(e) =>
                                setLatitude(parseInt(e.target.value))
                            }
                            className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {LatitudeError && (
                            <p className="mt-1 text-xs sm:text-sm text-red-600">{LatitudeError}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => {
                                setName("");
                                setMacAddress("");
                                setLatitude(0);
                                setLongtitude(0);
                                clearErrors();
                                onClose();
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
    )
};

export default createReader;