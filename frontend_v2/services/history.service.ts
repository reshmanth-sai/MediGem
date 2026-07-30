import { BaseService } from "./base.service";
import { AnalysisResponse } from "@/types/analysis";

/** Service interface for retrieving session history */
export class HistoryService extends BaseService {
  async getHistory(): Promise<AnalysisResponse[]> {
    return this.client.get<AnalysisResponse[]>("/history");
  }
}

export const historyService = new HistoryService();
