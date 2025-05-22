import React from "react";
import { Reader } from "../../types";

interface ReadersOverviewProps {
  readers: Reader[];
}

const shelfIcon = <img src="../images/shelves.png" alt="Shelf icon" className="w-6 h-6 object-contain" />;

export const ReadersOverview: React.FC<ReadersOverviewProps> = ({ readers }) => {
  return (
    <div className="flex flex-col gap-4 py-4 px-3 rounded-md bg-gray-100 h-full w-full overflow-y-auto">
      <h1 className="text-xl font-semibold">Readers Overview</h1>
      
      {readers.map((reader) => (
        <div
          key={reader.id}
          className="border border-gray-300 rounded-md p-3 flex items-start justify-between bg-white shadow-sm w-full"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0">{shelfIcon}</div>
            <div className="text-sm">
              <div className="font-medium text-gray-800 break-words">{reader.name}</div>
              <div className="text-xs text-gray-600 break-all">MAC: {reader.macAddress}</div>
            </div>
          </div>

          <div className="text-xs text-right flex flex-col gap-1 shrink-0">
            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded border border-green-300 whitespace-nowrap">
              X: {reader.coordinates?.longitude}
            </span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded border border-purple-300 whitespace-nowrap">
              Y: {reader.coordinates?.latitude}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
