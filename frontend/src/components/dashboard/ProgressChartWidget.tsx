import React from 'react';

export interface ChartDataPoint {
  label: string;
  value: number;
  max?: number;
  formattedValue?: string;
}

export interface ProgressChartWidgetProps {
  title: string;
  subtitle?: string;
  data: ChartDataPoint[];
  accentColor?: string;
}

export const ProgressChartWidget: React.FC<ProgressChartWidgetProps> = ({
  title,
  subtitle,
  data,
  accentColor = '#f36100',
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="g-glass-card p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="text-white fw-bold mb-0" style={{ fontSize: '18px' }}>
            {title}
          </h4>
          {subtitle && <small className="text-secondary text-xs">{subtitle}</small>}
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        {data.map((point, idx) => {
          const percentage = Math.min(Math.round((point.value / (point.max || maxValue)) * 100), 100);

          return (
            <div key={idx}>
              <div className="d-flex justify-content-between text-xs mb-1">
                <span className="text-secondary font-medium">{point.label}</span>
                <span className="text-white fw-bold">{point.formattedValue || point.value}</span>
              </div>
              <div className="w-full bg-dark-900 rounded-pill h-2 overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-pill transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${accentColor} 0%, #ff7a1a 100%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressChartWidget;
