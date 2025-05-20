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

export type Reader = {
    id?: number;
    name?: string;
    MacAddress?: string;
    coordinates?: string; //to do import and adjust new coordinates class
}

export type Scan = {
    id?: string;
    car?: Car;
    reader?: Reader;
    timestamp?: string;
    status?: "active" | "inactive";
};

export type Route = {
    id?: number;
    status?: boolean;
    startingPoint?: Reader;
    destination?: Reader;
    timestamp?: Date;
    instructions?: Array<string>;
}

export type StatusMessage = {
    message: string;
    type: "error" | "success";
};