import { ApiResponse, PaginatedResponse, QueryParams } from "@/utils/Axios";
import { BaseApi } from "./BaseApi";

// Example: Post API
export interface Reservation {
	id: number;
	title: string;
	content: string;
	authorId: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateReservation {
	title: string;
	content: string;
	authorId: number;
}

export interface UpdateReservation {
	title?: string;
	content?: string;
}

export class ReservationApi extends BaseApi<
	Reservation,
	CreateReservation,
	UpdateReservation
> {
	constructor() {
		super("/reservations", {
			showAlert: true,
			logToConsole: true,
			customHandler: (error, operation) => {
				// Custom error handling for posts
				if (operation.includes("PUBLISH") && error.status === 400) {
					alert("Cannot publish post: Post content may be incomplete");
				}
			},
		});
	}
}
