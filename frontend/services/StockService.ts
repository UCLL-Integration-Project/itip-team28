const getToken = (): string => {
  const LoggedInUserString = sessionStorage.getItem('LoggedInUser');
  return LoggedInUserString ? JSON.parse(LoggedInUserString).token : '';
};

const getStockForReader = async (readerId: number) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/readers/${readerId}/stocks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

const getStockForCar = async (carId: number) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${carId}/stocks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
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
  const endpoint = direction === 'PICKUP' ? 'requestPickup' : 'requestDelivery';
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${carId}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ readerId, itemId, quantity }),
  });

  if (!res.ok) throw new Error(await res.text());

  const result = await res.json();
  return result.id;
};

const completeStockTransfer = async (requestId: number): Promise<void> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stocktransferrequests/${requestId}/complete`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
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