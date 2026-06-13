import { ApiResponse, PaginatedResponse, QueryParams } from "@/utils/Axios";
import { BaseApi } from "./BaseApi";

  // Example: Post API
  export interface Slot {
    id: number;
    title: string;
    content: string;
    authorId: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateSlot {
    title: string;
    content: string;
    authorId: number;
  }
  
  export interface UpdateSlot {
    title?: string;
    content?: string;
  }
  
  export class SlotApi extends BaseApi<Slot, CreateSlot, UpdateSlot> {
    constructor() {
      super('/slots', {
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
  
  }
  