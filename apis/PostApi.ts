import { ApiResponse, PaginatedResponse, QueryParams } from "@/utils/Axios";
import { BaseApi } from "./BaseApi";

  // Example: Post API
  export interface Post {
    id: number;
    title: string;
    content: string;
    authorId: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreatePost {
    title: string;
    content: string;
    authorId: number;
  }
  
  export interface UpdatePost {
    title?: string;
    content?: string;
  }
  
  export class PostApi extends BaseApi<Post, CreatePost, UpdatePost> {
    constructor() {
      super('/posts', {
        showAlert: true,
        logToConsole: true,
        customHandler: (error, operation) => {
          // Custom error handling for posts
          if (operation.includes('PUBLISH') && error.status === 400) {
            alert('Cannot publish post: Post content may be incomplete');
          }
        }
      });
    }
  
    // Custom method: Get posts by author
    async getByAuthor(authorId: number, params?: QueryParams): Promise<PaginatedResponse<Post>> {
      return this.executeWithErrorHandling(async () => {
        const response = await this.client.get<ApiResponse<PaginatedResponse<Post>>>(
          `/posts/author/${authorId}`,
          { params }
        );
        return response.data.data;
      }, `GET POSTS BY AUTHOR: ${authorId}`);
    }
  
    // Custom method: Publish post
    async publish(id: string | number): Promise<Post> {
      return this.executeWithErrorHandling(async () => {
        const response = await this.client.post<ApiResponse<Post>>(`${this.endpoint}/${id}/publish`);
        return response.data.data;
      }, `PUBLISH POST: ${id}`);
    }
  }
  