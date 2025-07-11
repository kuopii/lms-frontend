"use client";

import React, { useState, useEffect } from "react";

const ScreenSizeTracker = () => {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Pastikan kode hanya berjalan di client
    if (typeof window !== "undefined") {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const handleResize = () => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  if (process.env.NODE_ENV === "production") return null;

  return (
    <>
      <div className="fixed right-1/2 bottom-2 flex w-fit translate-x-1/2 items-center justify-center rounded-full bg-gray-800 px-4 text-sm text-white">
        <p>{screenSize.width} px</p>
      </div>
      <div className="fixed top-1/2 -right-3 flex w-fit rotate-90 items-center justify-center rounded-full bg-gray-800 px-4 text-sm text-white">
        <p>{screenSize.height} px</p>
      </div>
    </>
  );
};

export default ScreenSizeTracker;
