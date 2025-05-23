import { Car } from '@/types';
import React from 'react';

export interface CarOverviewProps {
    cars: Car[];
}

const CarOverview: React.FC<CarOverviewProps> = ({ cars }) => {
    const car = cars[0];
    if (!car) return null;

    return (
        <div className="bg-comp rounded-lg shadow-md px-4 py-4 flex flex-col items-start gap-4 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:shadow-lg">
            {/* Close button */}
            <div className='flex items-center justify-between w-full'>
                <div className='flex items-center gap-3'>
                    <h2 className="text-lg font-medium text-text hover:text-link-text transition-colors duration-300">{car.name}</h2>

                    <div className="text-base text-gray-500 dark:text-gray-400">
                        <strong>ID:</strong> {car.id}
                    </div>
                </div>
                <button
                    type="button"
                    className="text-text hover:text-link-text rounded-full p-2 focus:outline-none transition-colors duration-200"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className='p-4 bg-background rounded-xl shadow-md'>
                <span className='inline-block px-2 py-1 text-sm text-gray-900 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-sm'>1kg</span>
                <img
                    src="/images/car.jpeg"
                    alt="Car"
                    className="w-full mt-4 h-32 object-cover rounded-xl"
                />
            </div>
            <button type='button' className='bg-button text-white py-2 px-5 rounded-lg text-base font-medium hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 w-full text-center'>
                Park
            </button>
        </div>
    );
};

export default CarOverview;
