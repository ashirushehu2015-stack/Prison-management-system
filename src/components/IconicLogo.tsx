import React from "react";

interface IconicLogoProps {
  className?: string;
  variant?: "work" | "large" | "trans";
  showBg?: boolean;
}

export default function IconicLogo({ 
  className = "w-12 h-12", 
  variant = "trans",
  showBg = false
}: IconicLogoProps) {
  const logoSrc = 
    variant === "work" 
      ? "https://www.iconicuniversity.edu.ng/wp-content/uploads/2023/02/cropped-ICONIC-WORK01.png" 
      : variant === "large" 
        ? "https://www.iconicuniversity.edu.ng/wp-content/uploads/2025/11/ICONIC-Trans.png" 
        : "https://www.iconicuniversity.edu.ng/wp-content/uploads/2023/02/cropped-cropped-ICONIC-WORK01-192x192.png";

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${
        showBg 
          ? "bg-white p-1.5 rounded-2xl shadow-lg border border-slate-200/80" 
          : ""
      }`}
    >
      <img
        src={logoSrc}
        alt="Iconic University Logo"
        className={`${className} object-contain transition-all duration-300 hover:scale-105 filter drop-shadow-md`}
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback if there's any loading issue
          console.warn("Logo failed to load from live URL, trying local assets");
          const target = e.currentTarget;
          if (target.src.includes("cropped-cropped-ICONIC-WORK01-192x192.png")) {
            target.src = "/logo_trans.png";
          } else if (target.src.includes("cropped-ICONIC-WORK01.png")) {
            target.src = "/logo_work.png";
          } else if (target.src.includes("ICONIC-Trans.png")) {
            target.src = "/logo_large.png";
          }
        }}
      />
    </div>
  );
}
