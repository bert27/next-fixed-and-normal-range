import React from "react";
import styles from "./range-handle.module.css";
import { addEventListeners, removeEventListeners } from "../../utils";

interface RangeHandleProps {
  value: number;
  min: number;
  max: number;
  label: string;
  position: number;
  type: "min" | "max";
  onDrag: (event: MouseEvent | TouchEvent, type: "min" | "max") => void;
  onKeyDown?: (e: React.KeyboardEvent, type: "min" | "max") => void;
  id?: string;
  size?: string;
}

export const RangeHandle: React.FC<RangeHandleProps> = ({
  value,
  min,
  max,
  label,
  position,
  type,
  onDrag,
  onKeyDown,
  id,
  size = "22px",
}) => {
  const handleMouseOrTouchDown = () => {
    const moveHandler = (event: MouseEvent | TouchEvent) => onDrag(event, type);
    const upHandler = () => removeEventListeners(moveHandler, upHandler);

    addEventListeners(moveHandler, upHandler);
  };

  return (
    <div
      className={styles.rangeHandle}
      role="slider"
      data-testid={id}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      tabIndex={0}
      style={{
        left: `${position}%`,
        ["--sizeBall" as string]: size,
      }}
      onMouseDown={handleMouseOrTouchDown}
      onTouchStart={handleMouseOrTouchDown}
      onKeyDown={onKeyDown ? (e) => onKeyDown(e, type) : undefined}
    />
  );
};
