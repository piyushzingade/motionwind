import { ControlLabel } from "./control-label";

export function RangeControl({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const progress = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <ControlLabel htmlFor={id} value={`${value}${unit ?? ""}`}>
        {label}
      </ControlLabel>
      <input
        id={id}
        aria-label={label}
        className="studio-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--range-progress": `${progress}%` } as React.CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
