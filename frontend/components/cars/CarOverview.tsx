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
    <div className="bg-comp rounded-lg shadow-md px-4 py-4 flex flex-col items-start gap-4 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-800/30 hover:shadow-lg relative">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-medium text-text hover:text-link-text transition-colors duration-300">
          Car Overview
        </h1>
        <button
          onClick={onClose}
          className="text-text hover:text-link-text rounded-full p-2 focus:outline-none transition-colors duration-200"
          aria-label="Close"
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

      <div className="flex flex-col gap-3 w-full">
        <div className="border border-gray-300 rounded-lg shadow-md px-4 py-4 flex flex-col gap-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 bg-table">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/images/car.jpg"
                alt="Car"
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <div className="text-lg font-medium text-gray-600 dark:text-gray-600">
                  {car.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-600">
                  ID: {car.id}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-600">
                  Weight: 1kg
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-600">
                  Stock:{' '}
                  {loading ? (
                    "Loading..."
                  ) : error ? (
                    <span className="text-red-600 dark:text-red-400">Error</span>
                  ) : stocks.length > 0 ? (
                    stocks.map((stock) => (
                      <span key={stock.id}>
                        {stock.quantity} {stock.item.name}
                        {stock !== stocks[stocks.length - 1] ? ', ' : ''}
                      </span>
                    ))
                  ) : (
                    "No stock"
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
            <button
              type="button"
              className="w-full bg-gray-300 border-1 border-gray-400 text-green py-1 px-3 mt-1 mb-1 rounded-sm text-xs font-light hover:bg-gray-700 dark:hover:bg-gray-200 focus:outline-none focus:ring-2  transition-colors duration-200 cursor-pointer"
            >
              Park
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarOverview;
