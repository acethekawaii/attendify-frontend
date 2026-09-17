import { ServiceComparison } from '@/app/core/mocks/service-comparison';
import {
  wrapCategoryLabel,
  xAxisDensity,
  toGroupedBarView,
  toAreaChartView,
} from './to-apex';

describe('dashboard chart mapping', () => {
  describe('xAxisDensity', () => {
    it('uses monthly ticks for a year-long range', () => {
      expect(xAxisDensity(new Date('2025-01-01'), new Date('2025-12-31'))).toBe('month');
    });

    it('uses weekly ticks for a two-month range', () => {
      expect(xAxisDensity(new Date('2025-09-01'), new Date('2025-11-01'))).toBe('week');
    });

    it('uses daily ticks for a short range', () => {
      expect(xAxisDensity(new Date('2025-11-01'), new Date('2025-11-16'))).toBe('day');
    });
  });

  describe('wrapCategoryLabel', () => {
    it('keeps the church name and wraps the Sunday Service suffix', () => {
      expect(wrapCategoryLabel('LTHMI Recto Sunday Service')).toBe('LTHMI Recto\nSunday Service');
    });
  });

  describe('toAreaChartView', () => {
    it('maps ngx-charts series onto aligned category values', () => {
      const view = toAreaChartView(
        [
          {
            name: 'Sunday Service',
            series: [
              { name: 'Jan 5, 2025', value: 120 },
              { name: 'Jan 12, 2025', value: 140 },
            ],
          },
        ],
        { start: new Date('2025-01-01'), end: new Date('2025-01-20') },
      );

      expect(view.chart.type).toBe('area');
      expect(view.xaxis.type).toBe('category');
      expect(view.xaxis.categories).toEqual(['Jan 5', 'Jan 12']);
      expect(view.series[0].name).toBe('Sunday Service');
      expect(view.series[0].data).toEqual([120, 140]);
      expect(view.legend.show).toBeFalse();
    });

    it('buckets a year of Sundays into one point per month', () => {
      const series: { name: string; value: number }[] = [];
      const day = new Date(2025, 0, 5);
      while (day.getFullYear() === 2025) {
        series.push({
          name: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          value: 100,
        });
        day.setDate(day.getDate() + 7);
      }

      const view = toAreaChartView(
        [{ name: 'Sunday Service', series }],
        { start: new Date('2025-01-01'), end: new Date('2025-12-31') },
      );

      expect(view.series[0].data).toEqual([100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]);
      expect(view.xaxis.categories).toEqual([
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ]);
    });
  });

  describe('toGroupedBarView', () => {
    it('uses years as series so the legend is not titled Church', () => {
      const view = toGroupedBarView(ServiceComparison);

      expect(view.series.map((series) => series.name)).toEqual(['2023', '2024', '2025']);
      expect(view.xaxis.categories).toEqual([
        'LTHMI Recto\nSunday Service',
        'LTHMI Japan\nSunday Service',
        'LTHMI Bicol\nSunday Service',
      ]);
      expect(view.legend.show).toBeTrue();
      expect((view.legend as { title?: unknown }).title).toBeUndefined();
      expect(view.series[0].data[1]).toBeNull();
    });
  });
});
