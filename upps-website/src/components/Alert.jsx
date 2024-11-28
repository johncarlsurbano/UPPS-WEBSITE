// Alert.jsx
import React from 'react';

const Alert = ({ show, handleClose, handleFunction,paragraph,title,Yes,No }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-2">{paragraph}.</p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            {Yes}
          </button>
          <button
            onClick={() => {
              handleFunction();
              handleClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {No}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
