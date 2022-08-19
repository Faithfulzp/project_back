<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SPU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <!-- 因为平台属性和销售属性都不只有一个选择框，需要使用行内表单再次包裹 -->
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <!-- 收集的值value为每个属性的id和value值的id，所以用模板字符串收集 -->
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          :data="spuImageList"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column type="selection" width="50" prop="prop">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                size="mini"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
              >
                设为默认
              </el-button>
              <el-button type="success" size="mini" v-else plain
                >默认</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      imageList: [], // 暂时存储图片数据（没有isDefault）
      spuImageList: [], // 存储图片信息
      spuSaleAttrList: [], //存储销售属性
      attrInfoList: [], //存储平台属性信息
      spu: {}, //父组件给予的当前行spu数据
      // 收集sku数据
      skuInfo: {
        // 第一类：父组件传过来的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",
        // 第三类：需要自己书写代码
        // 默认图片
        skuDefaultImg: "",
        // 收集图片的字段
        skuImageList: [],
        // 收集平台属性
        skuAttrValueList: [],
        // 销售属性
        skuSaleAttrValueList: [],
      },
    };
  },
  methods: {
    // 获取skuForm数据
    async getSkuData(category1Id, category2Id, spu) {
      this.spu = spu;
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmid;
      // 请求图片数据
      let imgResult = await this.$API.spu.reqSpuImage(spu.id);
      if (imgResult.code == 200) {
        let listArr = imgResult.data;
        // 给每一个图片数据添加上一个isDefault字段，是服务器需要的
        listArr.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = listArr;
      }
      // 请求销售属性数据
      let saleResult = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (saleResult.code == 200) {
        this.spuSaleAttrList = saleResult.data;
      }
      // 请求平台信息数据
      let attrResult = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (attrResult.code == 200) {
        this.attrInfoList = attrResult.data;
      }
    },
    // 选中图片的回调,ele-ui提供的回调可以获取选中的当前行数据
    handleSelectionChange(params) {
      this.imageList = params;
    },
    // 排他思想，将其他行的isDefault都设置为0，点击的row设为1
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      // 点击设置当前行为默认
      row.isDefault = 1;
      // 收集当前默认图片的数据
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 取消
    cancel() {
      // 清除数据
      Object.assign(this._data, this.$options.data());
      this.$emit("changeSceneTo2", 0);
    },
    // 保存
    async save() {
      // 解构
      const {
        skuInfo,
        spuImageList,
        imageList,
        attrInfoList,
        spuSaleAttrList,
      } = this;
      // reduce累加器函数，每个item的返回值为上一个prev的结果，遍历完成返回的是所以prev的集合
      // 最后一个参数是指定返回的是数组
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          // 将id分解开，每一个平台属性都有一个id和一个值id
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({
            attrId,
            valueId,
          });
        }
        return prev;
      }, []);
      // 收集销售属性id
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          // 将id分解开，每一个平台属性都有一个id和一个值id
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          prev.push({
            saleAttrId,
            saleAttrValueId,
          });
        }
        return prev;
      }, []);
      // 收集图片信息
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      // 将收集数据skuInfo发送给服务器跳转
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "sku保存成功",
        });
        // 清除数据
        Object.assign(this._data, this.$options.data());
        this.$emit("changeSceneTo2", 0);
      }
    },
  },
};
</script>

<style>
</style>