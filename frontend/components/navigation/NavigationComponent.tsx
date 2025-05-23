import RouteService from "@/services/RouteService";
import ReaderService from "@/services/ReaderService";
import { Reader, Route, StatusMessage, User } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import StockModal from "../StockModal";
import UpdateReader from "../readers/UpdateReaderComponent";
import CreateReaderComponent from "../readers/CreateReaderComponent";

type Props = {
    readers: Array<Reader>;
    selectReader: (reader: Reader) => void;
};

const Navigation: React.FC<Props> = ({ readers, selectReader }: Props) => {
    const [LoggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [StatusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const [isCreateReaderModalOpen, setIsCreateReaderModalOpen] = useState(false);

    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [IsUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [SelectedReader, setSelectedReader] = useState<Reader | null>(null);
    const router = useRouter();

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
        setIsStockModalOpen(true);
        try {
            setStatusMessages([{ message: "Route created successfully", type: "success" }]);
            selectReader(destination);
        } catch (err) {
            setStatusMessages([{ message: "Failed to create route", type: "error" }]);
        }
    };

    const handleReaderCreated = () => {
        setIsCreateReaderModalOpen(false);
        setStatusMessages([{ message: "Reader created successfully", type: "success" }]);
    };

    const handleReaderUpdated = () => {
        ReaderService.getReaders().then(async (response) => {
            if (response.ok) {
                const updatedReaders = await response.json();
                readers.splice(0, readers.length, ...updatedReaders);
            }
        });
    };

    const IsManager = LoggedInUser && LoggedInUser.role?.toUpperCase() === "MANAGER";

    if (!IsManager) {
        return <p className="text-center mt-12 text-red-600 dark:text-red-400 text-lg font-medium">You are not authorized to view this page.</p>;
    }

    return (
        <>
            <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="mb-10 text-center">
                    <h3 className="text-3xl sm:text-4xl font-bold text-text">
                        Navigation
                    </h3>
                </div>
            </div>

            {isStockModalOpen && (
                <StockModal
                    isOpen={isStockModalOpen}
                    onClose={() => setIsStockModalOpen(false)}
                    onSubmit={({ macAddress, stock }) => {
                        const destination = readers.find(r => r.macAddress === macAddress);
                        if (destination) {
                            handleDrive(destination);
                        } else {
                            setStatusMessages([{ message: "Reader not found", type: "error" }]);
                        }
                        setIsStockModalOpen(false);
                        setStatusMessages([{ message: "The car is on its way!", type: "success" }]);
                    }}
                />
            )}

            {StatusMessages.length > 0 && (
                <div className="mb-8 max-w-3xl mx-auto p-4 rounded-lg bg-background animate-fade-in shadow-sm">
                    <ul className="space-y-2">
                        {StatusMessages.map(({ message, type }, index) => (
                            <li
                                key={index}
                                className={`text-base text-center ${type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                            >
                                {message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="bg-comp dark:bg-indigo-900 rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto">
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-dk rounded-xl bg-table">
                        <thead>
                            <tr className="bg-lg">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-text border-b border-dk">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-text border-b border-dk">
                                    Mac address
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-text border-b border-dk">
                                    Coordinates
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-text border-b border-dk">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {readers.map((reader, index) => (
                                <tr key={reader.id || index} className="hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors duration-300">
                                    <td className="text-text hover:text-white px-6 py-4 text-sm border-b border-dk">
                                        {reader.name || "N/A"}
                                    </td>
                                    <td className="text-text hover:text-white px-6 py-4 text-sm border-b border-dk">
                                        {reader.macAddress || "N/A"}
                                    </td>
                                    <td className="text-text hover:text-white px-6 py-4 text-sm border-b border-dk">
                                        {reader.coordinates?.longitude + ", " + reader.coordinates?.latitude || "N/A"}
                                    </td>
                                    <td className="hover:text-white px-6 py-4 text-sm border-b border-dk space-x-4">
                                        <button
                                            onClick={() => handleDrive(reader)}
                                            className="bg-button text-white py-2 px-5 rounded-lg text-base font-medium hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                        >
                                            Drive here
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedReader(reader);
                                                setIsUpdateModalOpen(true);
                                            }}
                                            className="bg-button text-white py-2 px-5 rounded-lg text-base font-medium hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                        >
                                            Update Name
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6 text-left">
                <button
                    onClick={() => setIsCreateReaderModalOpen(true)}
                    className="link-text text-sm font-medium py-2 px-4 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors duration-200"
                >
                    Add Location
                </button>
            </div>

            <CreateReaderComponent
                IsOpen={isCreateReaderModalOpen}
                onClose={() => setIsCreateReaderModalOpen(false)}
                onSuccess={handleReaderCreated}
            />
            <UpdateReader
                IsOpen={IsUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onSuccess={handleReaderUpdated}
                reader={SelectedReader}
            />
        </>
    );
};

export default Navigation;
