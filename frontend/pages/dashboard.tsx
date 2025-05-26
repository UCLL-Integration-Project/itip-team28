import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/header";
import { Grid, Reader } from "@/types";
import GridCreate from "@/components/grid/GridCreate";
import GridComponent from "@/components/grid/GridComponent";
import ReaderService from "@/services/ReaderService";
import { ReadersOverview } from "@/components/readers/ReadersOverview";

const Dashboard: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string | null>(null);
    const [grid, setGrid] = useState<Grid | null>(null);
    const [readers, setReaders] = useState<Reader[]>([]); 
    const [error, setError] = useState<string>("");

    const getReaders = async () => {
        setError('');
        try {
            const response = await ReaderService.getReaders();
            if (!response.ok) {
                if (response.status === 401) {
                    setError('You are not authorized to view this page. Please login first.');
                } else {
                    setError(response.statusText);
                }
            } else{
                const readersData = await response.json();
                setReaders(readersData);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch readers');
        }
    };

    useEffect(() => {
        getReaders();
    }, []);

    const handleToggle = (component: string | null) => {
        setActiveComponent(component);
    };

    const handleGridCreated = (newGrid: Grid) => {
        setGrid(newGrid);
        setActiveComponent(null);
    };

return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar onToggle={handleToggle} />
        <div className="flex-1 flex">

            {/* Left panel for GridCreate */}
            {activeComponent === "gridCreate" && (
                <div className="w-1/3 p-4">
                    <GridCreate
                        onGridCreated={handleGridCreated}
                        onClose={() => setActiveComponent(null)}
                    />
                </div>
            )}

            {activeComponent === "readers" && (
                <ReadersOverview
                readers={readers}
                onClose={() => setActiveComponent(null)}
            />
            )}

            {/* GridComponent in the center */}
            <div
                className={`flex-1 p-4 flex justify-center items-start transition-all duration-300 ${
                    activeComponent === "gridCreate" ? "" : "w-full"
                }`}           
            >
                <div className="max-w-4xl w-full">
                    <GridComponent grid={grid} readers={readers}/>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;