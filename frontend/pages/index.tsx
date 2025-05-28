import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import ScansOverview from '@/components/scans/ScansOverview';
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
            } else if (ScanResponse.status === 500) {
                setError(
                    'Backend error'
                );
            } else {
                const result = await ScanResponse.json();
                setError(result.ServiceException);
            }
        } else {
            const text = await ScanResponse.text();

            if (!text) {
                setError("Database error: could not fetch data");
            } else {
                try {
                    const scans = JSON.parse(text);
                    setScans(scans);
                    console.log(scans);
                } catch (e) {
                    console.error("Failed to parse JSON", e);
                    setError("Received invalid JSON data from server");
                }
            }
        }
    };


    useEffect(() => {
        getAllScans()
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
            <main className="bg-background text-text flex flex-col items-center justify-center min-h-screen">
                <section>
                    {error && <div className="text-red-500">{error}</div>}
                    {!error && <ScansOverview scans={scans} />}
                </section>
            </main>
        </>
    );
};

export default Home;
