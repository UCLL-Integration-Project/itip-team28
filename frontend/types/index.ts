export type User = {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
};

export type Scan = {
    id: string;
    name: string;
    ReaderId: string;
    timestamp: string;
    status: "active" | "inactive";
};

export type StatusMessage = {
    message: string;
    type: "error" | "success";
};