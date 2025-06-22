import React, { useEffect, useState } from "react";
import ReaderService from "@/services/ReaderService";
import { Reader, StatusMessage } from "@/types";
import { useRouter } from "next/router";

type Props = {
  IsOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reader: Reader | null;
  pushNotification: (message: StatusMessage) => void;
  refreshReaders: () => Promise<void>;
};

const DeleteReaderComponent: React.FC<Props> = ({ IsOpen, onClose, onSuccess, reader, pushNotification, refreshReaders }) => {
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const router = useRouter();

  const clearErrors = () => {
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    if (!reader || !reader.id) {
      setStatusMessages([{ message: "No valid reader selected", type: "error" }]);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    clearErrors();

    if (!validate()) {
      return;
    }

    try {
      const response = await ReaderService.deleteReader(reader!.id!);
      if (response.ok) {
        const result = await response.json();
        const successMessage = result.message || "Reader deleted successfully";
        setStatusMessages([{ message: successMessage, type: "success" }]);
        pushNotification({ message: successMessage, type: "success" });
        onSuccess();
        await refreshReaders();
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
        onClose();
        clearErrors();
      } else {
        const result = await response.json();
        let errorMessage = result.ServiceException || `Error deleting reader (status: ${response.status})`;
        if (result.ServiceException === "No grid found") {
          errorMessage = "No grid available in the system, deletion failed";
        }
        setStatusMessages([{ message: errorMessage, type: "error" }]);
        if (response.status === 401) {
          setStatusMessages([{ message: "Unauthorized: Please log in again", type: "error" }]);
          setTimeout(() => router.push("/login"), 2000);
        }
      }
    } catch (error: any) {
      setStatusMessages([{ message: `Error deleting reader: ${error.message}`, type: "error" }]);
    }
  };

  if (!IsOpen || !reader) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/85 bg-opacity-50 dark:bg-opacity-70 backdrop-blur-xs z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-comp rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 sm:space-y-6 transform transition-all duration-300 scale-95 hover:shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="text-lg font-bold text-text text-center">
          Delete Reader
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Are you sure you want to delete the reader "{reader.name ?? "No name"}"?
        </p>
        {statusMessages.length > 0 && (
          <div className="p-3 sm:p-4 rounded-md">
            <ul className="space-y-1 sm:space-y-2">
              {statusMessages.map(({ message, type }, index) => (
                <li
                  key={index}
                  className={`text-sm text-center ${
                    type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {message}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              clearErrors();
              onClose();
            }}
            className="bg-background text-text py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-link-text transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReaderComponent;