import React, { useState, useEffect } from 'react';
import ReaderService from '@/services/ReaderService';
import { Reader } from '@/types';

interface StockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        macAddress: string;
        stock: number;
        type: 'delivery' | 'pick-up';
    }) => void;
}

const StockModal: React.FC<StockModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [readers, setReaders] = useState<Reader[]>([]);
    const [selectedReader, setSelectedReader] = useState<string>('');
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

        if (!selectedReader) {
            setError('Please select a reader.');
            return;
        }

        if (stock <= 0) {
            setError('Stock must be a positive number.');
            return;
        }

        console.log("Submitting data:", {
                macAddress: selectedReader,
                stock,
                type,
            })

        if (selectedReader) {
            onSubmit({
                macAddress: selectedReader,
                stock,
                type,
            });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
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
                            Reader:
                        </label>
                        <select
                            className="w-full border border-dk rounded-md p-2 bg-background focus:outline-none focus:ring-2 focus:ring-link-text text-text"
                            value={selectedReader}
                            onChange={(e) => setSelectedReader(e.target.value)}
                        >
                            <option value="" disabled>Select a reader</option>
                            {readers.map((reader) => (
                                <option key={reader.macAddress} value={reader.macAddress}>
                                    {reader.name} ({reader.coordinates?.longitude}, {reader.coordinates?.latitude})
                                </option>
                            ))}
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
                            type="submit"
                            className="bg-button text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-link-text transition-colors duration-200"
                        >
                            Submit
                        </button>
                        <button
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
