<script>
import { Line } from "vue-chartjs";
export default {
  extends: Line,
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      rewuired: true,
    },
  },
  data() {
    return {};
  },

  watch: {
    chartData() {
      this.$data._chart.update();
    },
  },

  methods: {},

  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
