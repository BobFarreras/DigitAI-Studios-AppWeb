import { AnalyticsEventDTO } from '@/types/models';

export interface IAnalyticsRepository {
  trackEvent(event: AnalyticsEventDTO): Promise<void>;
  // El deixem preparat pel futur dashboard admin
  getEventsLast7Days(): Promise<AnalyticsEventDTO[]>; 
}