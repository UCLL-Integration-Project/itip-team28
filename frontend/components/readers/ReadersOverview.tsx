import React, { useEffect, useState } from "react";
import { Reader, StatusMessage } from "../../types";
import ReaderService from "@/services/ReaderService";
import CreateReaderComponent from "./CreateReaderComponent";
import UpdateReader from "./UpdateReaderComponent";
import DriveHereComponent from "../drive/DriveHereComponent";
import { useRouter } from "next/router";
import DeleteReaderComponent from "./DeleteReaderComponent";

interface ReadersOverviewProps {
  readers: Reader[];
  onClose: () => void;
  refreshReaders: () => Promise<void>;
  pushNotification: (message: StatusMessage) => void;
  selectedReaderId?: number | null;
  setStartMoving: (val: boolean) => void;
}

const shelfIcon = (
  <img src="../images/shelves.png" alt="" className="w-8 h-8 bg-gray-300 rounded" />
);

export const ReadersOverview: React.FC<ReadersOverviewProps> = ({ 
  readers: initialReaders, 
  onClose, 
  refreshReaders, 
  pushNotification, 
  selectedReaderId, 
  setStartMoving 
}) => {
  const [readers, setReaders] = useState<Reader[]>(initialReaders);
  const [selectedReader, setSelectedReader] = useState<Reader | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [readerToDelete, setReaderToDelete] = useState<Reader | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const [status, setStatus] = useState<'started' | 'ended' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

    useEffect(() => {
    if (statusMessages.length > 0 && statusMessages[0].type === "success") {
      const timer = setTimeout(() => {
        setStatusMessages([]);
      }, 3000);
      return () => clearTimeout(timer); 
    }
  }, [statusMessages]);

  useEffect(() => {
    setReaders(initialReaders);
  }
    , [initialReaders]);

  const filteredReaders = readers.filter(reader =>
    (reader.name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
  );

  const handleSelectReader = (reader: Reader) => {
    setSelectedReader(reader);
  }

  const handleReaderCreated = () => {
    setIsCreateModalOpen(false);
    setStatusMessages([{ message: "Reader created successfully", type: "success" }]);
    ReaderService.getReaders().then(async (response) => {
      if (response.ok) {
        const updatedReaders = await response.json();
        setReaders(updatedReaders);
      }
    }).catch((error) => {
      setStatusMessages([{ message: `Error fetching readers: ${error.message}`, type: "error" }]);
    });
  };

  const handleReaderUpdated = () => {
    setIsUpdateModalOpen(false);
    setStatusMessages([{ message: "Reader updated successfully", type: "success" }]);
    ReaderService.getReaders().then(async (response) => {
      if (response.ok) {
        const updatedReaders = await response.json();
        setReaders(updatedReaders);
      }
    })
      .catch((error) => {
        setStatusMessages([{ message: `Error fetching readers: ${error.message}`, type: "error" }]);
      });
  };

  const handleReaderDeleted = () => {
    setIsDeleteModalOpen(false);
    setReaderToDelete(null);
    setStatusMessages([{ message: "Reader deleted successfully", type: "success" }]);
    ReaderService.getReaders()
      .then(async (response) => {
        if (response.ok) {
          const updatedReaders = await response.json();
          setReaders(updatedReaders);
        }
      })
      .catch((error) => {
        setStatusMessages([{ message: `Error fetching readers: ${error.message}`, type: "error" }]);
      });
  }

  const handleStatusMessages = (statusMessage: StatusMessage) => {
    setStatusMessages([statusMessage]);
  };

  const handleStart = () => {
    setStatus('started');
  };

  return (
    <div className="bg-comp rounded-lg shadow-md px-4 py-4 flex flex-col items-start gap-4 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:shadow-lg relative">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-medium text-text hover:text-link-text transition-colors duration-300">
          Readers Overview
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

      {/* Search Bar */}
      <div className="w-full mb-4">
        <input
          type="text"
          placeholder="Search Readers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm bg-background focus:ring-2 focus:ring-link-text focus:border-link-text text-text placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Status Messages */}
      {statusMessages.length > 0 && (
        <div className="mb-4 w-full p-3 rounded-md bg-background animate-fade-in shadow-sm">
          <ul className="space-y-1">
            {statusMessages.map(({ message, type }, index) => (
              <li
                key={index}
                className={`text-sm text-center ${type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
              >
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reader Cards */}
      <div className="flex flex-col gap-3 w-full">
        {filteredReaders.length > 0 ? (
          filteredReaders.map((reader) => (
            <div
              key={reader.id}
              className={`border rounded-lg shadow-md px-4 py-4 flex flex-col gap-3 transition-all duration-300 hover:bg-gray-100 ${
                selectedReaderId === reader.id
                ? "border-blue-500 bg-blue-100"
                : "border-gray-300 bg-white"
              }`}
            >
              <div className="flex justify-between">
                <div className="flex flex-col  gap-2 ">
                  <div className="flex items-center gap-2">
                    <div className="w-8">{shelfIcon}</div>
                    <div className="text-md font-medium text-gray-600 dark:text-gray-600">{reader.name}</div>
                  </div>
                  <div className="pt-1">
                    <div className="text-sm text-gray-600 dark:text-gray-600">
                      MAC: {reader.macAddress}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-600">
                      Stock: {reader?.stocks?.[reader.stocks?.length - 1]?.quantity ?? "No stock"}
                    </div>
                  </div>
                </div>
                <div className="gap-2 ml-3 text-sm text-text flex flex-col">
                  <p className="px-2 py-1 bg-green-200 rounded-sm border-green-400 border-1 text-green-800 shadow-sm">
                    X:{reader.coordinates?.longitude}
                  </p>
                  <p className="px-2 py-1 bg-purple-200 rounded-sm border-purple-400 border-1 text-purple-800 shadow-sm">
                    Y:{reader.coordinates?.latitude}
                  </p>
                </div>
              </div>
              {/* Drive Here and Update Buttons */}
              <div className="flex items-center justify-between gap-2 border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                <DriveHereComponent
                  setStartMoving={setStartMoving}
                  reader={reader}
                  selectReader={handleSelectReader}
                  setNewStatusMessages={handleStatusMessages} 
                  pushNotification={pushNotification} 
                  refreshReaders={refreshReaders} 
                  onRouteStart={handleStart} 
                />
                <button
                  onClick={() => {
                    setSelectedReader(reader);
                    setIsUpdateModalOpen(true);
                  }}
                  className="w-full bg-gray-300 border-1 border-gray-400 text-green-800 py-1 px-3 rounded-sm text-xs font-light hover:bg-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200 cursor-pointer"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setReaderToDelete(reader);
                    setIsDeleteModalOpen(true);
                  }}
                    className="bg-red-500 border-1 border-red-600 text-white py-1 px-3 rounded-sm text-xs font-light hover:bg-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 cursor-pointer"
                  >
                    Delete
                  </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No readers found matching your search.
          </div>
        )}
      </div>

      {/* Create Reader Button */}
      <div className="mt-4 w-full">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="link-text text-xs font-medium py-1 px-2 rounded-md cursor-pointer"
        >
          Add Reader
        </button>
      </div>

      {/* Create Reader Modal */}
      <CreateReaderComponent
        IsOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleReaderCreated} 
        pushNotification={pushNotification} 
        refreshReaders={refreshReaders}
      />

      {/* Update Reader Modal */}
      <UpdateReader
        IsOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={handleReaderUpdated}
        reader={selectedReader} 
        pushNotification={pushNotification} 
      />

      {/* Delete Reader Modal */}
      <DeleteReaderComponent
        IsOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setReaderToDelete(null);
        }}
        onSuccess={handleReaderDeleted}
        reader={readerToDelete}
        pushNotification={pushNotification}
        refreshReaders={refreshReaders}
      />
    </div>
  );
};