import React from "react";

type Scan = {
    id: string;
    timestamp: string;
    TagId: string;
};

type ScansOverviewProps = {
    scans: Scan[];
};

const ScansOverview: React.FC<ScansOverviewProps> = ({ scans }) => (
    <div style={{ padding: "2rem" }}>
        <h2 className=" text-3xl mb-4 font-semibold">Overview</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    <th style={{ border: "1px solid #ccc", padding: "16px" }}>Car ID</th>
                    <th style={{ border: "1px solid #ccc", padding: "16px" }}>Timestamp</th>
                    <th style={{ border: "1px solid #ccc", padding: "16px" }}>Tag ID</th>
                </tr>
            </thead>
            <tbody>
                {scans.map((scan) => (
                    <tr key={scan.id}>
                        <td style={{ border: "1px solid #ccc", padding: "16px" }}>{scan.id}</td>
                        <td style={{ border: "1px solid #ccc", padding: "16px" }}>{scan.timestamp}</td>
                        <td style={{ border: "1px solid #ccc", padding: "16px" }}>{scan.TagId}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default ScansOverview;