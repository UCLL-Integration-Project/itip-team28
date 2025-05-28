const getToken = (): string => {
  const LoggedInUserString = sessionStorage.getItem('LoggedInUser');
  return LoggedInUserString ? JSON.parse(LoggedInUserString).token : '';
};

const getCars = () => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + '/cars', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  }).catch((error) => {
    console.error("Error:", error);
    throw error;
  });
};

const getCarStocks = (carId: number) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/cars/${carId}/stocks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  }).catch((error) => {
    console.error("Error:", error);
    throw error;
  });
};

const CarService = {
  getCars,
  getCarStocks,
};
export default CarService;
