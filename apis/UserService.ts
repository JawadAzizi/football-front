import { ApiResponse, PaginatedResponse, QueryParams } from "@/utils/Axios";
import { BaseApi } from "./BaseApi";

  
  // Example usage: User API extending BaseService - Much cleaner now!
  export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateUser {
    name: string;
    email: string;
    password: string;
    role?: string;
  }
  
  export interface UpdateUser {
    name?: string;
    email?: string;
    role?: string;
  }
  
  export class UserApi extends BaseApi<User, CreateUser, UpdateUser> {
    constructor() {
      super('/users'); // Only pass the endpoint!
    }
  
    // Custom method: Get user profile
    async getProfile(): Promise<User> {
      const response = await this.client.get<ApiResponse<User>>('/users/profile');
      return response.data.data;
    }
  
    // Custom method: Update user password
    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
      await this.client.post('/users/change-password', {
        oldPassword,
        newPassword,
      });
    }
  
    // Custom method: Search users by email
    async searchByEmail(email: string): Promise<User[]> {
      const response = await this.client.get<ApiResponse<User[]>>('/users/search', {
        params: { email },
      });
      return response.data.data;
    }
  
    // Custom method: Get users by role
    async getByRole(role: string, params?: QueryParams): Promise<PaginatedResponse<User>> {
      const response = await this.client.get<ApiResponse<PaginatedResponse<User>>>(
        `/users/role/${role}`,
        { params }
      );
      return response.data.data;
    }
  }
  
  
  