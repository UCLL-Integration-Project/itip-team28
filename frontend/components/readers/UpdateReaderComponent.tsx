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
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="bg-comp rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 sm:space-y-6 transform transition-all duration-300 scale-95 hover:shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h4 className="text-lg font-bold text-text text-center">
                    Update Reader Name
                </h4>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {StatusMessages.length > 0 && (
                        <div className="p-3 sm:p-4 rounded-md">
                            <ul className="space-y-1 sm:space-y-2">
                                {StatusMessages.map(({ message, type }, index) => (
                                    <li
                                        key={index}
                                        className={`text-sm text-center ${type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
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
                            className="block text-base font-medium text-text"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full p-2 sm:p-3 border border-dk rounded-md text-base bg-background focus:ring-2 focus:ring-link-text focus:border-link-text text-text placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        {NameError && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{NameError}</p>
                        )}
                        {FormError && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{FormError}</p>
                        )}
                    </div>


                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => {
                                setName(reader.name || "");
                                clearErrors();
                                onClose();
                            }}
                            className="bg-background text-text py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-link-text transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-button text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-link-text transition-colors duration-200"
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