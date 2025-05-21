import { Scan } from "@/types";
import React from "react";


type Props = {
    scans: Array<Scan>;
};

const ScansOverview: React.FC<Props> = ({ scans }: Props) => (
    <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 font-semibold text-gray-800">Overview</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Scan ID</th>
                        <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Car ID</th>
                        <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Reader ID</th>
                        <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {scans.map((scan) => (
                        <tr key={scan.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-600">{scan.id}</td>
                            <td className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-600">{scan.car?.id}</td>
                            <td className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-600">{scan.reader?.id}</td>
                            <td className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-600">{scan.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default ScansOverview;
