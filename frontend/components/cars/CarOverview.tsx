import CarService from '@/services/CarService';
import { Car, Stock } from '@/types';
import React, { useEffect, useState } from 'react';

export interface CarOverviewProps {
    cars: Car[];
    onClose: () => void;
}

const CarOverview: React.FC<CarOverviewProps> = ({ cars, onClose }) => {
    const car = cars[0];
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (car && car.id !== undefined) {
            const fetchStocks = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await CarService.getCarStocks(car.id!);
                    if (!response.ok) {
                        throw new Error("Failed to fetch car stocks");
                    }
                    const data: Stock[] = await response.json();
                    setStocks(data);
                } catch (err: any) {
                    setError(err.message || 'Failed to fetch car stocks');
                } finally {
                    setLoading(false);
                };
            };
            fetchStocks();
        }
    }, [car]);
    
    if (!car) return null;

    return (
        <div className="bg-comp rounded-lg shadow-md px-4 py-4 flex flex-col items-start gap-4 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:shadow-lg">
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-text hover:text-link-text transition-colors duration-300">
                {car.name}
            </h2>
            <div className="text-base text-gray-500 dark:text-gray-400">
                <strong>ID:</strong> {car.id}
            </div>
            </div>
            <button
            type="button"
            className="text-text hover:text-link-text rounded-full p-2 focus:outline-none transition-colors duration-200"
            aria-label="Close"
            onClick={onClose}
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
        </div>
      <div className="p-4 bg-background rounded-xl shadow-md w-full">
        <div className="flex items-center gap-2">
            <span className="inline-block px-2 py-1 text-xs text-gray-900 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-sm">
                1kg
            </span>
            {loading ? (
                <span className="inline-block px-2 py-1 text-xs text-gray-900 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-sm">
                Loading...
                </span>
            ) : error ? (
                <span className="inline-block px-2 py-1 text-xs text-red-600 dark:text-red-400 bg-gray-200 dark:bg-gray-700 rounded-sm">
                Error
                </span>
            ) : stocks.length > 0 ? (
                stocks.map((stock) => (
                    <span
                        key={stock.id}
                        className="inline-block px-2 py-1 text-xs text-gray-900 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-sm"
                    >
                        {stock.quantity} {stock.item.name}
                    </span>
                ))
            ) : (
                <span className="inline-block px-2 py-1 text-xs text-gray-900 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-sm">
                No stock
                </span>
            )}
        </div>
        <img
          src="/images/car.jpg"
          alt="Car"
          className="w-full mt-4 h-32 object-cover rounded-xl"
        />
      </div>
        <button
            type="button"
            className="w-full bg-gray-300 border-1 border-gray-400 text-green py-1 px-3 mt-1 mb-1 rounded-sm text-xs font-light hover:bg-gray-700 dark:hover:bg-gray-200 focus:outline-none focus:ring-2  transition-colors duration-200 cursor-pointer"
        >
            Park
        </button>
        </div>
    );
};

export default CarOverview;
