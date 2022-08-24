<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "ProgressCharts",
  mounted() {
    // 初始化echarts实例
    let progressCharts = echarts.init(this.$refs.charts);
    // 配置数据
    progressCharts.setOption({
      xAxis: {
        // 关闭x轴
        show: false,
        // 设置最大最小值
        min: 0,
        max: 100,
      },
      yAxis: {
        // 关闭y轴
        show: false,
        // 可变为横向显示
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          color: "yellowgreen",
          // 设置柱体宽度
          barWidth: 10,
          // 显示背景
          showBackground: true,
          // 设置背景样式，前提需要先显示背景showBackground
          backgroundStyle: {
            color: "#eee",
          },
          // 设置标记
          label: {
            // 显示标记
            show: true,
            // 改变标签内容
            formatter: "|",
            // 改变标签文本的位置
            position: "right",
          },
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