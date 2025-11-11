import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface SliderSectionProps {
  historyLength: number;
  currentIndex: number;
  onChange: (newIndex: number | number[]) => void;
}

const SliderSection: React.FC<SliderSectionProps> = ({
  historyLength,
  currentIndex,
  onChange,
}) => {
  const marks = {
    0: 'Start',
    ...Array.from({ length: historyLength - 1 }, (_, index) => ({
      [index + 1]: (index + 1).toString(),
    })).reduce((acc, item) => ({ ...acc, ...item }), {}),
    [historyLength]: 'Current',
  };

  return (
    <section className="history-slider-container">
      <Slider
        min={0}
        max={historyLength}
        value={currentIndex === -1 ? historyLength : currentIndex}
        onChange={onChange}
        marks={marks}
        step={null}
      />
    </section>
  );
};

export default SliderSection;
