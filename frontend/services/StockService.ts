const getToken = (): string => {
  const LoggedInUserString = sessionStorage.getItem('LoggedInUser');
  return LoggedInUserString ? JSON.parse(LoggedInUserString).token : '';
};

const getStockForReader = async (readerId: number) => {
    const token = getToken();

    if(!token) {
        throw new Error('No authentication token found. Please Log in again.');
    }

    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/readers/${readerId}/stocks`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const getStockForCar = async (carId: number) => {
    const token = getToken();

    if(!token) {
        throw new Error('No authentication token found. Please Log in again.');
    }

    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${carId}/stocks`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const requestStockTransfer = async (carId: number, readerId: number, itemId: number, quantity: number, direction: 'PICKUP' | 'DELIVERY') => {
    const token = getToken();

    if(!token) {
        throw new Error('No authentication token found. Please Log in again.');
    }

    const endpoint = direction === 'PICKUP' ? 'requestPickup' : 'requestDelivery';
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${carId}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            readerId,
            itemId,
            quantity,
        }),
    });
}

const StockService = {
    getStockForReader,
    getStockForCar,
    requestStockTransfer,
};  

export default StockService;