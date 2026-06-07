import { PostApi } from "@/apis/PostApi";
import { useBase } from "./useBase";

export class usePost extends useBase{
  constructor(){
    super(PostApi, "posts" )
  }
}