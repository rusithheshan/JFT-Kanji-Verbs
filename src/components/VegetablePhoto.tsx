import React, { useState } from "react";
import { VegetableCropSVG } from "./VegetableCropSVG";

interface VegetablePhotoProps {
  cropId: string;
  photoUrl?: string;
  nameSi: string;
  className?: string;
  imgClassName?: string;
  animate?: boolean;
}

export const VegetablePhoto: React.FC<VegetablePhotoProps> = ({
  cropId,
  photoUrl,
  nameSi,
  className = "w-28 h-28",
  imgClassName = "w-full h-full object-cover rounded-2xl shadow-sm",
  animate = false
}) => {
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If photoUrl exists and has not errored, render the real photo with fallback to SVG
  if (photoUrl && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-white/90 border border-slate-200/80 rounded-2xl flex items-center justify-center ${className}`}>
        {/* Placeholder skeleton before load */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center text-slate-300 text-xs">
            🌿
          </div>
        )}
        <img
          src={photoUrl}
          alt={nameSi}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setImgError(true)}
          className={`${imgClassName} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        />
      </div>
    );
  }

  // Graceful fallback to rich vector SVG
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <VegetableCropSVG cropId={cropId} className="w-full h-full" animate={animate} />
    </div>
  );
};
