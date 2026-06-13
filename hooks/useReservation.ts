import { ReservationApi } from "@/apis/ReservationsApi";
import { useBase } from "./useBase";

export class useReservation extends useBase {
	constructor() {
		super(ReservationApi, "reservations");
	}
}
