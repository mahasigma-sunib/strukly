import React from "react";
import Button from "./components/Button";

/* Tes doang, hapus aja */
export default function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-surface p-6">
      <Button />

      {/* Typography test */}
      <div className="typography-regular text-primary">Typography Regular</div>
      <div className="typography-medium text-primary">Typography Medium</div>
      <div className="typography-large text-primary">Typography Large</div>

      {/* Color palette test */}
      <div className="flex gap-2 mt-4">
        <div
          style={{
            backgroundColor: "var(--color-primary)",
            width: 50,
            height: 50,
          }}
        />
        <div
          style={{
            backgroundColor: "var(--color-primary-hover)",
            width: 50,
            height: 50,
          }}
        />
        <div
          style={{
            backgroundColor: "var(--color-orange)",
            width: 50,
            height: 50,
          }}
        />
        <div
          style={{
            backgroundColor: "var(--color-status-success)",
            width: 50,
            height: 50,
          }}
        />
        <div
          style={{
            backgroundColor: "var(--color-status-error)",
            width: 50,
            height: 50,
          }}
        />
      </div>
    </div>
  );
}
