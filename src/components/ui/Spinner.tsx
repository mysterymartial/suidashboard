import React from "react";

interface SpinnerProps {
  size?: number; // px
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 32 }) => {
  const dimension = `${size}px`;
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <div
        className="animate-spin rounded-full border-4 border-black border-t-transparent"
        style={{ width: dimension, height: dimension }}
        aria-label="Loading"
      />
    </div>
  );
};

export default Spinner;

// import { Spinner as RadixSpinner } from "@radix-ui/themes";

// type SpinnerProps = {
//   size?: "1" | "2" | "3";
//   centered?: boolean;
// };

// export function Spinner({ size = "3", centered = true }: SpinnerProps) {
//   if (centered) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <RadixSpinner size={size} />
//       </div>
//     );
//   }

//   return <RadixSpinner size={size} />;
// }
