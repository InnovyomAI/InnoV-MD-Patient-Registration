import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Confirmation</h2>
        <p className="mb-4">Information transferred to Doctors Desk. Going back to waiting list.</p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
