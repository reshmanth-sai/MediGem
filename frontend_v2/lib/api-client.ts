/** Production API Client stub with clean backend integration interfaces */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/v2") {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return {
      data: {} as T,
      status: 200,
      message: `GET ${this.baseUrl}${endpoint} success`,
    };
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return {
      data: body as T,
      status: 200,
      message: `POST ${this.baseUrl}${endpoint} success`,
    };
  }
}

export const apiClient = new ApiClient();
