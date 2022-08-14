import request from '@/utils/request';

// 一级分类数据接口 /admin/product/getCategory1 get
export const reqGetCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'get' });
// 二级分类数据接口 /admin/product/getCategory2/{category1Id} get
export const reqGetCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' });
// 三级分类数据接口 /admin/product/getCategory3/{category2Id} get
export const reqGetCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' });
// attr三级联动搜索商品接口 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });
// 添加属性和属性值接口 /admin/product/saveAttrInfo  post  data里有attrName，各属性值和id等
export const reqAddOrUpdateAttr = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'post', data });















