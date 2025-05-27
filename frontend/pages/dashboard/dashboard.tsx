import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header";
import { Car, Grid, Reader, Route, StatusMessage } from "@/types";
import GridCreate from "@/components/grid/GridCreate";
import GridComponent from "@/components/grid/GridComponent";
import ReaderService from "@/services/ReaderService";
import { ReadersOverview } from "@/components/readers/ReadersOverview";
import CarService from "@/services/CarService";
import CarOverview from "@/components/cars/CarOverview";
import RouteService from "@/services/RouteService";
import RouteHistory from "@/components/routes/RouteHistory";
import Notification from "@/components/util/Notification";

const Dashboard: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string | null>(null);
    const [selectedReaderId, setSelectedReaderId] = useState<number | null>(null);
    const [grid, setGrid] = useState<Grid | null>(null);
    const [readers, setReaders] = useState<Reader[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [error, setError] = useState<string>("");
    const [notifications, setNotifications] = useState<StatusMessage[]>([]);

    useEffect(() => {
        console.log("Selected Reader ID:", selectedReaderId);
    }, [selectedReaderId]);

    const handleToggleComponent = (component: string) => {
        const newComponent = activeComponent === component ? null : component;
        setActiveComponent(newComponent);
    };

    const refreshReaders = () => {
        getReaders();
    };

    const pushNotification = (message: StatusMessage) => {
        setNotifications(prev => [...prev, message]);

        setTimeout(() => {
            setNotifications(prev => prev.slice(1));
        }, 4000);
    };

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
            } else {
                const readersData = await response.json();
                setReaders(readersData);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch readers');
        }
    };

    const getCars = async () => {
        setError('');
        try {
            const response = await CarService.getCars();
            if (!response.ok) {
                if (response.status === 401) {
                    setError('You are not authorized to view this page. Please login first.');
                } else {
                    setError(response.statusText);
                }
            } else {
                const carsData = await response.json();
                setCars(carsData);
                console.log(carsData);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch cars');
        }
    };

    const getRoutes = async () => {
        setError('');
        try {
            const response = await RouteService.getAllRoutes();
            if (!response.ok) {
                if (response.status === 401) {
                    setError('You are not authorized to view this page. Please login first.');
                } else {
                    setError(response.statusText);
                }
            } else {
                const routesData = await response.json();
                setRoutes(routesData);
                console.log(routesData);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch routes');
        }
    };

    useEffect(() => {
        getReaders();
        getCars();
        getRoutes();
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
                <Notification messages={notifications} />
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
                            selectedReaderId={selectedReaderId}
                            onClose={() => setActiveComponent(null)} refreshReaders={refreshReaders} pushNotification={pushNotification} />
                    )}

                    {activeComponent === "cars" && (
                        <CarOverview
                            cars={cars}
                            onClose={() => setActiveComponent(null)}
                        />
                    )}

                    {activeComponent === "routes" && (
                        <RouteHistory
                            routes={routes}
                            onClose={() => setActiveComponent(null)}
                        />
                    )}

                    {/* GridComponent in the center */}
                    <div
                        className={`flex-1 p-4 flex justify-center items-start transition-all duration-300 ${activeComponent === "gridCreate" ? "" : "w-full"
                            }`}
                    >
                        <div className="max-w-4xl w-full">
                            <GridComponent grid={grid} readers={readers} setSelectedReaderId={setSelectedReaderId} setActiveComponent={setActiveComponent} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;