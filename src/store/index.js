import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    layout: [],
    stonks: [],
  },
  getters: {
    index: (state) => {
      return state.layout.length;
    },

    stonks: (state) => {
      return state.stonks;
    },

    getStonkById: (state) => (id) => {
      return state.stonks.find((stonk) => stonk.id == id);
    },

    layout: (state) => {
      return state.layout;
    },
  },
  mutations: {
    setStonks(state, val) {
      state.stonks = val;
    },
    setLayout(state, val) {
      state.layout = val;
    },
  },
  actions: {
    async getLayout({ commit }) {
      fb.layoutCollection.onSnapshot(
        (layout) => {
          let layout_array = [];
          layout.forEach((doc) => {
            let object = {
              id: doc.id,
              h: doc.data().h,
              i: doc.data().i,
              w: doc.data().w,
              x: doc.data().x,
              y: doc.data().y,
            };
            layout_array.push(object);
          });
          commit("setLayout", layout_array);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
    },

    async getStonksData({ commit }) {
      fb.stonksCollection.onSnapshot(
        (stonks) => {
          let stonks_array = [];
          stonks.forEach((doc) => {
            let object = {
              id: doc.id,
              stonks: doc.data().stonks,
              newsfeed: doc.data().newsfeed,
              currentStonkPrice: doc.data().currentStonkPrice,
              stonkTrendline: doc.data().stonkTrendline,
            };
            stonks_array.push(object);
          });
          commit("setStonks", stonks_array);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
    },
  },
  modules: {},
});
