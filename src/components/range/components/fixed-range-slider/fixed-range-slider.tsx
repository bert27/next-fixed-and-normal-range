"use client";

import React, { useState, useRef } from "react";
import styles from "./fixed-range-slider.module.css";
import { RangeHandle } from "../atoms/range-handle/range-handle";

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
    <div className={styles.fixedRangeSliderWrapper}>
      <div className={styles.rangeTrack} ref={rangeRef} onClick={handleClick}>
        <div
          className={styles.rangeHighlight}
          style={{
            left: `${(minIndex / (values.length - 1)) * 100}%`,
            right: `${100 - (maxIndex / (values.length - 1)) * 100}%`,
          }}
        />
        <div
          className={styles.markersContainer}
          data-testid="markers-container"
        >
          {values.map((value, index) => (
            <div
              key={index}
              className={styles.rangeMarker}
              style={{
                left: `${(index / (values.length - 1)) * 100}%`,
              }}
              onClick={() => handleMarkerClick(index)}
            >
              <div
                className={styles.markerCircle}
                style={{
                  background:
                    index >= minIndex && index <= maxIndex ? "#2c2d3f" : "#fff",
                  border: "2px solid #000",
                }}
              />
              <span>{value.toFixed(2)} €</span>
            </div>
          ))}
        </div>
        <RangeHandle
          id="min-handle"
          type="min"
          value={minIndex}
          min={0}
          max={values.length - 1}
          label={`Minimum value`}
          position={(minIndex / (values.length - 1)) * 100}
          onDrag={handleDrag}
        />
        <RangeHandle
          id={"max-handle"}
          type="max"
          value={maxIndex}
          min={0}
          max={values.length - 1}
          label={`Maximum value`}
          position={(maxIndex / (values.length - 1)) * 100}
          onDrag={handleDrag}
        />
      </div>
      <div className={styles.rangeLabels}>
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
      </div>
    </div>
  );
};

export default FixedRangeSlider;
