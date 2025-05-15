import { ClientPageRoot } from "next/dist/client/components/client-page";

export type Scan = {
  id: string;
  name: string;
  TagId: string;
  timestamp: string;
  status: "active" | "inactive";
};

export const fetchScans = async (): Promise<Scan[]> => {
  const response = await fetch("http://localhost:3000/scans", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("Response:", response);
  console.log("Response status:", response.status);

  if (!response.ok) {
    throw new Error(`Failed to load Scans: ${response.statusText}`);
  }

  const data = await response.json();
  return data as Scan[];
};

