export type Car = {
  id: string;
  name: string;
  tagId: string;
  timestamp: string;
  status: "active" | "inactive";
};

export const fetchCars = async (): Promise<Car[]> => {
  await new Promise((res) => setTimeout(res, 1000)); // Simulate delay

  const shouldFail = false; // Toggle to test error boundary
  if (shouldFail) throw new Error("Failed to load cars.");

  return [
    {
      id: "car_001",
      name: "Tesla Model S",
      tagId: "TSL-001",
      timestamp: "2025-05-14T12:00:00Z",
      status: "active",
    },
    {
      id: "car_002",
      name: "Ford Mustang",
      tagId: "FRD-002",
      timestamp: "2025-05-13T09:30:00Z",
      status: "inactive",
    },
  ];
};
