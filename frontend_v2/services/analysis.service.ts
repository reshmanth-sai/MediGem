import { BaseService } from "./base.service";
import { AnalysisResponse } from "@/types/analysis";
import { Patient } from "@/types/patient";

export interface AnalysisRequestPayload {
  requestId: string;
  patient: Patient;
  imagePath?: string;
  imageType?: string;
  notes?: string;
}

/** Service interface for executing clinical analysis against FastAPI */
export class AnalysisService extends BaseService {
  async executeAnalysis(payload: AnalysisRequestPayload): Promise<AnalysisResponse> {
    return this.client.post<AnalysisResponse>("/analyze", payload);
  }
}

export const analysisService = new AnalysisService();
