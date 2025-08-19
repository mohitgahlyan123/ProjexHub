import React from "react";

export function Label({ children, htmlFor, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={`block mb-1 font-medium ${className}`}>
      {children}
    </label>
  );
}
