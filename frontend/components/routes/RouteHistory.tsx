import { Route } from "@/types";

interface RouteHistoryProps {
    routes: Route[];
    onClose: () => void;
}

const RouteHistory: React.FC<RouteHistoryProps> = ({ routes, onClose }) => {
return (
    <div className="bg-comp rounded-lg shadow-md px-4 py-4 flex flex-col items-start gap-4 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:shadow-lg relative">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-medium text-text hover:text-link-text transition-colors duration-300">
          Route History
        </h1>
        <button
          onClick={onClose}
          className="text-text hover:text-link-text rounded-full p-2 focus:outline-none transition-colors duration-200"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-3 w-full">
        {routes.length === 0 ? (
          <div className="text-text text-center">No routes available.</div>
        ) : (
          routes.map((route) => (
            <div
              key={route.id}
              className="bg-table rounded-lg shadow-md px-4 py-4 flex flex-col gap-2 transition-all duration-300 hover:bg-gray-100"
            >
              <div className="text-lg font-medium text-text">
                Route ID: {route.id}
              </div>
              <div className="text-sm text-text">
                From: {route.StartingPoint?.name} (X:{route.StartingPoint?.coordinates?.longitude}, Y:{route.StartingPoint?.coordinates?.latitude})
              </div>
              <div className="text-sm text-text">
                To: {route.destination?.name} (X:{route.destination?.coordinates?.longitude}, Y:{route.destination?.coordinates?.latitude})
              </div>
              <div className="text-sm text-text">
                Status: {route.status ? "Completed" : "Incomplete"}
              </div>
              <div className="text-sm text-text">
                Timestamp: {route.timestamp ? new Date(route.timestamp).toLocaleString() : "N/A"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RouteHistory;