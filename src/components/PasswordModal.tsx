import React, { useState } from "react";
import {
  fetchCurrentAdminPassword,
  setAdminPassword,
} from "../services/authStore";

interface PasswordModalProps {
  onAuthenticate: (authenticated: boolean) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onAuthenticate }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    try {
      const expected = await fetchCurrentAdminPassword();
      if (expected && password === expected) {
        setAdminPassword(password);
        setError(null);
        onAuthenticate(true);
      } else {
        setError("Incorrect password");
      }
    } catch (error) {
      console.error("Unable to verify admin password", error);
      setError("Unable to verify password right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Admin login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full rounded-lg border border-slate-200 px-4 py-3"
          />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-full bg-teal-600 px-5 py-2 text-white hover:bg-teal-700"
            >
              Enter
            </button>
          </div>
        </form>
        <p className="mt-3 text-xs text-slate-400">
          Enter admin password to access dashboard.
        </p>
      </div>
    </div>
  );
};

export default PasswordModal;
