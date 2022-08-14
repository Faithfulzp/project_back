<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 商品主页 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- :data绑定的数据会自动遍历，每行为一个对象 -->
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加和修改商品界面 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" :model="attrInfo" ref="form" label-width="80px">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          :data="attrInfo.attrValueList"
          style="width: 100%; margin: 20px 0px"
          border
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- span和input的切换 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toUpdate(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定要删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [], //存储attr数据
      isShowTable: true, // 控制table是否显示
      // 收集新增和修改的数据，这是要一起发送给服务器的数据集
      attrInfo: {
        attrName: "", // 属性名
        attrValueList: [], // 属性值，每组属性值都是一个对象，对象里带有attrId、valueName
        categoryId: 0, // 三级分类的id
        categoryLevel: 3, //告诉服务器是第三级分类的id
      },
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
        this.getAttrList();
      }
    },
    // 携带三类id请求服务器数据
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      // 将三个id发送给api
      let result = await this.$API.attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      } else {
        console.log("attr搜索数据请求失败");
      }
    },
    // 添加属性值的回调
    addAttrValue() {
      // 往attrValueList里新增一个组属性名和id的数据对象
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 相应属性名的id
        valueName: "", //新增的属性值
        flag: true, // flag查看和修改模式的切换标记
      });
      /* 
      在push的时候添加用flag标记而不是放在data里去控制，好处：
        1、放在data中会导致所有的input同时显示和隐藏
        2、需要给每一个属性都添加flag，可以达到只控制单个属性的切换，在后面发请求的时候再在请求中把flag删除
        3、data中数组的修改和添加的数据会自动变成响应式数据
      */
      // nextTick等dom节点渲染完毕了去获取ref绑定的数字最前面的那个input节点，并获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 点击添加属性
    addAttr() {
      // 点击添加属性按钮，需要把上次添加的值给清除，同时可以获得第三级分类的id
      (this.attrInfo = {
        attrName: "", // 属性名
        attrValueList: [], // 属性值，每组属性值都是一个对象，对象里带有attrId、valueName
        categoryId: this.category3Id, // 三级分类的id
        categoryLevel: 3, //告诉服务器是第三级分类的id
      }),
        (this.isShowTable = false);
    },
    // 点击修改属性
    updateAttr(row) {
      this.isShowTable = false;
      // 将原有的属性带给修改界面
      /*
      {...row}:如果是只有一层结构的话，可以做好深拷贝，但结构中有多层，除了第一层以外的其它层就只是浅拷贝
      这里要用到深拷贝：有多层结构，简单的赋值浅拷贝的话，共用一个内存地址，
      取消修改之后，没保存的修改也会改变原来的属性值
      */
      this.attrInfo = cloneDeep(row);
      // 点击修改时，遍历数据，在每一个已有属性值上添加一个flag判断是否显示和隐藏
      this.attrInfo.attrValueList.forEach((item) => {
        // 如果是直接this.flag=false,添加的不是响应式数据，vue探测不到普通的新增
        // $set:第一个参数是需要添加属性的对象，第二个参数是添加的新的响应式属性，第三个参数是新的属性的属性值
        this.$set(item, "flag", false);
      });
    },
    // 修改->查看模式的切换
    toLook(row) {
      // 先判断输入的值是否为空/空格，是则提示用户输入
      if (row.valueName.trim() == "") {
        this.$message("输入的属性值不能为空");
        return;
      }
      // 判断是否有重复输入的值
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        // 先要排除和自己比较，除了自己意外的item去比较属性值是否相同
        if (row !== item) {
          return row.valueName.trim() == item.valueName.trim();
        }
      });
      // 如果重复则直接返回函数
      if (isRepeat) {
        return this.$message("不能重复输入相同的属性值");
      }
      row.flag = false;
    },
    // 查看->修改模式的切换
    toUpdate(row, index) {
      row.flag = true;
      /*
      ref获取input节点，index传过来的是对应点击的索引值
      当点击了span后input还没有立即出现在dom节点上，是无法立刻获得input的焦点的
      使用$nextTick等dom节点渲染完毕后再执行获取焦点
      */
      this.$nextTick(() => {
        // 因为:ref绑定的是数字，使用需要用数组形式获取点击的那个元素
        this.$refs[index].focus();
      });
    },
    // 删除属性值
    deleteAttrValue(index) {
      // 不需要发请求，直接删除数组中的元素即可
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 保存按钮的回调，保存添加和修改
    async addOrUpdateAttr() {
      // 判断如果添加的属性值为空，则不应该提交给服务器
      // flag也不应该提交给服务器
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 遍历数组每一个元素，每个满足条件的会返回true，最后所有满足条件的会加入应该新的数组
          if (item.valueName !== "") {
            delete item.flag;
            return true;
          }
        }
      );
      // 发送请求，将过滤后的数组发送给服务器
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        // 保存完毕跳转页面
        this.isShowTable = true;
        this.$message({
          type: "success",
          message: "保存成功",
        });
        // 请求成功，保存成功重新获取数据
        this.getAttrList();
      } catch (error) {
        console.log("保存失败，数据发送失败");
      }
    },
  },
};
</script>

<style>
</style>