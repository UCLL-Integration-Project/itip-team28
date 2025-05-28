import React, { useState, useEffect } from 'react';
import ReaderService from '@/services/ReaderService';
import { Reader } from '@/types';

interface StockModalProps {
    reader: Reader,
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        readerId: string;
        stock: number;
        type: 'delivery' | 'pick-up';
        itemId: number;
    }) => void;
    onRouteStart: () => void;
}

const StockModal: React.FC<StockModalProps> = ({ reader, isOpen, onClose, onSubmit, onRouteStart }) => {
    const [readers, setReaders] = useState<Reader[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<number | undefined>(undefined);
    const [stock, setStock] = useState<number>(0);
    const [type, setType] = useState<'delivery' | 'pick-up'>('delivery');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchReaders = async () => {
            try {
                const response = await ReaderService.getReaders();
                const data = await response.json();
                setReaders(data);
            } catch (error) {
                console.error('Failed to fetch readers:', error);
            }
        };

        if (isOpen) {
            fetchReaders();
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (selectedItemId === undefined) {
            setError('Please select an item.');
            return;
        }

        if (stock <= 0) {
            setError('Stock must be a positive number.');
            return;
        }

        onRouteStart()

        if (reader) {
            onSubmit({
                readerId: reader.id?.toString() ? reader.id?.toString() : '0',
                stock,
                type,
                itemId: selectedItemId,
            });

            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xs bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-comp rounded-lg shadow-lg w-full max-w-md p-6 transition-all duration-300 hover:shadow-xl">
                <h3 className="text-lg font-bold text-text mb-4">Stock Modal</h3>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 text-red-500 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-base font-medium text-text mb-1">
                            Reader: {reader.name}
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-base font-medium text-text mb-1">
                            Item:
                        </label>
                        <select
                            className="bg-comp w-full border border-dk rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-link-text text-text"
                            value={selectedItemId ?? ''}
                            onChange={(e) => setSelectedItemId(Number(e.target.value))}
                        >
                            <option className='bg-comp text-text' value="" disabled>Select an item</option>
                            {reader.stocks?.map((stock) =>
                                stock.item?.id !== undefined ? (
                                    <option key={stock.item.id} value={stock.item.id}>
                                        {stock.item.name}
                                    </option>
                                ) : null
                            )}
                        </select>
                    </div>


                    <div className="mb-4">
                        <label className="block text-base font-medium text-text mb-1">
                            Stock:
                        </label>
                        <input
                            type="number"
                            className="w-full border border-dk rounded-md p-2 bg-background focus:outline-none focus:ring-2 focus:ring-link-text text-text"
                            value={stock}
                            onChange={(e) => setStock(Number(e.target.value))}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-base font-medium text-text mb-1">
                            Type:
                        </label>
                        <select
                            className="w-full border border-dk rounded-md p-2 bg-background focus:outline-none focus:ring-2 focus:ring-link-text text-text"
                            value={type}
                            onChange={(e) => setType(e.target.value as 'delivery' | 'pick-up')}
                        >
                            <option value="delivery">Delivery</option>
                            <option value="pick-up">Pick-up</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            id='submitButton'
                            type="submit"
                            className="bg-button text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-link-text transition-colors duration-200"
                        >
                            Submit
                        </button>
                        <button
                            id='closeButton'
                            type="button"
                            className="bg-button text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-link-text transition-colors duration-200"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockModal;
