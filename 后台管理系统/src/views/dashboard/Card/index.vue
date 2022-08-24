<template>
  <div>
    <el-row :gutter="10">
      <!-- 第一个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥ 126560">
            <template slot="charts">
              <span>周同比 56.67%</span>
              <i class="el-icon-caret-top" style="color: rgb(225, 54, 20)"></i>
              <span>日同比 19.16%</span>
              <i
                class="el-icon-caret-bottom"
                style="color: rgb(37, 207, 56)"
              ></i>
            </template>
            <template slot="footer">
              <span>日销售额￥ 12612</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第二个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <LineCharts></LineCharts>
            </template>
            <template slot="footer">
              <span>日访问量 1262</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第三个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <BarCharts></BarCharts>
            </template>
            <template slot="footer">
              <span>转化率 65%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第四个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="76%">
            <template slot="charts">
              <ProgressCharts></ProgressCharts>
            </template>
            <template slot="footer">
              <span>周同比 12%</span>
              <i class="el-icon-caret-top" style="color: rgb(225, 54, 20)"></i>
              <span>日同比 11%</span>
              <i
                class="el-icon-caret-bottom"
                style="color: rgb(37, 207, 56)"
              ></i>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import LineCharts from "./LineCharts";
import BarCharts from "./BarCharts";
import ProgressCharts from "./ProgressCharts";
export default {
  name: "Card",
  components: {
    Detail,
    LineCharts,
    BarCharts,
    ProgressCharts,
  },
};
</script>

<style>
</style>