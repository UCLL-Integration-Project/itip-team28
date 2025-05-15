import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from '@styles/home.module.css';
import ScansOverview from '@/components/ScansOverview';
import Header from '@/components/header';
import { fetchScans } from '@/services/carsApi';

const Home: React.FC = () => {
    const [scans, setScans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    fetch("http://localhost:3000/scans")

    useEffect(() => {
        const loadScans = async () => {
            try {
                const data = await fetchScans();
                setScans(data);
            } catch (err) {
                setError('Failed to load scan');
            } finally {
                setLoading(false);
            }
        };
        loadScans();
    }, []);

    return (
        <>
            <Head>
                <title>Home</title>
                <meta name="description" content="BowlBuddies Pokebowl app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="assets/logo.png" />
            </Head>
            <Header />

            <main className="flex flex-col items-center justify-center min-h-screen">
                <section>
                    {loading && <div>Loading...</div>}
                    {error && <div className="text-red-500">{error}</div>}
                    {!loading && !error && <ScansOverview scans={scans} />}
                </section>
            </main>
        </>
    );
};

export default Home;
