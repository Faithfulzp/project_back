<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          placeholder="SPU描述"
          type="textarea"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片：
          action:上传图片地址，
          list-type:文件列表的类型，
          on-preview:图片预览时触发 
          on-remove:当删除图片时触发
          on-success:当图片上传成功后的回调
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            v-for="(unSelect, index) in unSelectSaleAttr"
            :key="unSelect.id"
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 10px"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
        >
          添加销售属性
        </el-button>
        <el-table
          style="width: 100%; margin-top: 10px"
          :data="spu.spuSaleAttrList"
          border
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="$event.target.blur"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpuInfo">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      // 图片预览的图片地址
      dialogImageUrl: "",
      // 控制图片预览的大图是否显示
      dialogVisible: false,
      // 收集以及存储spu信息属性
      // 在修改属性的时候，有请求回来的数据，而在添加spu的时候，没有发请求所以spu不能是空对象，需要在里面收集数据。
      spu: {
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: "",
        // spu名称
        spuName: "",
        // 品牌的id
        tmId: "",
        // 收集spu图片的信息
        spuImageList: [],
        // 平台销售属性与属性值的收集
        spuSaleAttrList: [],
      },
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储spu图片的数据
      saleAttrList: [], //存储销售属性
      attrIdAndAttrName: "", // 收集需要添加的未被选择的销售属性id和属性名name
    };
  },
  methods: {
    // upload标签删除图片的回调
    handleRemove(file, fileList) {
      // file是删除的那个图片的地址
      // fileList是删除后剩下的所有图片的信息
      // 这里需要收集删除完成后的图片数据，以后要发给服务器，但服务器不需要filelist里的name和url，所有后面需要处理
      this.spuImageList = fileList;
    },
    // upload标签查看图片的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传成功的图片的回调
    handleSuccess(response, file, fileList) {
      // response:成功的响应信息，file:上传的图片的信息，filelist：所有图片的信息
      this.spuImageList = fileList;
    },
    // 初始化修改的spu数据,发请求获取数据
    async initSpuData(spu) {
      // 获取spu信息数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        // 给每一个数组元素，添加两个file-list要求的必要属性name,url
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        // 添加完毕再存储
        this.spuImageList = listArr;
      }
      // 获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 初始化添加的spu数据,发请求获取数据
    async initAddSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 点击添加销售属性
    addSaleAttr() {
      // 获取id和销售属性名
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      // 存储服务器需要的数据
      this.spu.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      });
      // 添加成功后清空选框内容
      this.attrIdAndAttrName = "";
    },
    //属性值添加按钮的回调
    showInput(row) {
      // 获取row目的是给每一行数据都添加inputVisible来判断input框显示与隐藏，如果直row.添加就不是响应式数据，必须使用$set
      this.$set(row, "inputVisible", true);
      // 同理input的值inputValue也需要添加成响应式数据，才能进行收集
      this.$set(row, "inputValue", "");
      // 自动获取焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // el-input失去焦点后，显示的回调
    handleInputConfirm(row) {
      // 解构出销售属性中需要收集的数据
      const { inputValue, baseSaleAttrId } = row;
      // 先对添加过去的值判断是否与原有值重复
      // some是判断数组里是否有符合条件的元素，如果有则立马返回true不继续遍历，都没有则false
      let isRepeat = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName == inputValue;
      });
      if (isRepeat) {
        this.$message("输入属性值不能出现重复");
        return;
      }
      // 如果输入属性值为空，则无法添加
      if (inputValue.trim() !== "") {
        // 往原有属性里添加新的属性值对象，携带id和name
        row.spuSaleAttrValueList.push({
          baseSaleAttrId,
          saleAttrValueName: inputValue,
        });
      } else {
        // 为空则提示错误
        this.$message("输入属性值不能为空");
      }
      // 关闭input，显示添加按钮
      row.inputVisible = false;
      row.inputValue = "";
    },
    // 保存，发送收集的数据给服务器
    async addOrUpdateSpuInfo() {
      // 图片需要收集的数据只需要携带imageName和imageUrl即可
      // map可以对数组进行处理，返回值为每个元素处理后的样子
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          // 因为对于新增加的图片的url是本地url，需要使用response里的data才是服务器里的url，如果不是新增的图片就用原有url
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      // 将整理好的spu发送给服务器
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "保存成功",
        });
        // 保存完毕需要跳转到主页面即scene=0,判断是否为修改或添加
        this.$emit("changeSceneTo1", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      }
      // Object.assign可以合并对象，
      // this._data：可以操作data中的响应式数据
      // this.$option可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data, this.$options.data());
    },
    // 取消按钮
    cancel() {
      this.$emit("changeSceneTo1", {
        scene: 0,
        flag: "",
      });
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    // 未被选择的销售属性
    unSelectSaleAttr() {
      // 过滤出没被选中的销售属性还有几个
      return this.saleAttrList.filter((item) => {
        /* 判断spu里展示的销售属性中，是否与遍历的三个销售属性相等，
        如果相等则返回false表示该属性已经有，如果满足条件不相等，则表示该销售属性未被选中 */
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>