<template>
  <v-card elevation="8" class="chartCard">
    <v-row align-content="end" justify="end" class="cardCloseIconeRow">
      <v-icon
        @click="removeItem(item.i, item.id)"
        small
        color="grey"
        class="cardCloseIcon"
      >
        close
      </v-icon>
    </v-row>
    <v-row v-if="loaded" align-content="center" justify="center">
      <div class="sk-fold sk-center">
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
      </div>
    </v-row>
    <v-row
      v-if="!loaded"
      align-content="start"
      justify="start"
      class="priceRow"
    >
      <span class="stonkName">
        {{ stonk.stonks[0].name.toUpperCase() }}
      </span>
    </v-row>
    <v-row
      v-if="!loaded"
      align-content="start"
      justify="start"
      class="priceRow"
    >
      <span class="price">
        {{ currentPrice }}
      </span>
      <span class="currency">USD</span>
    </v-row>
  </v-card>
</template>

<script>
import { db } from "@/firebase";
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      loaded: false,
      currentPrice: 0,
    };
  },

  computed: {
    layout() {
      return this.$store.state.layout;
    },
    stonk() {
      return this.$store.getters.getStonkById(this.item.i);
    },
  },

  methods: {
    async removeItem(i, id) {
      const index = this.layout.map((item) => item.i).indexOf(i);
      this.layout.splice(index, 1);
      await db.collection("layout").doc(`${id}`).delete();
      this.$store.dispatch("getLayout");
      await db.collection("stonks").doc(`${i}`).delete();
      this.$store.dispatch("getLayout");
    },

    async getCurrentPrice() {
      await this.stonk.stonks.forEach((stonk) => {
        this.loaded = true;
        fetch(
          `https://finnhub.io/api/v1/quote?symbol=${stonk.code}&token=c2dpnl2ad3iefdo6h8t0`
        )
          .then((response) => response.json())
          .then((result) => {
            let stonk_price = parseFloat(result.c);
            this.currentPrice = stonk_price.toFixed(2);

            this.loaded = false;
          })
          .catch((err) => {
            console.error(err);
          });
      });
    },
  },

  mounted() {
    this.getCurrentPrice();
  },
};
</script>

<style scoped>
.chartCard {
  background-color: rgba(33, 33, 33, 0.4) !important;
  border: grey;
  height: 100%;
  color: white;
}

.cardCloseIconRow {
  margin-top: 1rem;
  margin-right: 2rem;
}

.cardCloseIcon {
  margin-top: 0.5rem;
  margin-right: 1.5rem;
}

.stonkName {
  font-size: 15px;
  color: grey;
}

.price {
  font-size: 30px;
}

.currency {
  font-size: 10px;
  color: black;
}

.priceRow {
  margin-left: 2rem;
}

.sk-fold {
  margin-top: 2rem;
  height: 20px;
  width: 20px;
}
</style>
