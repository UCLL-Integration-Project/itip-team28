import RouteService from "@/services/RouteService";
import { Reader, Route, StatusMessage, User } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CreateReaderComponent from "./CreateReaderComponent";
import StockModal from "./StockModal";

type Props = {
    readers: Array<Reader>;
    selectReader: (reader: Reader) => void;
}

const Navigation: React.FC<Props> = ({ readers, selectReader }: Props) => {
    const [LoggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [StatusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [isCreateReaderModalOpen, setIsCreateReaderModalOpen] = useState(false);
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
            // const route: Route = {
            //     destination,
            //     status: false,
            // };
            // await RouteService.createRoute(route);
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

            {isStockModalOpen && (
                <StockModal
                    isOpen={isStockModalOpen}
                    onClose={() => setIsStockModalOpen(false)}
                    onSubmit={({ macAddress, stock }) => {
                        const destination = readers.find(r => r.MacAddress === macAddress);
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
                <div className="p-3 sm:p-4 rounded-md">
                    <ul className="space-y-1 sm:space-y-2">
                        {StatusMessages.map(({ message, type }, index) => (
                            <li
                                key={index}
                                className={`text-sm text-center ${type === "success" ? "text-green-600" : "text-red-600"
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
                                    {reader.coordinates?.longitude + ", " + reader.coordinates?.latitude || "N/A"}
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
                    onClick={() => setIsCreateReaderModalOpen(true)}
                    className="text-indigo-600 hover:underline text-xs sm:text-sm"
                >
                    Add Location
                </button>
            </div>

            <CreateReaderComponent
                isOpen={isCreateReaderModalOpen}
                onClose={() => setIsCreateReaderModalOpen(false)}
                onSuccess={handleReaderCreated}
                setStatusMessages={setStatusMessages}
            />
        </>
    );
}
export default Navigation;
