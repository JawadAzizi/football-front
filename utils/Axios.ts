import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";

// Types for API responses
export interface ApiResponse<T = any> {
	data: T;
	message?: string;
	status: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface ApiError {
	message: string;
	status: number;
	errors?: Record<string, string[]>;
}

// Configuration for the API client
export interface ApiConfig {
	baseURL?: string;
	timeout?: number;
	headers?: Record<string, string>;
}

// Query parameters for list operations
export interface QueryParams {
	page?: number;
	limit?: number;
	sort?: string;
	order?: "asc" | "desc";
	search?: string;
	[key: string]: any;
}

// Singleton ApiClient manager
export class ApiClientManager {
	private static instance: ApiClientManager;
	private axiosInstance: AxiosInstance | null = null;

	private constructor() {}

	public static getInstance(): ApiClientManager {
		if (!ApiClientManager.instance) {
			ApiClientManager.instance = new ApiClientManager();
		}
		return ApiClientManager.instance;
	}

	public initialize(config: ApiConfig): void {
		this.axiosInstance = axios.create({
			baseURL: config.baseURL || "http://localhost:8000/api",
			timeout: config.timeout || 10000,
			headers: {
				"Content-Type": "application/json, multipart/from-dat",
				...config.headers,
			},
		});

		this.setupInterceptors();
	}

	public getClient(): AxiosInstance {
		if (!this.axiosInstance) {
			throw new Error(
				"ApiClient not initialized. Call ApiClientManager.initialize() first."
			);
		}
		return this.axiosInstance;
	}

	public updateConfig(config: Partial<ApiConfig>): void {
		if (!this.axiosInstance) {
			throw new Error(
				"ApiClient not initialized. Call ApiClientManager.initialize() first."
			);
		}

		if (config.baseURL) {
			this.axiosInstance.defaults.baseURL = config.baseURL;
		}
		if (config.timeout) {
			this.axiosInstance.defaults.timeout = config.timeout;
		}
		if (config.headers) {
			this.axiosInstance.defaults.headers = {
				...this.axiosInstance.defaults.headers,
				...config.headers,
			};
		}
	}

	public setAuthToken(token: string): void {
		if (!this.axiosInstance) {
			throw new Error(
				"ApiClient not initialized. Call ApiClientManager.initialize() first."
			);
		}
		this.axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
	}

	public removeAuthToken(): void {
		if (!this.axiosInstance) {
			throw new Error(
				"ApiClient not initialized. Call ApiClientManager.initialize() first."
			);
		}
		delete this.axiosInstance.defaults.headers.Authorization;
	}

	private setupInterceptors(): void {
		if (!this.axiosInstance) return;

		// Request interceptor
		this.axiosInstance.interceptors.request.use(
			(config) => {
				// Add auth token if available and not already set
				if (!config.headers.Authorization) {
					const token = this.getAuthToken();
					if (token) {
						config.headers.Authorization = `Bearer ${token}`;
					}
				}

				console.log(
					`[API Request] ${config.method?.toUpperCase()} ${config.url}`
				);
				return config;
			},
			(error) => {
				console.error("[API Request Error]", error);
				return Promise.reject(error);
			}
		);

		// Response interceptor
		this.axiosInstance.interceptors.response.use(
			(response: AxiosResponse) => {
				console.log(`[API Response] ${response.status} ${response.config.url}`);
				return response;
			},
			(error) => {
				console.error(
					"[API Response Error]",
					error.response?.data || error.message
				);

				// Handle common HTTP errors
				if (error.response?.status === 401) {
					this.handleUnauthorized();
				}
				toast.error(error.response?.data?.message || "An error occurred", {id: this.axiosInstance?.getUri()})

				return Promise.reject(this.formatError(error));
			}
		);
	}

	private getAuthToken(): string | null {
		// Implement your token retrieval logic here
		return localStorage.getItem("auth_token") || null;
	}

	private handleUnauthorized(): void {
		// Implement unauthorized handling (e.g., redirect to login)
		console.warn("Unauthorized access - token may be expired");
		// localStorage.removeItem('auth_token');
		// window.location.href = '/login';
	}

	private formatError(error: any): ApiError {
		if (error.response) {
			return {
				message: error.response.data?.message || "An error occurred",
				status: error.response.status,
				errors: error.response.data?.errors,
			};
		} else if (error.request) {
			return {
				message: "Network error - please check your connection",
				status: 0,
			};
		} else {
			return {
				message: error.message || "Unknown error occurred",
				status: 0,
			};
		}
	}
}

// Initialize the API client (call this once in your app)
export const initializeApiClient = (config: ApiConfig): void => {
	ApiClientManager.getInstance().initialize(config);
};

// Utility functions for API client management
export const setAuthToken = (token: string): void => {
	ApiClientManager.getInstance().setAuthToken(token);
};

export const removeAuthToken = (): void => {
	ApiClientManager.getInstance().removeAuthToken();
};

export const updateApiConfig = (config: Partial<ApiConfig>): void => {
	ApiClientManager.getInstance().updateConfig(config);
};


initializeApiClient({});