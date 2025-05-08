import { ENV } from "@/settings";
//图片前缀
const imgUrl = {
  development:
    "",
};
export const $imgUrl = imgUrl[ENV];
console.log(ENV, "当前环境");
let useAgentData = true;
const devPrev = "/liumingjin";
//socket地址
const socketConfig = {
  development: "", //刘明锦
};
export const socketUrlRoot = socketConfig[ENV];
export const useAgent = useAgentData;
export const prevProxy = ENV !== "development" ? "/api" : devPrev;
