import React from "react";

interface CustomInputProps {
  value: number;
  step: number;
  onChange: (value: number) => void;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  value,
  step,
  onChange,
}) => (
  <input
    type="number"
    value={value}
    step={step}
    onChange={(e) => onChange(parseFloat(e.target.value))}
    style={{
      width: "80px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#333",
      textAlign: "center",
    }}
  />
);
