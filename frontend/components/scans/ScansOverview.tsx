import { Scan } from "@/types";
import React from "react";


type Props = {
    scans: Array<Scan>;
};

const ScansOverview: React.FC<Props> = ({ scans }: Props) => (
    <div className="p-4 sm:p-6">
        <h2 className="text-text text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 font-semibold text-gray-800">Overview</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-text-300">
                <thead>
                    <tr className="bg-text-100">
                        <th className="border border-text-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-text-700">Scan ID</th>
                        <th className="border border-text-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-text-700">Car ID</th>
                        <th className="border border-text-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-text-700">Reader ID</th>
                        <th className="border border-text-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-text-700">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {scans.map((scan) => (
                        <tr key={scan.id} className="hover:bg-text-50">
                            <td className="text-text border border-text-300 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-600">{scan.id}</td>
                            <td className="text-text border border-text-300 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-600">{scan.car?.id}</td>
                            <td className="text-text border border-text-300 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-600">{scan.reader?.id}</td>
                            <td className="text-text border border-text-300 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-600">{scan.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default ScansOverview;
