"use client";

import React, { useState, useRef } from "react";
import styled from "styled-components";
import { addEventListeners, removeEventListeners } from "./utils";

interface FixedRangeSliderProps {
  values: number[];
}

const FixedRangeSlider: React.FC<FixedRangeSliderProps> = ({ values }) => {
  const [minIndex, setMinIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(values.length - 1);
  const rangeRef = useRef<HTMLDivElement>(null);

  const handleDrag = (event: MouseEvent | TouchEvent, type: "min" | "max") => {
    if (!rangeRef.current) return;

    const clientX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;

    const rect = rangeRef.current.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;
    const newIndex = Math.round(percent * (values.length - 1));

    if (type === "min") {
      if (newIndex >= maxIndex || newIndex < 0) return;
      setMinIndex(newIndex);
    } else {
      if (newIndex <= minIndex || newIndex >= values.length) return;
      setMaxIndex(newIndex);
    }
  };

  const handleMouseOrTouchDown = (type: "min" | "max") => {
    const moveHandler = (event: MouseEvent | TouchEvent) =>
      handleDrag(event, type);
    const upHandler = () => {
      removeEventListeners(moveHandler, upHandler);
    };

    addEventListeners(moveHandler, upHandler);
  };

  const handleMarkerClick = (index: number) => {
    const distanceToMin = Math.abs(index - minIndex);
    const distanceToMax = Math.abs(index - maxIndex);

    if (distanceToMin < distanceToMax) {
      if (index < maxIndex) {
        setMinIndex(index);
      }
    } else {
      if (index > minIndex) {
        setMaxIndex(index);
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!rangeRef.current) return;

    const rect = rangeRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newIndex = Math.round(percent * (values.length - 1));

    const distanceToMin = Math.abs(newIndex - minIndex);
    const distanceToMax = Math.abs(newIndex - maxIndex);

    if (distanceToMin < distanceToMax) {
      if (newIndex < maxIndex) {
        setMinIndex(newIndex);
      }
    } else {
      if (newIndex > minIndex) {
        setMaxIndex(newIndex);
      }
    }
  };

  return (
    <FixedRangeSliderWrapper>
      <RangeTrack ref={rangeRef} onClick={handleClick}>
        <RangeHighlight
          style={{
            left: `${(minIndex / (values.length - 1)) * 100}%`,
            right: `${100 - (maxIndex / (values.length - 1)) * 100}%`,
          }}
        />
        <MarkersContainer data-testid="markers-container">
          {values.map((value, index) => (
            <RangeMarker
              key={index}
              style={{
                left: `${(index / (values.length - 1)) * 100}%`,
              }}
              onClick={() => handleMarkerClick(index)}
            >
              <MarkerCircle
                style={{
                  background:
                    index >= minIndex && index <= maxIndex ? "#2c2d3f" : "#fff",
                  border:
                    index >= minIndex && index <= maxIndex
                      ? "2px solid #000"
                      : "2px solid #000",
                }}
              />
              <span>{value.toFixed(2)} €</span>
            </RangeMarker>
          ))}
        </MarkersContainer>
        <RangeHandle
          data-testid="min-handle"
          style={{
            left: `${(minIndex / (values.length - 1)) * 100}%`,
            transform: `translateX(-89%)`,
          }}
          onMouseDown={() => handleMouseOrTouchDown("min")}
          onTouchStart={() => handleMouseOrTouchDown("min")}
        />
        <RangeHandle
          data-testid="max-handle"
          style={{
            left: `${(maxIndex / (values.length - 1)) * 100}%`,
            transform: `translateX(-89%)`,
          }}
          onMouseDown={() => handleMouseOrTouchDown("max")}
          onTouchStart={() => handleMouseOrTouchDown("max")}
        />
      </RangeTrack>
      <RangeLabels>
        <span>
          {values.length > 0
            ? `Min: ${values[minIndex].toFixed(2)} €`
            : "Min: -"}
        </span>
        <span>
          {values.length > 0
            ? `Max: ${values[maxIndex].toFixed(2)} €`
            : "Max: -"}
        </span>
      </RangeLabels>
    </FixedRangeSliderWrapper>
  );
};

const FixedRangeSliderWrapper = styled.div`
  width: 90%;
  position: relative;
  height: 60px;
  margin: auto;
`;

const RangeTrack = styled.div`
  width: 100%;
  height: 4px;
  background: #bebec4;
  position: relative;
  border-radius: 2px;
  margin: 20px 0;
`;

const RangeHighlight = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  background: #2c2d3f;
  border-radius: 2px;
`;

const MarkersContainer = styled.div`
  position: absolute;
  top: -7px;
  width: 100%;
`;

const RangeMarker = styled.div`
  position: absolute;
  transform: translateX(-50%);
  text-align: center;
  cursor: pointer;

  span {
    display: block;
    margin-top: 8px; /* Ajusta el valor según lo necesites */
    font-size: 12px; /* Opcional: ajusta el tamaño del texto */
  }
`;

const MarkerCircle = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    width: 22px;
    height: 22px;
    top: -5px;
  }
`;

const RangeHandle = styled.div`
  position: absolute;
  top: -12px;
  width: 22px;
  height: 22px;
  background: #2c2d3f;
  border-radius: 50%;
  cursor: grab;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }

  &:active {
    user-select: none;
  }
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 44px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

export default FixedRangeSlider;
