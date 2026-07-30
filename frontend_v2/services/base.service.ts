import { apiClient, ApiClient } from "@/lib/api-client";

/** Abstract Base Service defining client interface */
export abstract class BaseService {
  protected client: ApiClient;

  constructor(client: ApiClient = apiClient) {
    this.client = client;
  }
}
