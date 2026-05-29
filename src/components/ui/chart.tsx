import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

type ChartPayload = {
  color?: string;
  dataKey?: string | number;
  name?: string | number;
  value?: unknown;
  payload?: Record<string, unknown>;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

type ChartContainerProps = React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
};

export function ChartContainer({ id, className = '', children, config, style, ...props }: ChartContainerProps) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;
  const chartVars = Object.entries(config).reduce((vars, [key, item]) => {
    if (item.color) {
      vars[`--color-${key}`] = item.color;
    }

    return vars;
  }, {} as React.CSSProperties & Record<string, string>);

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={`chart-container ${className}`}
        style={{ ...chartVars, ...style }}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = RechartsPrimitive.Tooltip;
export const ChartLegend = RechartsPrimitive.Legend;

type ChartTooltipContentProps = {
  active?: boolean;
  payload?: ChartPayload[];
  label?: React.ReactNode;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'dot' | 'line' | 'dashed';
  labelKey?: string;
  nameKey?: string;
};

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  hideIndicator = false,
  indicator = 'dot',
  labelKey,
  nameKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  const tooltipLabel = getPayloadLabel(config, payload[0], labelKey) || label;

  return (
    <div className="chart-tooltip">
      {!hideLabel && tooltipLabel ? <div className="chart-tooltip-label">{tooltipLabel}</div> : null}
      <div className="chart-tooltip-list">
        {payload.map((item) => {
          const key = getPayloadKey(item, nameKey);
          const itemConfig = key ? config[key] : undefined;
          const color = String(item.color || item.payload?.fill || itemConfig?.color || 'var(--color-primary)');
          const name = itemConfig?.label || item.name || key;

          return (
            <div className="chart-tooltip-item" key={`${item.dataKey || item.name}`}>
              {!hideIndicator && (
                <span
                  className={`chart-tooltip-indicator ${indicator}`}
                  style={{ backgroundColor: indicator === 'dot' ? color : undefined, borderColor: color }}
                />
              )}
              <span>{name}</span>
              <strong>{formatTooltipValue(item.value)}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type ChartLegendContentProps = React.ComponentProps<'div'> & {
  payload?: Array<{ value?: string; color?: string; dataKey?: string }>;
  nameKey?: string;
};

export function ChartLegendContent({ payload, nameKey, className = '' }: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div className={`chart-legend ${className}`}>
      {payload.map((item) => {
        const key = nameKey ? String(item[nameKey as keyof typeof item] || item.value || '') : String(item.dataKey || item.value || '');
        const itemConfig = config[key];

        return (
          <div className="chart-legend-item" key={key}>
            <span style={{ backgroundColor: item.color || itemConfig?.color }} />
            {itemConfig?.label || item.value}
          </div>
        );
      })}
    </div>
  );
}

function getPayloadKey(item: ChartPayload, key?: string) {
  if (key && item.payload && key in item.payload) return String(item.payload[key]);
  return String(item.dataKey || item.name || '');
}

function getPayloadLabel(config: ChartConfig, item: ChartPayload, key?: string) {
  if (!key || !item.payload || !(key in item.payload)) return undefined;
  const value = String(item.payload[key]);
  return config[value]?.label || value;
}

function formatTooltipValue(value: unknown) {
  if (typeof value === 'number') return new Intl.NumberFormat('en-US').format(value);
  return String(value ?? '');
}
