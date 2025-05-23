export type User = {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
};

export type Car = {
    id?: number;
    name?: string;
}

export type Coordinates = {
    id?: number;
    longitude?: number;
    latitude?: number;
}

export type Reader = {
    id?: number;
    name?: string;
    macAddress?: string;
    coordinates?: Coordinates;
    stocks?: [{
        id?: number,
        item?: {
            id?: number,
            name: string,
        },
        quantity: number
    }];
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

export type RouteData = {
    macAddress?: string;
    stock?: number;
    type?: "delivery" | "pick-up";
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
export type GridInput= {
  coordinates: { longitude: number, latitude: number;}[];
  measurement: number;
}
export type Grid = {
  id: number;
  coordinates: { id:number,longitude: number, latitude: number;}[];
  measurement: number;
};

