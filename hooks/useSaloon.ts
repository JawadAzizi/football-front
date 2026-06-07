import { useBase } from "./useBase";
import { ProductApi } from "@/apis/SaloonApi";

export class useSaloon extends useBase {
	constructor() {
		super(new ProductApi("saloons"), "saloons");
	}
}
