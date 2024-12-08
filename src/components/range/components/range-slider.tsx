"use client";

import React, { useState, useRef } from "react";
import styled from "styled-components";
import { addEventListeners, removeEventListeners } from "./utils";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  minGap?: number;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  minGap = 3,
}) => {
  const [minValue, setMinValue] = useState<number>(min);
  const [maxValue, setMaxValue] = useState<number>(max);

  const rangeRef = useRef<HTMLDivElement>(null);

  const colorSliderSelect = "#2C2D3F";
  const colorSliderUnselect = "#bebec4";
  const widthRangeHandle = "22px";
  const heightRangeHandle = "22px";

  const handleMinChange = (value: number) => {
    if (value < min || value > maxValue - minGap) return;
    setMinValue(value);
  };

  const handleMaxChange = (value: number) => {
    if (value > max || value < minValue + minGap) return;
    setMaxValue(value);
  };

  const handleMouseOrTouchMove = (
    event: MouseEvent | TouchEvent,
    type: "min" | "max"
  ) => {
    if (!rangeRef.current) return;

    const clientX =
      event instanceof MouseEvent ? event.clientX : event.touches[0]?.clientX;

    const rect = rangeRef.current.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;
    const newValue = Math.round((min + percent * (max - min)) / step) * step;

    if (type === "min") {
      handleMinChange(Math.min(newValue, maxValue - step));
    } else {
      handleMaxChange(Math.max(newValue, minValue + step));
    }
  };

  const handleMouseOrTouchDown = (type: "min" | "max") => {
    const moveHandler = (event: MouseEvent | TouchEvent) =>
      handleMouseOrTouchMove(event, type);
    const upHandler = () => {
      removeEventListeners(moveHandler, upHandler);
    };

    addEventListeners(moveHandler, upHandler);
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: "min" | "max") => {
    let currentValue = type === "min" ? minValue : maxValue;

    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      currentValue -= step;
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      currentValue += step;
    }

    if (type === "min") {
      handleMinChange(currentValue);
    } else {
      handleMaxChange(currentValue);
    }
  };

  const formatValue = (value: number) =>
    `${value.toFixed(2).replace(".", ",")} €`;

  return (
    <RangeSliderWrapper ref={rangeRef}>
      <RangeLabels>
        <Input
          type="number"
          value={minValue}
          step={step}
          onChange={(e) => handleMinChange(parseFloat(e.target.value))}
        />
        <Input
          type="number"
          value={maxValue}
          step={step}
          onChange={(e) => handleMaxChange(parseFloat(e.target.value))}
        />
      </RangeLabels>

      <RangeTrack $width={100} $background={colorSliderUnselect}>
        <RangeHighlight
          $background={colorSliderSelect}
          style={{
            left: `${((minValue - min) / (max - min)) * 100}%`,
            right: `${100 - ((maxValue - min) / (max - min)) * 100}%`,
          }}
        />
        <RangeHandle
          $background={colorSliderSelect}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={minValue}
          aria-label={`Minimum value: ${formatValue(minValue)}`}
          tabIndex={0}
          $width={widthRangeHandle}
          $height={heightRangeHandle}
          style={{
            left: `${((minValue - min) / (max - min)) * 100}%`,
          }}
          onMouseDown={() => handleMouseOrTouchDown("min")}
          onTouchStart={() => handleMouseOrTouchDown("min")}
          onKeyDown={(e) => handleKeyDown(e, "min")}
        />
        <RangeHandle
          $background={colorSliderSelect}
          $width={widthRangeHandle}
          $height={heightRangeHandle}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={maxValue}
          aria-label={`Maximum value: ${formatValue(maxValue)}`}
          tabIndex={0}
          style={{
            left: `${((maxValue - min) / (max - min)) * 100}%`,
          }}
          onMouseDown={() => handleMouseOrTouchDown("max")}
          onTouchStart={() => handleMouseOrTouchDown("max")}
          onKeyDown={(e) => handleKeyDown(e, "max")}
        />
      </RangeTrack>
    </RangeSliderWrapper>
  );
};

const RangeSliderWrapper = styled.div`
  width: 88%;
  position: relative;
  height: 60px;
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 80px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: center;
`;

const RangeTrack = styled.div<{ $background: string; $width: number }>`
  width: ${(props) => `calc(${props.$width}% + 22px)`};
  height: 3px;
  position: relative;
  margin: 10px 0;
  background: ${(props) => props.$background};
  border-radius: 4px;
`;

const RangeHighlight = styled.div<{ $background: string }>`
  position: absolute;
  top: 0;
  bottom: 0;
  background: ${(props) => props.$background};
  border-radius: 4px;
`;

const RangeHandle = styled.div<{
  $width: string;
  $height: string;
  $background: string;
}>`
  position: absolute;
  top: -8px;
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  background: ${(props) => props.$background};
  border-radius: 50%;
  cursor: grab;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }

  &:focus {
    transform: scale(1.2);
  }
`;

export default RangeSlider;
