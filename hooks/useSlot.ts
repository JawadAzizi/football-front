import { useBase } from "./useBase";
import { SlotApi } from "@/apis/SlotApi";

export class useSlot extends useBase{
  constructor(){
    super(SlotApi, "slots" )
  }
}