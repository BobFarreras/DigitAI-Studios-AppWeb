import { AnalyticsEventDTO } from '@/types/models';

export type DailyStats = {
  date: string;
  visitors: number;
  views: number;
};

// 👇 NOUS TIPUS
export type PageStat = { path: string; views: number };
export type DeviceStat = { name: string; value: number; fill: string }; // 'fill' és pel color del gràfic
export type CountryStat = { country: string; visitors: number };

export interface IAnalyticsRepository {
  trackEvent(event: AnalyticsEventDTO): Promise<void>;
  getLast7DaysStats(): Promise<DailyStats[]>;
  // 👇 NOU MÈTODE AGREGAT
  getAdvancedStats(): Promise<{
    topPages: PageStat[];
    devices: DeviceStat[];
    countries: CountryStat[];
  }>;
}