import React from "react";
import { Reader } from "../../types";

interface ReadersOverviewProps {
    readers: Reader[];
}

const shelfIcon = (
    <img src="../images/shelves.png" alt="" className="w-8 h-8"/>
);

export const ReadersOverview: React.FC<ReadersOverviewProps> = ({ readers }) => {
    return (
        <div className="flex flex-col gap-6 py-8 px-4 rounded-sm bg-comp sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-text mb-10 text-center">Readers overview</h1>
            <div className="flex flex-col gap-6">  
                {readers.map((reader) => (
                    <div
                        key={reader.id}
                        className="bg-white rounded-lg shadow-md px-6 py-5 flex items-center justify-between min-w-[400px] max-w-[600px] mx-auto duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 ">{shelfIcon}</div>
                            <div>
                                <div className="text-lg font-medium">{reader.name}</div>
                                <div className="text-sm text-gray-600">
                                    MAC: {reader.macAddress}
                                </div>
                            </div>
                        </div>
                        <div className="gap-2 text-sm text-gray-600 flex flex-col">
                            <p className="px-2 py-1 bg-green-200 rounded-sm border-green-400 border-1 text-green-800 shadow-sm">X:{reader.coordinates?.longitude}</p>
                            <p className="px-2 py-1 bg-purple-200 rounded-sm border-purple-400 border-1 text-purple-800 shadow-sm">Y:{reader.coordinates?.latitude}</p>
                        </div>
                    </div>
                ))}
            </div>  
        </div>
    );
};
