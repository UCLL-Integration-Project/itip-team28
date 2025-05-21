import GridComponent from "@/components/GridComponent"
import Header from "@/components/header"
import ReaderService from "@/services/ReaderService";
import { Reader } from "@/types";
import { useEffect, useState } from "react";

const Route: React.FC = () => {

    const [readers, setReaders] = useState<Array<Reader>>([]);
    const [error, setError] = useState<string>("");
    const [selectReader, setSelectReader] = useState<Reader | null>(null);

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
            console.log(readers);
        }
    };

    useEffect(() => {
        getReaders();
    }, [readers]);

    const handleSelectReader = (reader: Reader) => {
        setSelectReader(reader);
    };

    return (
        <>
            <head>
                <title>Route</title>
            </head>
            <Header />
            <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <section className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
                    <GridComponent readers={readers} />
                </section>
            </main>
        </>
    )
}

export default Route