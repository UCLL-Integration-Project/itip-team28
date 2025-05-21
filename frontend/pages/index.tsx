import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import ScansOverview from '@/components/ScansOverview';
import Header from '@/components/header';
import ScanService from '@/services/ScanService';
import { Scan } from '@/types';

const Home: React.FC = () => {
    const [scans, setScans] = useState<Scan[]>([]);
    
    const [error, setError] = useState<string | null>(null);

    const getAllScans = async () => {
        setError('');
        const responses = await Promise.all([
            ScanService.getScans()
        ]);

        const [ScanResponse] = responses;

        if (!ScanResponse.ok) {
            if (ScanResponse.status === 401) {
                setError(
                    'You are not authorized to view this page. Please login first.'
                );
            } else {
                setError(ScanResponse.statusText);
            }
        } else {
            const scans = await ScanResponse.json();
            setScans(scans);
        }
    };


    useEffect(() => {
        getAllScans();
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
                    {!error && <ScansOverview scans={scans} />}
                </section>
            </main>
        </>
    );
};

export default Home;
