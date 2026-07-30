import { BaseService } from "./base.service";
import { AnalysisResponse } from "@/types/analysis";

/** Service interface for retrieving session history */
export class HistoryService extends BaseService {
  async getHistory(): Promise<AnalysisResponse[]> {
    const res = await this.client.get<AnalysisResponse[]>("/history");
    return res.data;
  }
}

export const historyService = new HistoryService();
