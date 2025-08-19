import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded bg-green-600 text-white font-medium hover:bg-green-700 transition-all duration-200 transform hover:scale-[1.02] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
