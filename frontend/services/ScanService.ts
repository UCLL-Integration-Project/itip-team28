const getToken = (): string => {
  const LoggedInUserString = sessionStorage.getItem('LoggedInUser');
  return LoggedInUserString ? JSON.parse(LoggedInUserString).token : '';
};


const getScans = () => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + '/scans', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

const ScanService = {
  getScans,
};
export default ScanService;
