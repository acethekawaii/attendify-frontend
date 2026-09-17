export interface NamedValue {
  name: string;
  value: number;
}

export interface NamedSeries {
  name: string;
  series: NamedValue[];
}

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export type XAxisDensity = 'month' | 'week' | 'day';
