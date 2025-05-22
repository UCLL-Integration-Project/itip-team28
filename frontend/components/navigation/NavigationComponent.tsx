import RouteService from "@/services/RouteService";
import ReaderService from "@/services/ReaderService";
import { Reader, Route, StatusMessage, User } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UpdateReader from "../readers/UpdateReaderComponent";
import CreateReaderComponent from "../readers/CreateReaderComponent";

type Props = {
    readers: Array<Reader>;
    selectReader: (reader: Reader) => void;
};

const Navigation: React.FC<Props> = ({ readers, selectReader }: Props) => {
    const [LoggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [StatusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const [IsModalOpen, setIsModalOpen] = useState(false);
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

    const handleReaderCreated = () => {
        ReaderService.getReaders().then(async (response) => {
            if (response.ok) {
                const updatedReaders = await response.json();
                readers.splice(0, readers.length, ...updatedReaders);
            }
        });
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
        return <p className="text-center mt-10 text-red-600">You are not authorized to view this page.</p>;
    }

    return (
        <>
            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
                <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-center text-text">
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
                                className={`text-sm text-center ${type === "success" ? "text-green-600" : "text-red-600"}`}
                            >
                                {message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full border border-dk-300  rounded-md">
                    <thead>
                        <tr className="bg-lg">
                            <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-text border-b border-dk -300">
                                Name
                            </th>
                            <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-text border-b border-dk-300">
                                Mac address
                            </th>
                            <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-text border-b border-dk-300">
                                Coordinates
                            </th>
                            <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-text border-b border-dk-300">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {readers.map((reader, index) => (
                            <tr key={reader.id || index} className="hover:bg-gray-50">
                                <td className="text-text px-4 py-2 text-sm border-b border-dk-300">
                                    {reader.name || "N/A"}
                                </td>
                                <td className="text-text px-4 py-2 text-sm border-b border-dk-300">
                                    {reader.macAddress || "N/A"}
                                </td>
                                <td className="text-text px-4 py-2 text-sm border-b border-dk-300">
                                    {reader.coordinates?.longitude + ", " + reader.coordinates?.latitude || "N/A"}
                                </td>
                                <td className="text-text px-4 py-2 text-sm border-b border-dk-300 space-x-2">
                                    <button
                                        onClick={() => handleDrive(reader)}
                                        className="bg-indigo-600 text-white py-1 px-3 rounded-md text-xs sm:text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                                    >
                                        Drive here
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedReader(reader);
                                            setIsUpdateModalOpen(true);
                                        }}
                                        className="bg-indigo-600 text-white py-1 px-3 rounded-md text-xs sm:text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                                    >
                                        Update Name
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
                    className="link-text hover:underline text-xs sm:text-sm"
                >
                    Add Location
                </button>
            </div>

            <CreateReaderComponent
                IsOpen={IsModalOpen}
                onClose={() => setIsModalOpen(false)}
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