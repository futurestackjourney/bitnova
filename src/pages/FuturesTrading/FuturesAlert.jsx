// components/Modal.jsx
import React from "react";

export default function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-white/60 dark:bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md mx-auto rounded-2xl bg-card-light dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-black dark:text-white font-semibold text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black dark:hover:text-white transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="text-sm text-zinc-700 dark:text-zinc-300">{children}</div>
        {Array.isArray(actions) && actions.length > 0 && (
          <div className="mt-4 flex gap-2 justify-end">
            {actions.map((a, i) => (
              <button
                key={i}
                onClick={a.onClick}
                className={`px-3 py-1.5 rounded ${a.variant === "primary" ? "bg-yellow-500 text-black font-semibold" : "bg-zinc-400 dark:bg-zinc-700 text-white"}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
