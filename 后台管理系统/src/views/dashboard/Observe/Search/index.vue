<template>
  <el-card>
    <div slot="header" class="clearfix">
      <div class="search_header">
        <span>线上热门搜索</span>
        <!-- 右侧...的下拉框 -->
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 两个图表的数据展示 -->
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineChart title="搜索用户数"></LineChart>
        </el-col>
        <el-col :span="12">
          <LineChart title="人均搜索次数"></LineChart>
        </el-col>
      </el-row>
    </div>
    <!-- 表格数据 -->
    <el-table :data="tableList" style="width: 100%; margin-top: 15px" border>
      <el-table-column label="排名" width="80" type="index" align="center">
      </el-table-column>
      <el-table-column label="搜索关键字" width="width"> </el-table-column>
      <el-table-column label="用户数" width="width" sortable> </el-table-column>
      <el-table-column label="周涨幅" width="width" sortable> </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination layout="prev, pager, next" :total="1000" class="pagination">
    </el-pagination>
  </el-card>
</template>

<script>
import LineChart from "./LineChart";
export default {
  name: "Search",
  components: {
    LineChart,
  },
  data() {
    return {
      tableList: [{}],
    };
  },
};
</script>

<style>
.search_header {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.pagination {
  float: right;
  margin-top: 5px;
}
</style>