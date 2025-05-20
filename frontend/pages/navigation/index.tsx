import Header from "@/components/header";
import NavigationComponent from "@/components/NavigationComponent";
import ReaderService from "@/services/ReaderService";
import { Reader } from "@/types";
import { useEffect, useState } from "react";

const Navigation: React.FC = () => {
    const [readers, setReaders] = useState<Array<Reader>>([]);
    const [error, setError] = useState<string>("");
    const [selectReader, setSelectReader] = useState<Reader | null>(null);

    const getReaders = async () => {
        setError("");
        const response = await ReaderService.getReaders();

        if (!response.ok) {
            if (response.status === 401) {
                setError(
                    "You are not authorized to view this page. Please login first."
                );
            } else {
                setError(response.statusText);
            }
        } else {
            const readers = await response.json();
            setReaders(readers);
        }
    };

    useEffect(() => {
        getReaders();
    }, []);

    const handleSelectReader = (reader: Reader) => {
        setSelectReader(reader);
    };

    return(
        <>
            <head>
                <title>Readers</title>
            </head>
            <Header />
            <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <section className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
                    <NavigationComponent readers={readers} selectReader={handleSelectReader}/>
                </section>
            </main>
        </>
    )
}
export default Navigation;