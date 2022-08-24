<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "BarCharts",
  mounted() {
    // 初始化echarts实例
    let barCharts = echarts.init(this.$refs.charts);
    // 配置数据
    barCharts.setOption({
      xAxis: {
        // 关闭x轴
        show: false,
        type: "category",
      },
      yAxis: {
        // 关闭y轴
        show: false,
      },
      series: [
        {
          type: "bar",
          data: [31, 40, 36, 75, 48, 53, 14, 24, 34, 57, 21, 76],
          color: "cyan",
        },
      ],
      // 提示信息
      tooltip: {},
      // 布局调整，把一些缝隙给去除
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>