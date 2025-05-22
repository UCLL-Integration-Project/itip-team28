import React from "react";
import { Reader } from "../../types";

interface ReadersOverviewProps {
    readers: Reader[];
}

const shelfIcon = (
    <img src="../images/shelves.png" alt="" />
);

export const ReadersOverview: React.FC<ReadersOverviewProps> = ({ readers }) => {
    return (
        <div className="flex flex-col gap-6 py-8 px-6 rounded-sm bg-lg">
            <h1 className="text-2xl font-semibold text-text">Readers overview</h1>
            {readers.map((reader) => (
                <div
                    key={reader.id}
                    className="border-1 border-gray-500 rounded-sm px-6 py-4 flex items-start justify-between min-w-[400px] max-w-[600px] bg-white"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 ">{shelfIcon}</div>
                        <div>
                            <div className="text-lg font-medium">{reader.name}</div>
                            <div className="text-sm text-gray-600">
                                MAC: {reader.macAddress}
                            </div>
                        </div>
                    </div>
                    <div className="gap-2 text-sm text-gray-600 flex    flex-col">
                        <p className="px-1 bg-green-200 rounded-sm border-green-400 border-1 text-green-800">X:{reader.coordinates?.longitude}</p>
                        <p className="px-1 bg-purple-200 rounded-sm border-purple-400 border-1 text-purple-800">Y:{reader.coordinates?.latitude}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
