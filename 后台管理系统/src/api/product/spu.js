import request from "@/utils/request";

// 获取spu列表数据的接口 /admin/product/{page}/{limit} get 需要带的数据：page,limit,category3Id
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } });

// 根据id获取对应spu信息 /admin/product/getSpuById/{spuId} get 
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' });
// 获取品牌信息 /admin/product/baseTrademark/getTrademarkList get 
export const reqTradeMarkList = () => request({ url: "/admin/product/baseTrademark/getTrademarkList", method: 'get' });
// 获取spu图标信息 /admin/product/spuImageList/{spuId} get 
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });
// 获取平台全部销售属性 ，整个平台全部销售属性一共三个 /admin/product/baseSaleAttrList get 
export const reqBaseSaleAttrList = () => request({ url: "/admin/product/baseSaleAttrList", method: 'get' });

// 修改Spu||添加spu：区别在于，修改携带的数据需要id，添加不需要携带id
// 修改：/admin/product/updateSpuInfo post
// 添加：/admin/product/saveSpuInfo post
export const reqAddOrUpdateSpu = (data) => {
    if (data.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data })
    } else {
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data })
    }
}
// 删除spu属性 /admin/product/deleteSpu/{spuId} delete
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' });
// 获得spu图片数据 /admin/product/spuImageList/{spuId} get
export const reqSpuImage = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });
// 获得销售属性的数据 /admin/product/spuSaleAttrList/{spuId} get
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' });
// 获得平台属性数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });
// 添加sku /admin/product/saveSkuInfo post
export const reqAddSku = (data) => request({ url: "/admin/product/saveSkuInfo", method: 'post', data });
// 获取sku列表数据的接口 /admin/product/findBySpuId/{spuId} get
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: "get" });


