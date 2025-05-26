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
                className="bg-button text-white py-2 px-5 rounded-lg text-base font-medium hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
                Drive here
            </button>
        </>
    )
}

export default DriveHereComponent