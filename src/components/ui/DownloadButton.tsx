import React, { useState } from "react";
import { exportElementAsImage } from "@/utils/exportImage";

interface DownloadButtonProps {
  targetRef: React.RefObject<HTMLElement>;
  filename: string;
  className?: string;
  label?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  targetRef,
  filename,
  className,
  label = "Download Data",
}) => {
  const [downloading, setDownloading] = useState(false);

  const onClick = async () => {
    if (!targetRef.current) return;
    try {
      setDownloading(true);
      await exportElementAsImage(targetRef.current, {
        filename,
        watermarkText: "suihub africa",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={downloading}
      className={`px-3 py-2 text-sm bg-[#292929] cursor-pointer text-[#fafafa] rounded-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed${className ? ` ${className}` : ""}`}
    >
      {downloading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
          Downloading...
        </span>
      ) : (
        label
      )}
    </button>
  );
};

export default DownloadButton;
