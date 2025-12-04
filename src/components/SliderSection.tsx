import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface SliderSectionProps {
  historyLength: number;
  value: number;
  onChange: (newIndex: number | number[]) => void;
}

const SliderSection: React.FC<SliderSectionProps> = ({
  historyLength,
  value,
  onChange,
}) => {
  const marks = {
    ...Array.from({ length: historyLength }, (_, index) => ({
      [index]: (index + 1).toString(),
    })).reduce((acc, item) => ({ ...acc, ...item }), {}),
    [historyLength]: 'Current',
  };

  return (
    <section className="w-4/5 md:w-2/5 pb-8">
      <Slider
        min={0}
        max={historyLength}
        value={value}
        onChange={onChange}
        marks={marks}
        step={null}
      />
    </section>
  );
};

export default SliderSection;
