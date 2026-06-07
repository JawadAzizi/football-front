import { BaseApi } from "./BaseApi";

// Example: Post API
export interface Saloon {
	id: number;
	title: string;
	content: string;
	authorId: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateSaloon {
	title: string;
	content: string;
	authorId: number;
}

export interface UpdateSaloon {
	title?: string;
	content?: string;
}

export class ProductApi extends BaseApi<Saloon, CreateSaloon, UpdateSaloon> {}
