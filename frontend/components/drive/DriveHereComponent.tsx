import { Car, Reader, StatusMessage } from "@/types";
import { useState } from "react";
import StockModal from "../StockModal";
import StockService from "@/services/StockService";

type Props = {
    readers: Array<Reader>;
    reader: Reader;
    selectReader: (reader: Reader) => void;
    setNewStatusMessages?: (message: StatusMessage) => void;
    refreshReaders: () => void;
}

const DriveHereComponent: React.FC<Props> = ({ readers, reader, selectReader, setNewStatusMessages, refreshReaders }) => {
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
            {isStockModalOpen && (
                <StockModal
                    isOpen={isStockModalOpen}
                    onClose={() => setIsStockModalOpen(false)}
                    onSubmit={async ({ readerId, itemId, stock, type }) => {
                        try {
                            const direction = type === 'delivery' ? 'DELIVERY' : 'PICKUP';

                            const requestId = await StockService.requestStockTransfer(1, Number(readerId), itemId, stock, direction);
                            await StockService.completeStockTransfer(requestId); // ✅ Apply the stock change now
                            refreshReaders();

                            setStatusMessages([{ message: 'Stock updated and car dispatched!', type: 'success' }]);
                        } catch (err: any) {
                            console.error(err);
                            setStatusMessages([{ message: err.message, type: 'error' }]);
                        } finally {
                            setIsStockModalOpen(false);
                        }
                    }}
                />
            )}
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