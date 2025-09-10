import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const CardComponent: React.FC<CardProps> = ({
  children,
  className,
}: CardProps) => {
  return (
    <div
      className={`border border-[#e8e8e8] rounded-[10px] p-4${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
};

export default CardComponent;
