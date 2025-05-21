import React, { useEffect, useState } from 'react';
import CarOverview from '@/components/CarOverview';
import { Car } from '@/types';
import CarService from '@/services/CarService';
import Header from '@/components/header';

const CarNavigationPage: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [error, setError] = useState<string | null>(null);

    const getCars = async () => {
        setError('');
        const responses = await Promise.all([
            CarService.getCars()
        ]);

        const [CarResponse] = responses;

        if (!CarResponse.ok) {
            if (CarResponse.status === 401) {
                setError(
                    'You are not authorized to view this page. Please login first.'
                );
            } else {
                setError(CarResponse.statusText);
            }
        } else {
            const cars = await CarResponse.json();
            setCars(cars);
        }
    };

    useEffect(() => {
        getCars();
    }, []);

    return (
        <>
            <Header />
            <div>
                <h1>Navigation</h1>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <CarOverview cars={cars} />
            </div>
        </>
    );
};

export default CarNavigationPage;