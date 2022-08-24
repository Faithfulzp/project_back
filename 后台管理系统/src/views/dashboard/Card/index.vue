<template>
  <div>
    <el-row :gutter="10">
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
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <lineCard></lineCard>
            </template>
            <template slot="footer">
              <span>日访问量 1262</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template slot="charts"> </template>
            <template slot="footer">
              <span>转化率 65%</span>
            </template>
          </Detail>
        </el-card> </el-col
      ><el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="76%">
            <template slot="charts"> </template>
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
import lineCard from "./LineCard";
export default {
  name: "Card",
  components: {
    Detail,
    lineCard,
  },
};
</script>

<style>
</style>