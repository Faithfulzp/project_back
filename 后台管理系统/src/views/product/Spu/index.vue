<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- spu列表数据 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          :disabled="!category3Id"
          @click="addSpu"
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
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
              ></el-button>
              <el-popconfirm title="确定删除吗？" @onConfirm="deleteSpu(row)">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                  style="margin-left: 10px"
                ></el-button>
              </el-popconfirm>
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
      <!-- 添加修改Spu -->
      <SpuForm
        v-show="scene == 1"
        @changeSceneTo1="changeSceneTo1"
        ref="spu"
      ></SpuForm>
      <!-- 添加Sku -->
      <SkuForm
        v-show="scene == 2"
        @changeSceneTo2="changeSceneTo2"
        ref="sku"
      ></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1, // 初始化当前页码
      limit: 3, // 初始化每页显示数据量
      total: 0, // 存储数据总数
      spuList: [], // 存储spu数据
      scene: 0, // 0:代表战术SPU列表数据，1：添加SPU|修改SPU，2：添加SKU
    };
  },
  components: {
    SpuForm,
    SkuForm,
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
    // 添加SPU
    addSpu() {
      this.scene = 1;
      // 添加的时候需要初始化品牌列表和销售商品属性的数据
      this.$refs.spu.initAddSpuData(this.category3Id);
    },
    // 修改SPU，需要将当前行的spu数据传递给spuForm，通过id获取对应的spu数据
    updateSpu(row) {
      this.scene = 1;
      // ref设置在子组件标签上，可以获取子组件spuForm的方法等
      this.$refs.spu.initSpuData(row);
    },
    // spuForm改变scene的值，自定义事件回调
    changeSceneTo1({ scene, flag }) {
      this.scene = scene;
      // 改变scene后，得判断flag是修改还是添加,如果是修改则留在当前页，如果是添加则返回第一页，重新请求数据
      if (flag == "添加") {
        this.page = 1;
        this.getSpuList();
      } else {
        this.getSpuList();
      }
    },
    // skuForm改变scene的值，自定义事件回调
    changeSceneTo2(scene) {
      this.scene=scene;
    },
    // 删除spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        // 如果当前页数据删光了，则调到上一页
        if (this.spuList.length > 1) {
          this.getSpuList();
        } else {
          this.page = this.page - 1;
          this.getSpuList();
        }
      }
    },
    // 切换至商品添加sku属性
    addSku(row) {
      // 改变scene
      this.scene = 2;
      // 调用方法请求数据，将id都携带过去，row中有category3Id
      this.$refs.sku.getSkuData(this.category1Id, this.category2Id, row);
    },
  },
};
</script>

<style>
</style>