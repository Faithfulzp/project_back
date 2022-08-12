<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addTradeMark"
      >添加</el-button
    >
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
        <!-- row获取的是一行的数据 ,$index是每行数据的索引-->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
          >
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
    <!-- 添加修改的对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 
      表单验证必须绑定：
      :model收集表单数据
      :rules表单验证规则
      ref获取表单标签
      对每个表单中的item绑定prop，prop绑定的是data中rules中的规则
    -->
      <el-form :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            autocomplete="off"
            style="width: 80%"
            v-model="tmForm.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- action:不能用v-model获取图片数据因为不是表单元素，所以用action上传图片地址 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2000kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 自定义表单验证规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌字符在2-10位"));
      } else {
        callback();
      }
    };
    return {
      page: 1, // 当前页数
      limit: 3, // 每页展示数据量
      total: 0, // 用户总量
      list: [], // 存放用户数据
      dialogFormVisible: false, // 添加品牌和修改品牌的弹窗显示与隐藏
      tmForm: {
        tmName: "", //品牌标题
        logoUrl: "", //logo地址
      },
      // 表单验证规则
      /*
      required:true 必须进行验证的字段（带红*星号）
      message：提示信息
      trigger：用户行为设置（触发验证条件），只对表单元素生效
      */
      rules: {
        // 品牌名称长度2-10
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "change" },
          // 自定义表单验证
          { validator: validateTmName },
        ],
        // 品牌的logo验证规则
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
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
    // 当页码变化时，重新发送请求
    handlePageChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    // 当每页展示数据变化时，重新发送请求
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 添加一个品牌
    addTradeMark() {
      // 点击添加要把之前的输入的数据缓存给清空
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
      this.dialogFormVisible = true;
    },
    // 修改一个品牌
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      // 将当前行数据浅拷贝给tmForm显示在当前对话框
      this.tmForm = { ...row };
    },
    // 上传图片成功后的回调：上传文件数据和展示
    handleAvatarSuccess(res, file) {
      // res和file都是上传成功后返回的图片相关数据
      this.tmForm.logoUrl = res.data;
    },
    // 上传图片之前的回调：对文件做判断
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加和修改数据点击确认后的回调：将收集的表单数据发送给服务器
    addOrUpdateTradeMark() {
      // 进行表单验证
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            // 弹出提示信息
            this.$message({
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            this.getPageList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除一个品牌
    deleteTradeMark(row) {
      this.$confirm(`删除品牌${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 重新获取数据,如果当前页删除完了要往前页跳
            this.handlePageChange(
              this.list.length > 1 ? this.page : this.page - 1
            );
            this.getPageList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>