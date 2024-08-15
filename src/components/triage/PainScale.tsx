// components/PainScale.tsx
import React from 'react';

interface PainScaleProps {
  value: number;
  onChange: (value: number) => void;
}

const PainScale: React.FC<PainScaleProps> = ({ value, onChange }) => {
  const getColor = (value: number) => {
    if (value <= 3) return 'bg-green-500';
    if (value <= 6) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="mt-2">
      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between mt-1">
        {Array.from({ length: 11 }).map((_, index) => (
          <div
            key={index}
            className={`w-8 h-8 flex items-center justify-center text-white ${getColor(index)} rounded`}
          >
            {index}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PainScale;
