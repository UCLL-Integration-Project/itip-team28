export type User = {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
};

export type Car = {
    id?: number;
    number?: number;
}

export type Coordinates = {
    id?: number;
    longitude?: number;
    latitude?: number;
}

export type Reader = {
    id?: number;
    name?: string;
    MacAddress?: string;
    coordinates?: Coordinates;
}

export type Route = {
    id?: number;
    status?: boolean;
    StartingPoint?: Reader;
    destination?: Reader;
    CurrentPoint?: Reader;
    timestamp?: string;
    instructions?: string[];
}

export type Scan = {
    id?: string;
    car?: Car;
    reader?: Reader;
    timestamp?: string;
    status?: "active" | "inactive";
};

export type Block = {
    id?: number;
    coordinates?: Coordinates;
}

export type StatusMessage = {
    message: string;
    type: "error" | "success";
};