import GridComponent from "@/components/GridComponent"
import GridCreate from "@/components/GridCreate";
import Header from "@/components/header"
import { ReadersOverview } from "@/components/readers/ReadersOverview";
import ReaderService from "@/services/ReaderService";
import { Grid, Reader } from "@/types";
import { useEffect, useState } from "react";

const Route: React.FC = () => {

    const [readers, setReaders] = useState<Array<Reader>>([]);
    const [error, setError] = useState<string>("");
    const [selectReader, setSelectReader] = useState<Reader | null>(null);
    const [grid, setGrid] = useState<Grid | null>(null);


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
    }, []);

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
  <section className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-md overflow-hidden">
    <div className="flex gap-6 h-[600px]">
      
      <div> <GridCreate onGridCreated={setGrid} /></div>
      <div className="flex-[3] h-full overflow-hidden rounded-lg">
        <GridComponent grid={grid}/>
      </div>
      
      
      <div className="flex-[1] h-full overflow-y-auto rounded-lg border border-gray-200 p-4 bg-gray-50">
        {!error && <ReadersOverview readers={readers} />}
      </div>
    </div>
  </section>
</main>


        </>
    )
}

export default Route