<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          >添加SPU</el-button
        >
        <!-- prop中写了要展示的数据的话，就不能再写作用域插槽，否则内容不会显示 -->
        <el-table :data="spuList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除spu"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin: 20px; text-align: center"
          :current-page="page"
          :pager-count="7"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout=" prev, pager, next, jumper,->,total, sizes"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      isShowTable: true, // 控制table是否显示
      page: 1, // 初始化当前页码
      limit: 3, // 初始化每页显示数据量
      total: 0, // 存储数据总数
      spuList: [], // 存储spu数据
    };
  },
  methods: {
    // 自定义事件的回调，修改id，最后发请求，携带三个id
    getCategoryId({ categoryId, level }) {
      // 如果是一级分类的id
      if (level == 1) {
        this.category1Id = categoryId;
        // 清空后两类id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        // 清空后第三类id
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    // 获取spu数据
    async getSpuList() {
      let { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.spuList = result.data.records;
      }
    },
    // 修改每页数量，重新请求数据
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 修改页码，重新请求数据
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
  },
};
</script>

<style>
</style>