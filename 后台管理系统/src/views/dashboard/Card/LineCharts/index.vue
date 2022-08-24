<template>
  <div class="charts" ref="lineCharts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "LineCharts",
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.lineCharts);
    // 配置数据
    lineCharts.setOption({
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
          type: "line",
          data: [31, 40, 36, 75, 48, 53, 14, 24, 34],
          // 线条样式
          lineStyle: {
            color: "purple",
          },
          // 点的样式
          itemStyle: {
            // 全透明
            opacity: 0,
          },
          // 区域填充颜色设置
          areaStyle: {
            // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          // 圆滑模式
          smooth: true,
        },
      ],
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