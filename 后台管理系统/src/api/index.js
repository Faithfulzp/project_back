// 将四个接口统一暴露
import * as trademark from "./product/trademark";
import * as sku from "./product/sku";
import * as spu from "./product/spu";
import * as attr from "./product/attr";

export default {
    attr,
    spu,
    sku,
    trademark
}