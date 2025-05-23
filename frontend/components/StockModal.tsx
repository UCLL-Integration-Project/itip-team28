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
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">Stock Modal</h2>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reader:
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock:
                        </label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={stock}
                            onChange={(e) => setStock(Number(e.target.value))}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type:
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
