<template>
  <div>
    <v-container class="fill-height" fluid>
      <v-row align-content="end" justify="end" class="menuIconRow">
        <v-icon
          large
          dark
          color="grey"
          @click.stop="drawer = !drawer"
          clas="menuIcon"
        >
          menu
        </v-icon>
      </v-row>
    </v-container>

    <v-navigation-drawer
      width="25%"
      drak
      v-model="drawer"
      absolute
      temporary
      right
    >
      <v-row align-content="end" justify="end">
        <v-icon color="grey" @click="drawer = !drawer" class="navCloseIcon"
          >close</v-icon
        >
      </v-row>
      <v-row align="center">
        <v-col cols="12">
          <v-form ref="form" v-model="valid" lazy-validation class="form">
            <v-autocomplete
              :items="items"
              dark
              outlined
              chips
              medium-chips
              label="Choos your Stonks"
              deletable-chips
              persistent-hint
              @input="limiter($event)"
            ></v-autocomplete>
            <v-checkbox
              dark
              color="grey"
              v-model="formInput.newsfeed"
              label="
              Newsfeed"
            ></v-checkbox>
            <v-checkbox
              dark
              color="grey"
              v-model="formInput.currentStonkPrice"
              label="Current Stonk Price"
            ></v-checkbox>
            <v-checkbox
              dark
              color="grey"
              v-model="formInput.stonkTrendline"
              label="Stonk Tendline"
            ></v-checkbox>
            <v-simple-table v-if="formInput.stonkTrendline" dark height="300">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Stonk</th>
                    <th class="text-left">Pick a Color</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="stonk in formInput.stonks" :key="stonk.name">
                    <td>{{ stonk.name }}</td>
                    <td>
                      <v-input>
                        <v-swatches
                          shapes="circles"
                          swatch-size="24"
                          popover-x="left"
                          popover-y="bottom"
                          v-model="stonk.color"
                        ></v-swatches>
                      </v-input>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-form>
        </v-col>
      </v-row>

      <v-btn
        dark
        elevation="10"
        medium
        raised
        @click="addItem"
        class="addStonkButton"
      >
        Add Stonk
      </v-btn>
    </v-navigation-drawer>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      Whoa! You can only choose one stonk at a time.
    </v-snackbar>
  </div>
</template>

<script>
import VSwatches from "vue-swatches";
import "vue-swatches/dist/vue-swatches.css";
import { db } from "@/firebase";

export default {
  components: { VSwatches },
  data() {
    return {
      drawer: null,
      valid: true,
      items: [
        {
          text: "Amazon",
          value: {
            name: "Amazon.com, Inc.",
            code: "AMZN",
            color: "",
            news: "Amazon",
          },
        },
        {
          text: "Apple",
          value: { name: "Apple Inc", code: "AAPL", color: "", news: "Apple" },
        },
        {
          text: "Google",
          value: {
            name: "Google Inc",
            code: "GOOGL",
            color: "",
            news: "Google",
          },
        },
        {
          text: "Tesla",
          value: { name: "Tesla Inc", code: "TSLA", color: "", news: "Tesla" },
        },
      ],
      formInput: {
        stonks: [],
        newsfeed: false,
        currentStonkPrice: false,
        stonkTrendline: false,
      },
      snackbar: false,
      timeout: 2000,
    };
  },

  computed: {
    layout() {
      return this.$store.state.layout;
    },

    index() {
      return this.$store.getters.index;
    },
  },

  methods: {
    generateString(length) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    },

    async addItem() {
      if (this.$refs.form.validate()) {
        if (this.formInput.stonkTrendline) {
          let id = `stonk-${this.generateString(5)}`;

          await db
            .collection("stonks")
            .doc(id)
            .set({ stonks: this.formInput.stonks, stonkTrendline: true });

          let newLayoutData = {
            x: (this.layout.length * 2) % (this.colNum || 12),
            y: this.layout.length + (this.colNum || 12), // puts it at the bottom
            w: 9,
            h: 14,
            i: id,
          };

          db.collection("layout").add(newLayoutData);
        }

        if (this.formInput.currentStonkPrice) {
          let id = `price-${this.generateString(5)}`;

          await db
            .collection("stonks")
            .doc(id)
            .set({ stonks: this.formInput.stonks, currentStonkPrice: true });

          let newLayoutData = {
            x: (this.layout.length * 2) % (this.colNum || 12),
            y: this.layout.length + (this.colNum || 12), // puts it at the bottom
            w: 2,
            h: 3,
            i: id,
          };

          db.collection("layout").add(newLayoutData);
        }

        if (this.formInput.newsfeed) {
          let id = `news-${this.generateString(5)}`;

          await db
            .collection("stonks")
            .doc(id)
            .set({ stonks: this.formInput.stonks, newsfeed: true });

          let newLayoutData = {
            x: (this.layout.length * 2) % (this.colNum || 12),
            y: this.layout.length + (this.colNum || 12), // puts it at the bottom
            w: 4,
            h: 10,
            i: id,
          };

          db.collection("layout").add(newLayoutData);
        }
      }
      this.reset();
      this.resetValidation();
      this.drawer = false;
    },

    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    limiter(e) {
      this.formInput.stonks = [e];
      if (e.length > 1) {
        this.snackbar = true;
        e.pop();
      }
    },
  },

  mounted() {},
};
</script>

<style scoped>
.v-navigation-drawer {
  background-color: #212121 !important;
}

.menuIconRow {
  margin-top: 1rem;
  margin-right: 2rem;
}

.navCloseIcon {
  margin-top: 1.5rem;
  margin-right: 1.5rem;
}

.form {
  margin-left: 1.5rem;
  margin-right: 1.5rem;
}

.addStonkButton {
  margin-top: 2rem;
}

.stonkTable {
  min-height: 20px;
}
</style>
