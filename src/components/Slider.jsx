import React from 'react';

export const Slider = ({ value, onValueChange, min, max, step, className }) => {
  const handleChange = (e) => {
    const newValue = [parseInt(e.target.value)];
    onValueChange(newValue);
  };

  return (
    <div className={className}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="w-100"
      />
    </div>
  );
};

