import { Car } from '@/types';
import React from 'react';

export interface CarOverviewProps {
    cars: Car[];
}

const CarOverview: React.FC<CarOverviewProps> = ({ cars }) => {
    const car = cars[0];
    if (!car) return null;

    return (
        <div className="rounded-md bg-gray-200 p-8 max-w-[340px] my-4 flex flex-col items-start gap-4">
            {/* Close button */}
            <div className='flex items-center justify-between w-full'>
                <div className='flex items-center gap-4'>
                    <h2 className="font-semibold text-2xl text-[#2a2a2a]">{car.name}</h2>
                    
                    <div className="text-gray-500 text-sm">
                        <strong>ID:</strong> {car.id}
                    </div>
                </div>
                <button
                    type="button"
                    className=" text-gray-800 hover:text-gray-700 rounded-full p-3 bg-white cursor-pointer focus:outline-none"
                    aria-label="Close"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className='p-4 bg-white rounded-xl shadow-md'>
                <span className='p-1 text-sm text-gray-900 bg-gray-200 rounded-sm'>1kg</span>
                <img
                    src="/images/car.jpeg"
                    alt="Car"
                    className="w-full mt-4 h-40 object-cover rounded-xl"
                />
                </div>
                <button type='button' className='p-4 w-full cursor-pointer text-center bg-white rounded-xl shadow-md'>
                Park
                </button>
        </div>
    );
};

export default CarOverview;
