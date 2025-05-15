import React from "react";

type Car = {
    id: string;
    timestamp: string;
    TagId: string;
};

type CarsOverviewProps = {
    cars: Car[];
};

const CarsOverview: React.FC<CarsOverviewProps> = ({ cars }) => (
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
                {cars.map((car) => (
                    <tr key={car.id}>
                        <td style={{ border: "1px solid #ccc", padding: "16px" }}>{car.id}</td>
                        <td style={{ border: "1px solid #ccc", padding: "16px" }}>{car.timestamp}</td>
                        <td style={{ border: "1px solid #ccc", padding: "16px" }}>{car.TagId}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default CarsOverview;