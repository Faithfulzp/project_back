<template>
  <div>
    <el-form
      :inline="true"
      :model="cForm"
      class="demo-form-inline"
      :disabled="show"
    >
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in List1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" value="">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in List2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" value="">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in List3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      List1: [], // 存储一级分类数据
      List2: [], // 存储二级分类数据
      List3: [], // 存储三级分类数据
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  // 根据商品属性的显示，控制三级分类是否显5示
  props: ["show"],
  mounted() {
    this.getCategory1List();
  },
  methods: {
    // 获取一级分类的数据
    async getCategory1List() {
      let result = await this.$API.attr.reqGetCategory1List();
      if (result.code == 200) {
        this.List1 = result.data;
      } else {
        console.log("一级分类数据获取失败");
      }
    },
    // 获取二级分类的数据
    async handler1() {
      // 清空二级分类和三级分类的数据
      this.List2 = [];
      this.List3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      // 触发自定义事件将1的id和标签传到父组件，去获取数据
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category1Id,
        level: 1,
      });
      let result = await this.$API.attr.reqGetCategory2List(
        this.cForm.category1Id
      );
      if (result.code == 200) {
        this.List2 = result.data;
      } else {
        console.log("二级分类数据获取失败");
      }
    },
    // 获取三级分类的数据
    async handler2() {
      this.List3 = [];
      this.cForm.category3Id = "";
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category2Id,
        level: 2,
      });
      let result = await this.$API.attr.reqGetCategory3List(
        this.cForm.category2Id
      );
      if (result.code == 200) {
        this.List3 = result.data;
      } else {
        console.log("三级分类数据获取失败");
      }
    },
    // 传递第三级分类的id
    handler3() {
      this.$emit("getCategoryId", {
        categoryId: this.cForm.category3Id,
        level: 3,
      });
    },
  },
};
</script>

<style>
</style>