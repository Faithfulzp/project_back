<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <!-- 
      :data="data"列表要展示的数据
      border：是否带有纵向边框
      align:设置单元格对齐方式
      label:设置标题内容
      width:对应列的宽度
    -->
    <el-table style="width: 100%; margin-top: 10px" border>
      <el-table-column prop="prop" label="序号" width="100px" align="center">
      </el-table-column>
      <el-table-column prop="prop" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
      </el-table-column>
    </el-table>
    <!--
      total：总条目数
      page-size:每页显示数据数
      pager-count:页码按钮的数量，连续页码数要减去-2（首页和尾页）
      current-page：当前页数
      page-sizes：每页显示个数选择器的选项设置
      layout:分页器各个组件的相对位置。->可设置靠左或者靠右
    -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :total="99"
      :page-size="3"
      :pager-count="7"
      :current-page="6"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper, ->,sizes, total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
};
</script>

<style>
</style>