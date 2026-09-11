import React from "react";

interface SchoolCrestProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  withText?: boolean;
}

export const SchoolCrest: React.FC<SchoolCrestProps> = ({
  className = "",
  size = "md",
  withText = true
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-lg"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} relative rounded-full bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 border-2 border-amber-400/80 shadow-md flex items-center justify-center text-amber-300 flex-shrink-0`}
      >
        {/* Inner Crest Design */}
        <svg
          viewBox="0 0 100 100"
          className="w-4/5 h-4/5 text-amber-400 drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield Outline */}
          <path
            d="M50 12 L78 22 C78 50 68 76 50 88 C32 76 22 50 22 22 Z"
            fill="#064e3b"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Torch Flame */}
          <path
            d="M50 24 C52 28 56 30 54 36 C52 40 48 42 50 46 C46 44 44 38 46 34 C48 30 46 26 50 24 Z"
            fill="#fbbf24"
          />
          {/* Open Book */}
          <path
            d="M33 52 C41 49 47 51 50 54 C53 51 59 49 67 52 L65 67 C58 64 53 66 50 69 C47 66 42 64 35 67 Z"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          {/* Banner Ribbons */}
          <path
            d="M20 78 Q50 88 80 78"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-tight text-slate-900 text-base md:text-lg leading-tight uppercase font-serif">
            Kaplong High School
          </span>
          <span className="text-[11px] font-semibold text-emerald-800 tracking-wider uppercase">
            Strive for Excellence &bull; Est. Kenya
          </span>
        </div>
      )}
    </div>
  );
};
