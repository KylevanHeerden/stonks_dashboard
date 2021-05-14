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
    <v-row>
      <div class="newsTitle">{{ stonk.stonks[0].name.toUpperCase() }} NEWS</div>
    </v-row>

    <v-row v-if="loaded" align-content="center" justify="center">
      <div class="sk-fold sk-center">
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
        <div class="sk-fold-cube"></div>
      </div>
    </v-row>

    <v-row v-if="newsLength > 0" align-content="center" justify="center">
      <v-card
        dark
        elevation="9"
        height="100%"
        width="100%"
        v-for="article in news"
        :key="article.id"
        :href="article.url"
        target="_blank"
      >
        <v-card-title>
          {{ article.headline }}
        </v-card-title>
        <v-card-text>
          {{ article.summary }}
        </v-card-text>
        <v-row align-content="end" justify="end">
          <v-col cols="12" md="6">
            <v-card-text class="sourceText">
              {{ formatDate(article.datetime) }}
            </v-card-text>
          </v-col>
          <v-col cols="12" md="6">
            <v-card-text class="sourceText">
              source: '{{ article.source }}'
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
  </v-card>
</template>

<script>
import { db } from "@/firebase";
import moment from "moment";
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
      news: [],
      styleObject: {
        width: this.item.w,
        height: this.item.h,
      },
    };
  },

  computed: {
    layout() {
      return this.$store.state.layout;
    },
    stonk() {
      return this.$store.getters.getStonkById(this.item.i);
    },
    newsLength() {
      return this.news.length;
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

    async getNews() {
      await this.stonk.stonks.forEach((stonk) => {
        this.loaded = true;
        let dateNow = moment(Date.now()).format("YYYY-MM-DD");

        let date = Date.now() - 86400000 * 14;
        let dateOld = moment(date).format("YYYY-MM-DD");

        fetch(
          `https://finnhub.io/api/v1/company-news?symbol=${stonk.code}&from=${dateOld}&to=${dateNow}&token=c2dpnl2ad3iefdo6h8t0`
        )
          .then((response) => response.json())
          .then((result) => {
            this.news = result.slice(0, 20);
            this.loaded = false;
          })
          .catch((err) => {
            console.error(err);
          });
      });
    },

    formatDate(date) {
      let dateVar = new Date(date * 1000);
      let month = "0" + dateVar.getMonth();
      let day = "0" + dateVar.getDay();
      return `${dateVar.getFullYear()}-${month}-${day}`;
    },
  },

  mounted() {
    this.getNews();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=PT+Serif&display=swap");

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

.v-card {
  margin-top: 1rem;
}

.newsTitle {
  font-size: 30px;
  font-family: "PT Serif", serif;
}

.sourceText {
  color: grey;
  font-style: italic;
}

.sk-fold {
  margin-top: 5rem;
  height: 40px;
  width: 40px;
}

.sk-fold-cube {
}
</style>
