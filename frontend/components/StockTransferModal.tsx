import StockService from "@/services/StockService";
import { Reader, StatusMessage } from "@/types";
import React, { useEffect, useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    reader: Reader;
    carId: number;
    setStatusMessages: (messages: StatusMessage[]) => void;
};

const StockTransferModal: React.FC<Props> = ({ isOpen, onClose, reader, carId, setStatusMessages }) => {
    const [readerStock, setReaderStock] = useState<Stock[]>([]);
    const [carStock, setCarStock] = useState<Stock[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [direction, setDirection] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (isOpen && reader.id) {
            const fetchStocks = async () => {
                try{
                    const readerResponse = await StockService.getStockForReader(reader.id);
                    if (!readerResponse.ok) {
                        throw new Error('Failed to fetch reader stock');
                    }
                    const readerStockData = await readerResponse.json();
                    setReaderStock(readerStockData);

                    const carResponse = await StockService.getStockForCar(carId);
                    if (!carResponse.ok) {
                        throw new Error('Failed to fetch car stock');
                    }
                    const carStockData = await carResponse.json();
                    setCarStock(carStockData);
                } catch (err: any) {
                    setError(err.message || 'Failed to fetch stock data');
                }
            }
            fetchStocks();
        }
    }, [isOpen, reader.id, carId]);


    const validate = (): boolean => {
        let result = true;
        setError("");

        if (!selectedItemId) {
            setError("Please select an item to transfer.");
            result = false;
        }

        if (quantity <= 0) {
            setError("Quantity must be greater than 0.");
            result = false;
        }

        return result;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try{
            const response = await StockService.requestStockTransfer(
                carId,
                reader.id,
                selectedItemId,
                quantity,
                direction
            );

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Failed to request stock transfer');
            }

            setStatusMessages([
                {message: `Stock ${direction.toLowerCase()} request created successfully`, type: "success" },
            ])
        }
   
    }
)