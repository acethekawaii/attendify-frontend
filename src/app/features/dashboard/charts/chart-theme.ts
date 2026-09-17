import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexNoData,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexYAxis,
} from 'ng-apexcharts';

export const CHART_SERIES_COLORS = [
  '#40B7FF',
  '#0E6FC2',
  '#90D5FF',
  '#3DBE81',
  '#365261',
] as const;

const FONT = 'Inter, system-ui, sans-serif';
const LINE = '#E2EAF1';
const INK = '#0B161E';
const INK_MUTED = '#365261';

function baseChart(type: ApexChart['type'], height: number): ApexChart {
  return {
    type,
    height,
    width: '100%',
    fontFamily: FONT,
    toolbar: { show: false },
    zoom: { enabled: false },
    selection: { enabled: false },
    animations: { enabled: false },
    parentHeightOffset: 0,
    redrawOnParentResize: true,
    redrawOnWindowResize: true,
  };
}

export function areaChart(): ApexChart {
  return baseChart('area', 360);
}

export function lineChart(): ApexChart {
  return baseChart('line', 360);
}

export function barChart(): ApexChart {
  return baseChart('bar', 380);
}

export const chartGrid: ApexGrid = {
  borderColor: LINE,
  strokeDashArray: 3,
  xaxis: { lines: { show: false } },
  yaxis: { lines: { show: true } },
  padding: { left: 8, right: 12, top: 8, bottom: 0 },
};

export const chartLegend: ApexLegend = {
  show: true,
  position: 'top',
  horizontalAlign: 'left',
  fontFamily: FONT,
  fontSize: '13px',
  fontWeight: 500,
  labels: { colors: INK_MUTED },
  markers: { size: 6, offsetX: -2 },
  itemMargin: { horizontal: 12, vertical: 4 },
};

export const hiddenLegend: ApexLegend = {
  ...chartLegend,
  show: false,
};

export const chartStroke: ApexStroke = {
  curve: 'smooth',
  width: 2.5,
};

export const areaFill: ApexFill = {
  type: 'gradient',
  gradient: {
    shadeIntensity: 0.2,
    opacityFrom: 0.42,
    opacityTo: 0.04,
    stops: [0, 100],
  },
};

export const barFill: ApexFill = {
  type: 'solid',
  opacity: 1,
};

export const chartDataLabels: ApexDataLabels = {
  enabled: false,
};

export const chartMarkers: ApexMarkers = {
  size: 0,
  strokeWidth: 0,
  hover: { size: 5, sizeOffset: 2 },
};

export const attendeesAxis: ApexYAxis = {
  min: 0,
  decimalsInFloat: 0,
  labels: {
    style: { colors: INK_MUTED, fontSize: '12px', fontFamily: FONT },
    formatter: (value) => Math.round(value).toLocaleString('en-US'),
  },
  title: {
    text: 'Attendees',
    style: { color: INK_MUTED, fontSize: '12px', fontFamily: FONT, fontWeight: 500 },
  },
};

export const chartTooltip: ApexTooltip = {
  shared: true,
  intersect: false,
  theme: 'light',
  style: { fontSize: '13px', fontFamily: FONT },
  y: {
    formatter: (value) =>
      value == null ? '—' : `${Math.round(value).toLocaleString('en-US')} attendees`,
  },
};

export const barPlotOptions: ApexPlotOptions = {
  bar: {
    horizontal: false,
    columnWidth: '52%',
    borderRadius: 6,
    borderRadiusApplication: 'end',
    borderRadiusWhenStacked: 'last',
  },
};

export const noChartData = (text: string): ApexNoData => ({
  text,
  align: 'center',
  style: { color: INK_MUTED, fontSize: '14px', fontFamily: FONT },
});

export const chartInk = { ink: INK, muted: INK_MUTED, line: LINE };
