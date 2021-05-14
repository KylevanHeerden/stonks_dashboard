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
    <v-row v-if="!loaded" align-content="center" justify="center">
      <LineGraph
        ref="lineGraph"
        v-if="!loaded"
        :options="this.options"
        :chartData="this.data"
        class="wrapper"
      />
    </v-row>
  </v-card>
</template>

<script>
import LineGraph from "../components/LineGraph";
import { db } from "@/firebase";
export default {
  components: { LineGraph },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      loaded: false,
      options: {
        responsive: true,
        elements: {
          point: {
            radius: 0,
          },
          maintainAspectRatio: false,
        },
        scales: {
          x: {
            type: "time",
          },
          xAxes: [
            {
              display: true,
              color: "#757575",
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "USD",
              },
            },
          ],
        },
      },

      data: {
        labels: [],
        datasets: [],
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
    newWidth() {
      return this.item.w * 92;
    },
    newHeight() {
      return this.item.h * 35;
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

    async createGraphData(retries) {
      await this.stonk.stonks.forEach((stonk) => {
        this.loaded = true;
        fetch(
          `https://www.quandl.com/api/v3/datasets/WIKI/${stonk.code}/data.json?start_date=2018-01-27&api_key=ax4GtAc9jt9C1Fu6-p9X`
        )
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            if (retries > 0) {
              return this.createGraphData(retries - 1);
            } else {
              throw new Error(response);
            }
          })
          .then((result) => {
            let values = result.dataset_data.data;
            let dateArray = [];
            let closeArray = [];

            values.forEach((value) => {
              dateArray.push(value[0]);
            });

            values.forEach((value) => {
              closeArray.push(parseFloat(value[4]));
            });

            this.data.labels = dateArray.reverse();

            let lineData = {
              label: `${stonk.name}`,
              data: closeArray.reverse(),
              borderColor: `${stonk.color}`,
            };

            this.data.datasets.push(lineData);

            this.loaded = false;
          })
          .catch((err) => {
            console.error(err);
          });
      });
    },
  },

  mounted() {
    this.createGraphData(3);
  },
};
</script>

<style scoped>
.chartCard {
  background-color: rgba(33, 33, 33, 0.4) !important;
  border: grey;
  height: 100%;
}

.cardCloseIconRow {
  margin-top: 1rem;
  margin-right: 2rem;
}

.cardCloseIcon {
  margin-top: 0.5rem;
  margin-right: 1.5rem;
}

.wrapper {
  position: relative;
  height: 90%;
  width: 90%;
}

.sk-fold {
  margin-top: 6rem;
  height: 50px;
  width: 50px;
}
</style>
