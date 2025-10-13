// src/components/AuthPromptModal.jsx
import React from "react";

export default function AuthPromptModal({ open, onClose, onGoToLogin }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#0b0b0b] rounded-lg p-6 w-[90%] max-w-md border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-2">Please log in</h3>
        <p className="text-sm text-gray-300 mb-6">
          You must be logged in to deposit demo funds.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-800 text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onGoToLogin}
            className="px-4 py-2 rounded bg-sky-500 text-white"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
