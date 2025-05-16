import { Scan } from "@/types";
import React from "react";


type Props = {
    scans: Array<Scan>;
};

const ScansOverview: React.FC<Props> = ({ scans }: Props) => (
    <div style={{ padding: "2rem" }}>
        <h2 className=" text-3xl mb-4 font-semibold">Overview</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    <th style={{ border: "1px solid #ccc", padding: "16px" }}>Scanner ID</th>
                    <th style={{ border: "1px solid #ccc", padding: "16px" }}>Car ID</th>
                    <th style={{ border: "1px solid #ccc", padding: "16px" }}>Tag ID</th>
                    <th style={{ border: "1px solid #ccc", padding: "16px" }}>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {scans.map((scan) => (
                    <tr key={scan.id}>
                        <td style={{ border: "1px solid #ccc", padding: "16px" }}>{scan.id}</td>
                        <td style={{ border: "1px solid #ccc", padding: "16px" }}>{scan.car?.id}</td>
                        <td style={{ border: "1px solid #ccc", padding: "16px" }}>{scan.tag?.id}</td>
                        <td style={{ border: "1px solid #ccc", padding: "16px" }}>{scan.timestamp}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default ScansOverview;
