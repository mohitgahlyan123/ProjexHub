
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/authContext";

function InitialCircle({ name = "U" }) {
  const letter = (name?.trim()?.[0] || "U").toUpperCase();
  return (
    <div className="h-8 w-8 rounded-full bg-green-600/90 text-white grid place-items-center font-semibold" aria-hidden>
      {letter}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current || menuRef.current.contains(e.target) || btnRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const name = user?.username || "User";
  const email = user?.email || "";

  return (
    <nav className="w-full  bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M4 6h16v2H4zM4 11h10v2H4zM4 16h16v2H4z" />
          </svg>
          <span className="font-semibold text-gray-800">ProjexHub</span>
        </div>

        <div className="relative">
          <button
            ref={btnRef}
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 group"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <span className="hidden sm:block text-sm text-gray-500">
              Welcome, <span className="font-medium text-gray-800">{name}</span>
            </span>
            <InitialCircle name={name} />
          </button>

          {open && (
            <div
              ref={menuRef}
              role="menu"
              className="absolute right-0 mt-2 w-56 rounded-lg border bg-white shadow-lg p-3 z-50"
            >
              <div className="mb-2">
                <div className="text-sm font-medium text-gray-900">{name}</div>
                {email ? <div className="text-xs text-gray-500 truncate">{email}</div> : null}
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <button
                type="button"
                className="w-full text-left text-sm px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Settings
              </button>
              <button
                type="button"
                className="w-full text-left text-sm px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
