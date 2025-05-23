import ReaderService from "@/services/ReaderService";
import { Reader, StatusMessage } from "@/types";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
    IsOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    reader: Reader | null;
};

const UpdateReader: React.FC<Props> = ({ IsOpen, onClose, onSuccess, reader }) => {
    const [name, setName] = useState(reader?.name || "");
    const [NameError, setNameError] = useState("");
    const [FormError, setFormError] = useState("");
    const [StatusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const router = useRouter();

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
                macAddress: reader.macAddress,
                coordinates: reader.coordinates,
            });

            console.log(reader.id);

            const result = await response.json();

            if (response.ok) {
                setStatusMessages([{ message: "Reader name updated successfully", type: "success" }]);
                onSuccess();
                setName("");
                setTimeout(() => {
                    router.push("/navigation");
                }, 1000);
                onClose();
            } else {
                setStatusMessages([{ message: result.ServiceException || "Failed to update reader", type: "error" }]);
            }
        } catch (error: any) {
            setStatusMessages([{ message: error.message || "Failed to update reader", type: "error" }]);
        }
    };

    if (!IsOpen || !reader) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/85 backdrop-blur-xs z-50 transition-opacity duration-300"
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
                        {FormError && (
                            <p className="mt-1 text-xs sm:text-sm text-red-600">{FormError}</p>
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