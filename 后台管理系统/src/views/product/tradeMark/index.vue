<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <!-- 
      :data="data"列表要展示的数据
      border：是否带有纵向边框
      align:设置单元格对齐方式
      label:设置标题内容
      width:对应列的宽度
      每个el-table-column是一列数据
    -->
    <el-table style="width: 100%; margin-top: 10px" border :data="list">
      <el-table-column type="index" label="序号" width="100px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width">
        <!-- row获取的是整个data数据 -->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini">
            修改
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
      total：总条目数
      page-size:每页显示数据数
      pager-count:页码按钮的数量，连续页码数要减去-2（首页和尾页）
      current-page：当前页数
      page-sizes：每页显示个数选择器的选项设置
      layout:分页器各个组件的相对位置。->可设置靠左或者靠右
      @current-change="" :当页数发生变化是调用方法，自动会传入参数pager（当前页）
      @size-change="":当每页展示数据量变化是调用，自动会传入参数limit（每页展示数据量）
    -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :total="total"
      :page-size="limit"
      :pager-count="7"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper, ->,sizes, total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      page: 1, // 当前页数
      limit: 3, // 每页展示数据量
      total: 0, // 用户总量
      list: [], // 存放用户数据
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    // 获取数据
    async getPageList() {
      const { limit, page } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.list = result.data.records;
        this.total = result.data.total;
      } else {
        console.log("trademark请求数据失败");
      }
    },
    handlePageChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
  },
};
</script>

<style>
</style>