// src/types/models.ts (Ampliació)

import { Database } from './database.types';

// Tipus base de les taules
type TestCampaign = Database['public']['Tables']['test_campaigns']['Row'];
type TestTask = Database['public']['Tables']['test_tasks']['Row'];
type TestResult = Database['public']['Tables']['test_results']['Row'];

// 1. Tipus per a la Campanya amb les Tasques (Nested)
export type CampaignWithTasks = TestCampaign & {
  test_tasks: TestTask[]; // La relació es diu com la taula normalment
};

// 2. Tipus per al Repositori (Campaign + Context)
export type CampaignContext = {
  campaign: TestCampaign | null;
  tasks: TestTask[];
  results: TestResult[];
};