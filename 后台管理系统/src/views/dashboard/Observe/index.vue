<template>
  <el-row :gutter="10">
    <!-- 左 -->
    <el-col :span="12">
      <Search></Search>
    </el-col>
    <!-- 右 -->
    <el-col :span="12">
      <Category></Category>
    </el-col>
  </el-row>
</template>

<script>
import Search from "./Search";
import Category from "./Category";
export default {
  name: "Observe",
  components: {
    Search,
    Category,
  },
};
</script>

<style>
</style>