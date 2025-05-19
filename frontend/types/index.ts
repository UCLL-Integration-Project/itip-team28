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
    number?: number;
}

export type Scan = {
    id?: string;
    car?: Car;
    reader?: Reader;
    timestamp?: string;
    status?: "active" | "inactive";
};

export type StatusMessage = {
    message: string;
    type: "error" | "success";
};