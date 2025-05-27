import CarOverview from "@/components/cars/CarOverview";
import Header from "@/components/header";
import NavigationComponent from "@/components/navigation/NavigationComponent";
import { ReadersOverview } from "@/components/readers/ReadersOverview";
import CarService from "@/services/CarService";
import ReaderService from "@/services/ReaderService";
import { Car, Reader, StatusMessage } from "@/types";
import { read } from "fs";
import { get } from "http";
import { useEffect, useState } from "react";
import Notification from "@/components/util/Notification";

const Navigation: React.FC = () => {
    const [readers, setReaders] = useState<Array<Reader>>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [error, setError] = useState<string>("");
    const [SelectReader, setSelectReader] = useState<Reader | null>(null);
    const [status, setStatus] = useState<'started' | 'ended' | null>(null);
    const [notifications, setNotifications] = useState<StatusMessage[]>([]);

    const handleStart = () => {
        setStatus('started');
    };

    const pushNotification = (message: StatusMessage) => {
        setNotifications(prev => [...prev, message]);

        setTimeout(() => {
            setNotifications(prev => prev.slice(1));
        }, 4000);
    };


    const refreshReaders = () => {
        getReaders();
    };

    const getReaders = async () => {
        setError('');
        const responses = await Promise.all([
            ReaderService.getReaders()
        ]);

        const [ReaderResponse] = responses;

        if (!ReaderResponse.ok) {
            if (ReaderResponse.status === 401) {
                setError(
                    'You are not authorized to view this page. Please login first.'
                );
            } else {
                setError(ReaderResponse.statusText);
            }
        } else {
            const readers = await ReaderResponse.json();
            setReaders(readers);
            updateReaders = !updateReaders ;
        }
    };
    

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

    let updateReaders = false;

    useEffect(() => {
        getCars();
        getReaders();
    }, []);

    const handleSelectReader = (reader: Reader) => {
        setSelectReader(reader);
    };

    return (
        <>
            <head>
                <title>Readers</title>
            </head>
            <Header />
            <main className="bg-background min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8 py-10">
                {!error && <CarOverview cars={cars} />}
                <section className="bg-comp w-full max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-10">
                    {error && <div className="text-red-500 dark:text-red-400 text-lg font-medium text-center">{error}</div>}
                    {!error && <NavigationComponent readers={readers} selectReader={handleSelectReader} refreshReaders={refreshReaders} onRouteStart={handleStart} pushNotification={pushNotification} />}
                </section>
                {!error && <ReadersOverview readers={readers} />}
                <Notification messages={notifications} />
            </main>
        </>
    )
}
export default Navigation;