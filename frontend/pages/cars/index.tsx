import React, { useEffect, useState } from 'react';
import CarOverview from '@/components/cars/CarOverview';
import { Car } from '@/types';
import CarService from '@/services/CarService';
import Header from '@/components/header';
import Head from 'next/head';

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
            <Head>
                <title>Home</title>
                <meta name="description" content="Car app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="assets/logo.png" />
            </Head>
            <Header />

            <main className="flex flex-col items-center justify-center min-h-screen">
                <section>
                    {error && <div className="text-red-500">{error}</div>}
                    <CarOverview cars={cars} />
                </section>
            </main>
        </>
    );
};

export default CarNavigationPage;