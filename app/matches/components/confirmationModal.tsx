import React from 'react';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }:any) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-opacity-80 bg-gray-900 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-3/4 lg:w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-center">Confirmation</h2>
        <p className="text-lg text-center">
          Are you sure you want to make the final submission?
        </p>
        <div className="text-center mt-4 flex justify-evenly">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
