import { Reader, StatusMessage } from "@/types";
import { useState } from "react";
import StockModal from "../stock/StockModal";
import StockService from "@/services/StockService";

type Props = {
    reader: Reader;
    selectReader: (reader: Reader) => void;
    setNewStatusMessages?: (message: StatusMessage) => void;
    refreshReaders: () => void;
    onRouteStart: () => void;
    pushNotification?: (message: StatusMessage) => void;
    setStartMoving: (val: boolean) => void;
}

const DriveHereComponent: React.FC<Props> = ({ reader, selectReader, setNewStatusMessages, refreshReaders, onRouteStart, pushNotification, setStartMoving }) => {
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [StatusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

    const handleDrive = async (destination: Reader) => {
        setStatusMessages([]);
        setIsStockModalOpen(true);
        if (document.getElementById('submitButton')) {
            try {
                setStatusMessages([{ message: "Route created successfully", type: "success" }]);
                setNewStatusMessages?.({ message: "Route created successfully", type: "success" });
                selectReader(destination);


            } catch (err) {
                setStatusMessages([{ message: "Failed to create route", type: "error" }]);
            }
        }
    };


    return (
        <>
            {isStockModalOpen && (
                <StockModal
                    reader={reader}
                    isOpen={isStockModalOpen}
                    onClose={() => setIsStockModalOpen(false)}
                    onRouteStart={onRouteStart}
                    onSubmit={async ({ readerId, itemId, stock, type }) => {
                        try {
                            const direction = type === 'delivery' ? 'DELIVERY' : 'PICKUP';
                            console.log(pushNotification);

                            const requestId = await StockService.requestStockTransfer(1, Number(readerId), itemId, stock, direction);
                            pushNotification?.({ message: 'Stock transfer request complete.', type: 'success' });
                            setStartMoving(true);

                            await new Promise(resolve => setTimeout(resolve, 1000));
                            await StockService.completeStockTransfer(requestId);
                            const push = pushNotification?.({ message: 'Stock transfer completed successfully.', type: 'success' });
                            console.log(push);

                            refreshReaders();
                        } catch (err: any) {
                            const errorJson = JSON.parse(err.message.replace(/^Error:\s*/, ''));
                            const readableMessage = errorJson.ServiceException || 'Something went wrong';

                            pushNotification?.({ message: readableMessage, type: 'error' });
                        } finally {
                            setIsStockModalOpen(false);
                        }
                    }}
                />
            )}
            <button
                onClick={() => handleDrive(reader)}
                className="w-full bg-gray-300 border-1 border-gray-400 text-green py-1 px-3 mt-1 mb-1 rounded-sm text-xs font-light hover:bg-gray-400  focus:outline-none focus:ring-2  transition-colors duration-200 cursor-pointer"
            >
                Drive here
            </button>
        </>
    )
}

export default DriveHereComponent