import { ApiClientManager, ApiResponse, PaginatedResponse, QueryParams } from "@/utils/Axios";
import { AxiosInstance, AxiosRequestConfig } from "axios";

// Base API class with standard CRUD operations - now self-contained
export abstract class BaseApi<T = any, CreateT = Partial<T>, UpdateT = Partial<T>> {
    protected client: AxiosInstance;
    protected endpoint: string;
  
    constructor(endpoint: string) {
      this.client = ApiClientManager.getInstance().getClient();
      this.endpoint = endpoint;
    }

    /**
     * Get a single item by ID
     */
    async get(id: string | number, config?: AxiosRequestConfig): Promise<T> {
      const response = await this.client.get<ApiResponse<T>>(
        `${this.endpoint}/${id}`,
        config
      );
      return response.data.data;
    }
  
    /**
     * Get a list of items with optional query parameters
     */
    async list(params?: QueryParams, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> {
      const response = await this.client.get<ApiResponse<PaginatedResponse<T>>>(
        this.endpoint,
        {
          ...config,
          params,
        }
      );
      return response.data.data;
    }
  
    /**
     * Create a new item
     */
    async create(data: CreateT, config?: AxiosRequestConfig): Promise<T> {
      const response = await this.client.post<ApiResponse<T>>(
        this.endpoint,
        data,
        config
      );
      return response.data.data;
    }
  
    /**
     * Update an existing item by ID
     */
    async update(id: string | number, data: UpdateT, config?: AxiosRequestConfig): Promise<T> {
      const response = await this.client.put<ApiResponse<T>>(
        `${this.endpoint}/${id}`,
        data,
        config
      );
      return response.data.data;
    }
  
    /**
     * Partially update an existing item by ID
     */
    async patch(id: string | number, data: Partial<UpdateT>, config?: AxiosRequestConfig): Promise<T> {
      const response = await this.client.patch<ApiResponse<T>>(
        `${this.endpoint}/${id}`,
        data,
        config
      );
      return response.data.data;
    }
  
    /**
     * Delete an item by ID
     */
    async delete(id: string | number, config?: AxiosRequestConfig): Promise<void> {
      await this.client.delete(`${this.endpoint}/${id}`, config);
    }
  
    /**
     * Get all items without pagination (use with caution)
     */
    async getAll(config?: AxiosRequestConfig): Promise<T[]> {
      const response = await this.client.get<ApiResponse<T[]>>(
        `${this.endpoint}/all`,
        config
      );
      return response.data.data;
    }
  
    /**
     * Bulk create multiple items
     */
    async bulkCreate(items: CreateT[], config?: AxiosRequestConfig): Promise<T[]> {
      const response = await this.client.post<ApiResponse<T[]>>(
        `${this.endpoint}/bulk`,
        { items },
        config
      );
      return response.data.data;
    }
  
    /**
     * Bulk delete multiple items
     */
    async bulkDelete(ids: (string | number)[], config?: AxiosRequestConfig): Promise<void> {
      await this.client.delete(`${this.endpoint}/bulk`, {
        ...config,
        data: { ids },
      });
    }
    
  }