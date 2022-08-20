<template>
  <div>
    <el-table :data="skuList" style="width: 100%" border="">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="110">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(千克)" width="100">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="100">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="info"
            icon="el-icon-bottom"
            size="mini"
            v-if="row.isSale == 1"
            @click="cancelSale(row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-top"
            size="mini"
            @click="onSale(row)"
            v-else
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center; margin-top: 5px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total "
      :total="total"
    >
    </el-pagination>
    <!-- 侧边抽屉 -->
    <el-drawer :visible.sync="drawer" size="50%" :show-close="false">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="(attr, index) in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin-right: 5px"
            >{{ attr.attrName }}:{{ attr.valueName }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item
              v-for="(img, index) in skuInfo.skuImageList"
              :key="img.id"
            >
              <img :src="img.imgUrl" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      total: 30, // 数据总数
      page: 1, // 当前页码
      limit: 10, // 每页数据量
      skuList: [], // 存储sku数据
      skuInfo: {}, // 单个sku的详情数据
      drawer: false, //控制抽屉的显示与隐藏
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    // 修改当前页的数据量
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 修改页码
    handleCurrentChange(pager) {
      this.page = pager;
      this.getSkuList();
    },
    // 请求sku数据
    async getSkuList() {
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.skuList = result.data.records;
        this.total = result.data.total;
      }
    },
    // 上架商品
    async onSale(row) {
      let result = await this.$API.sku.reqOnSale(row.id);
      if (result.code) {
        // 商品上架设为1
        row.isSale = 1;
        this.$message({
          type: "success",
          message: "上架成功",
        });
      }
    },
    // 下架商品
    async cancelSale(row) {
      let result = await this.$API.sku.reqCancelSale(row.id);
      if (result.code) {
        // 商品下架设为0
        row.isSale = 0;
        this.$message({
          type: "success",
          message: "下架成功",
        });
      }
    },
    // 修改按钮
    edit() {
      this.$message("模块正在开发中...");
    },
    // 获取sku的详情信息
    async getSkuInfo(row) {
      // 显示抽屉
      this.drawer = true;
      let result = await this.$API.sku.reqSkuInfo(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
};
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-carousel__button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: pink;
}
</style>

<style scoped>
.el-col {
  margin: 10px;
}
.el-col-5 {
  font-size: 18px;
  font-weight: 700;
  text-align: right;
}
</style>