import CarsOverview from '@/components/CarsOverview';
import { fetchCars } from '@/services/carsApi';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCars = async () => {
            try {
                const data = await fetchCars();
                setCars(data);
            } catch (err) {
                setError('Failed to load cars');
            } finally {
                setLoading(false);
            }
        };
        loadCars();
    }, []);

    return (
        <>
            <Head>
                <title>Home</title>
                <meta name="description" content="BowlBuddies Pokebowl app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="assets/logo.png" />
            </Head>

            <main className="flex flex-col items-center justify-center min-h-screen">
                <section>
                    {loading && <div>Loading...</div>}
                    {error && <div className="text-red-500">{error}</div>}
                    {!loading && !error && <CarsOverview cars={cars} />}
                </section>
            </main>
        </>
    );
};

export default Home;
