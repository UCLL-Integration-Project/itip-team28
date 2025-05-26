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

const requestStockTransfer = async (
  carId: number,
  readerId: number,
  itemId: number,
  quantity: number,
  direction: 'PICKUP' | 'DELIVERY'
): Promise<number> => {
  const token = getToken();
  if (!token) throw new Error('No token');

  const endpoint = direction === 'PICKUP' ? 'requestPickup' : 'requestDelivery';
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${carId}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ readerId, itemId, quantity }),
  });

  if (!res.ok) throw new Error(await res.text());

  const result = await res.json();
  return result.id; // 🔥 the requestId
};

const completeStockTransfer = async (requestId: number): Promise<void> => {
  const token = getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stocktransferrequests/${requestId}/complete`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to complete transfer: ${errText}`);
  }
};



const StockService = {
    getStockForReader,
    getStockForCar,
    requestStockTransfer,
    completeStockTransfer
};  

export default StockService;