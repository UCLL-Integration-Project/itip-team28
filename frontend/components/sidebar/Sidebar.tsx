import { useState } from "react";

interface SidebarProps {
    onToggle: (component: string | null) => void;
};

const Sidebar: React.FC<SidebarProps> = ({onToggle}) => {
    const [activeComponent, setActiveComponent] = useState<string | null>(null);

    const toggleComponent = (component: string) => {
        const newComponent = activeComponent === component ? null : component;
        setActiveComponent(newComponent);
        onToggle(newComponent);
    };

    return (
        <div className="w-16 bg-gray-800 text-white flex flex-col items-center py-4 space-y-4 h-full min-h-screen">
            {/* Grid create button  */}
            <button
                onClick={() => toggleComponent("gridCreate")}
                className={`p-2 rounded transition-colors duration-200 ${
                    activeComponent === "gridCreate" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                title="Create Grid"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
            </button>

            {/* Readers Overview button  */}
            <button
                onClick={() => toggleComponent("readers")}
                className={`p-2 rounded transition-colors duration-200 ${
                    activeComponent === "readers" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                title="Readers Overview"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                    </svg>
            </button>

            {/* Car Overview button  */}
            <button
                onClick={() => toggleComponent("cars")}
                className={`p-2 rounded transition-colors duration-200 ${
                    activeComponent === "cars" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                title="Car Overview"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                    />
                </svg>
            </button>

            {/* Route History button  */}
            <button
                onClick={() => toggleComponent("routes")}
                className={`p-2 rounded transition-colors duration-200 ${
                    activeComponent === "routes" ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                title="Route History"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                    />
                </svg>
            </button>
        </div>
    )
}

export default Sidebar;