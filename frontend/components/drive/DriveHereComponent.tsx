import { Car, Reader, StatusMessage } from "@/types";
import { useState } from "react";
import StockModal from "../StockModal";

type Props = {
    readers: Array<Reader>;
    reader: Reader;
    selectReader: (reader: Reader) => void;
    setNewStatusMessages?: (message: StatusMessage) => void;
}

const DriveHereComponent: React.FC<Props> = ({ readers, reader, selectReader, setNewStatusMessages }) => {
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [StatusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

    const handleDrive = async (destination: Reader) => {
        console.log("CLICK");
        setStatusMessages([]);
        setIsStockModalOpen(true);
        try {
            setStatusMessages([{ message: "Route created successfully", type: "success" }]);
            setNewStatusMessages?.({ message: "Route created successfully", type: "success" });
            selectReader(destination);
        } catch (err) {
            setStatusMessages([{ message: "Failed to create route", type: "error" }]);
        }
    };


    return (
        <>
            {
                isStockModalOpen && (
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
                            setNewStatusMessages?.({ message: "The car is on its way!", type: "success" });
                        }}
                    />  
                )
            }
            <button
                onClick={() => handleDrive(reader)}
                className="w-full bg-gray-300 border-1 border-gray-400 text-green py-1 px-3 mt-1 mb-1 rounded-sm text-xs font-light hover:bg-gray-700 dark:hover:bg-gray-200 focus:outline-none focus:ring-2  transition-colors duration-200 cursor-pointer"
            >
                Drive here
            </button>
        </>
    )
}

export default DriveHereComponent