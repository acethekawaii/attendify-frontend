import { ServiceComparison } from '@/app/core/mocks/service-comparison';
import { wrapCategoryLabel, xAxisDensity, toGroupedBarView, toAreaChartView } from './to-apex';

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
    it('maps ngx-charts series onto datetime points', () => {
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
        { start: new Date('2025-01-01'), end: new Date('2025-12-31') },
      );

      expect(view.chart.type).toBe('area');
      expect(view.xaxis.type).toBe('datetime');
      expect(view.series[0].name).toBe('Sunday Service');
      expect(view.legend.show).toBeFalse();
      const first = view.series[0].data[0] as { x: number; y: number };
      expect(first.y).toBe(120);
      expect(new Date(first.x).getFullYear()).toBe(2025);
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
