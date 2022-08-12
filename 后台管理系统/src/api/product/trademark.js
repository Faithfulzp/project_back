// 引入request请求
import request from "@/utils/request";
// 获取品牌列表接口 /admin/product/baseTrademark/{page}/{limit}   get
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });
// 新增品牌 /admin/product/baseTrademark/save   post 携带两个参数：品牌名称，品牌logo
// 修改品牌 /admin/product/baseTrademark/update   put 携带三个参数：id,品牌名称，品牌logo
export const reqAddOrUpdateTradeMark = (data) => {
    // 如果有id则发送的修改请求，否则发送添加请求
    if (data.id) {
        return request({ url: `/admin/product/baseTrademark/update`, method: 'put', data });
    } else {
        return request({ url: `/admin/product/baseTrademark/save`, method: 'post', data });
    }
}
// 删除品牌
// /admin/product/baseTrademark/remove/{id}  delete
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' });







