import ReaderService from "@/services/ReaderService";
import { Reader, StatusMessage } from "@/types";
import { useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    setStatusMessages: (messages: StatusMessage[]) => void;
    reader: Reader | null;
};

const UpdateReader: React.FC<Props> = ({ isOpen, onClose, onSuccess, setStatusMessages, reader }) => {
    const [name, setName] = useState(reader?.name || "");
    const [nameError, setNameError] = useState("");
    const [formError, setFormError] = useState("");

    const clearErrors = () => {
        setNameError("");
        setFormError("");
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        let isValid = true;
        if (!name || name.trim() === "") {
            setNameError("Name is required");
            isValid = false;
        }
        if (!reader?.MacAddress) {
            setFormError("MAC address is missing");
            isValid = false;
        }
        if (!reader?.coordinates || !reader.coordinates.latitude || !reader.coordinates.longitude) {
            setFormError("Coordinates are missing or incomplete");
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        if (!validate() || !reader) {
            return;
        }

        try {
            const response = await ReaderService.updateReader({
                id: reader.id,
                name,
                MacAddress: reader.MacAddress,
                coordinates: reader.coordinates,
            });

            const result = await response.json();

            if (response.ok) {
                setStatusMessages([{ message: "Reader name updated successfully", type: "success" }]);
                onClose();
                onSuccess();
                setName("");
            } else {
                setStatusMessages([{ message: result.ServiceException || "Failed to update reader", type: "error" }]);
            }
        } catch (error: any) {
            setStatusMessages([{ message: error.message || "Failed to update reader", type: "error" }]);
        }
    };

    if (!isOpen || !reader) {
        return null;
    }

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
                    Update Reader Name
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
                        {formError && (
                            <p className="mt-1 text-xs sm:text-sm text-red-600">{formError}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => {
                                setName(reader.name || "");
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
                            Update Name
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateReader;