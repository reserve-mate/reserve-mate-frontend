"use client";

import { useEffect, useState } from "react";

export default function AdminFooter() {
  const [year, setYear] = useState(2024);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t bg-slate-800 text-slate-300 h-12 mt-auto shrink-0">
      <div className="h-full px-4 flex items-center justify-center">
        <p className="text-sm">
          ReserveMate © {year} All rights reserved
        </p>
      </div>
    </footer>
  );
} 