<template>
  <v-container fluid>
    <grid-layout
      :layout.sync="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
      :autoSize="false"
      :responsive="false"
    >
      <grid-item
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        @moved="movedEvent('layout', item.id, item.x, item.y)"
        @resized="resizedEvent('layout', item.id, item.h, item.w)"
      >
        <Chart
          v-if="checkId(item.i) == 'stonk'"
          ref="chart"
          :item="item"
          class="chart"
        />
        <CurrentPrice
          v-if="checkId(item.i) == 'price'"
          ref="currentPrice"
          :item="item"
          class="currentPrice"
        />
        <NewsFeed
          v-if="checkId(item.i) == 'news'"
          ref="newsfeed"
          :item="item"
          class="newsfeed"
          :width="item.w * 36"
          :height="item.h * 92"
        />
      </grid-item>
    </grid-layout>
  </v-container>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import ChartCard from "../components/ChartCard";
import { db } from "@/firebase";
import CurrentPrice from "./CurrentPrice.vue";
import NewsFeed from "./NewsFeed";

export default {
  name: "Grid",

  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    Chart: ChartCard,
    CurrentPrice,
    NewsFeed,
  },

  data() {
    return {};
  },

  computed: {
    layout() {
      return this.$store.state.layout;
    },
    stonks() {
      return this.$store.state.stonks;
    },
  },

  methods: {
    async movedEvent(collection, i, newX, newY) {
      const itemRef = db.collection(`${collection}`).doc(i);

      await itemRef.update({ x: newX, y: newY });
    },

    async resizedEvent(collection, i, newH, newW) {
      const itemRef = db.collection(`${collection}`).doc(i);

      await itemRef.update({ h: newH, w: newW });
    },

    checkId(id) {
      let splitId = id.split("-");
      return splitId[0];
    },
  },

  mounted() {
    this.$store.dispatch("getStonksData");
    this.$store.dispatch("getLayout");
  },
};
</script>

<style scoped>
.vue-grid-layout {
  max-height: 97vh !important;
  height: 97vh !important;
}

.vue-grid-item {
  touch-action: none;
}

.vue-grid-item.vue-grid-placeholder {
  background: grey;
  opacity: 0.2;
  transition-duration: 100ms;
  z-index: 2;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
  border: 1px solid grey;
}

.vue-grid-item.vue-resizable-handle {
  color: grey;
}

.vue-grid-item.closeIcon {
  text-align: right;
}

.chart {
  margin-top: 0.75rem;
}

.vue-grid-item {
  overflow: auto;
}

.newsfeed {
  height: 100%;
  width: 100%;
  padding: 2rem;
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.2), 0px 0px 50px rgba(0, 0, 0, 0.2);
}

.curentPrice {
  height: 100%;
  width: 100%;
}
</style>
