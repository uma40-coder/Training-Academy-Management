import React, { useState, useEffect } from "react";
import "./Toast.css";

let toastListener = null;

export const showToast = (message, type = "info") => {
  if (toastListener) {
    toastListener({ message, type, id: Date.now() + Math.random() });
  }
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastListener = (newToast) => {
      setToasts((prev) => [...prev.slice(-3), newToast]);
    };
    return () => {
      toastListener = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div className={`custom-toast custom-toast-${toast.type}`}>
      <span className="toast-icon">{icons[toast.type] || "ℹ️"}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close-btn" onClick={onClose}>
        ✕
      </button>
    </div>
  );
};
