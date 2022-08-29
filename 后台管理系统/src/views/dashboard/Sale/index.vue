<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0">
      <div slot="header" class="clearfix">
        <!-- @tab-click="handleClickTab" -->
        <!-- tab标签页内容 -->
        <el-tabs v-model="activeName" class="tabs" @tab-click="handleClickTab">
          <el-tab-pane label="销售额" name="sale"> </el-tab-pane>
          <el-tab-pane label="访问量" name="visits"></el-tab-pane>
        </el-tabs>
        <!-- 顶部右侧内容 -->
        <div class="right">
          <span @click="setDay">本日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <!--日期选择器
           v-model:绑定展示的数据
           value-format="yyyy-MM-dd":日期显示的格式
           展示的数据和格式必须一致
          -->
          <el-date-picker
            v-model="date"
            class="pickDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
        <!-- tab的内容（不放在el-tab-pane）-->
      </div>
      <div>
        <!-- v-if判断点击的tab -->
        <el-row :gutter="10">
          <el-col :span="18" class="col_18">
            <!-- echarts图表容器 -->
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6" class="col_6">
            <div style="font-size: 14px">门店{{ rankName }}排名</div>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span>肯德基</span>
                <span class="rvalue">123,223</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span>肯德基</span>
                <span class="rvalue">123,223</span>
              </li>
              <li>
                <span class="rindex">3</span>
                <span>肯德基</span>
                <span class="rvalue">123,223</span>
              </li>
              <li>
                <span>4</span>
                <span>肯德基</span>
                <span class="rvalue">123,223</span>
              </li>
              <li>
                <span>5</span>
                <span>肯德基</span>
                <span class="rvalue">123,223</span>
              </li>
              <li>
                <span>6</span>
                <span>肯德基</span>
                <span class="rvalue">123,223</span>
              </li>
              <li>
                <span>7</span>
                <span>肯德基</span>
                <span class="rvalue">123,223</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      // 排行名字
      rankName: "销售额",
      // 收集日期
      date: [],
      // 图表
      mycharts: null,
    };
  },
  mounted() {
    this.mycharts = echarts.init(this.$refs.charts);
    this.mycharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220, 212, 123, 12, 33, 44],
        },
      ],
    });
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
  },
  methods: {
    // echarts图表
    getEcharts() {},
    // tab标签页的回调
    handleClickTab() {
      // 如果不是放在el-tab-pane中的话就不需要使用nextTick
      // this.getEcharts();
    },
    // 获取本日日期
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    // 获取本周日期
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    // 获取本月日期
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    // 获取本年日期
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
  watch: {
    title() {
      // tab标签页改变，判断标签页name，并获取已经存在的初始化过的配置,修改其中的数据，再重新进行配置可以避免每切换tab都要初始化echarts
      if (this.activeName == "visits") {
        this.rankName = "访问量";
        this.mycharts.setOption({
          title: {
            text: this.title+'趋势',
          },
          series: [
            {
              data: [100, 152, 233, 334, 350, 497, 226, 252, 133, 42, 13, 74],
            },
          ],
        });
      }
      if (this.activeName == "sale") {
        this.rankName = "销售额";
        this.mycharts.setOption({
          title: {
            text: this.title+'趋势',
          },
          series: [
            {
              data: [10, 52, 200, 334, 390, 330, 220, 212, 123, 12, 33, 44],
            },
          ],
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// 深度选择器去除ele-ui tabs的默认边框
::v-deep .el-card__header {
  border-bottom: none;
}
// 顶部样式
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tabs {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.right span {
  font-size: 14px;
  margin: 0 10px;
}
// 日期选择样式
.pickDate {
  width: 250px;
  margin: 0 20px;
}
// 图表样式
.col_18 {
  height: 300px;
}
// 必须设置长宽
.charts {
  width: 100%;
  height: 100%;
}
// 排行榜样式
.col_6 ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
.col_6 ul li {
  height: 14%;
}
.col_6 ul li span {
  margin-right: 40px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
</style> 