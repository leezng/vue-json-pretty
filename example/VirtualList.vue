<template>
  <div class="example-box">
    <div class="block">
      <h3>JSON:</h3>
      <textarea v-model="state.val" />

      <h3>Options:</h3>
      <div class="options">
        <div>
          <label>itemHeight</label>
          <input v-model="state.itemHeight" type="number" />
        </div>
        <div>
          <label>showLine</label>
          <input v-model="state.showLine" type="checkbox" />
        </div>
        <div>
          <label>collapsedOnClickBrackets</label>
          <input v-model="state.collapsedOnClickBrackets" type="checkbox" />
        </div>
        <div>
          <label>deep</label>
          <select v-model="state.deep">
            <option :value="2">2</option>
            <option :value="3">3</option>
            <option :value="4">4</option>
          </select>
        </div>
        <div>
          <label>collapsedNodeLength</label>
          <select v-model="state.collapsedNodeLength">
            <option :value="10">10</option>
            <option :value="Infinity">Infinity</option>
          </select>
        </div>
      </div>
      <div>
        <label>darkMode</label>
        <input v-model="state.darkMode" type="checkbox" />
      </div>
    </div>
    <div class="block">
      <h3>vue-json-pretty(10000+ items):</h3>
      <vue-json-pretty
        :darkMode="state.darkMode"
        :collapsed-node-length="state.collapsedNodeLength"
        :virtual="true"
        :item-height="+state.itemHeight"
        :data="state.data"
        :deep="state.deep"
        :show-line="state.showLine"
        :collapsed-on-click-brackets="state.collapsedOnClickBrackets"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from 'vue';
import VueJsonPretty from 'src';

const defaultData = {
  status: 200,
  text: '',
  error: null,
  config: undefined,
  data: [],
};

for (let i = 0; i < 10000; i++) {
  defaultData.data.push({
    news_id: i,
    title: 'iPhone X Review: Innovative future with real black technology',
    source: 'Netease phone',
  });
}

export default defineComponent({
  name: 'VirtualList',
  components: {
    VueJsonPretty,
  },
  setup() {
    const state = reactive({
      val: JSON.stringify(defaultData),
      data: defaultData,
      showLine: true,
      collapsedOnClickBrackets: true,
      deep: 3,
      collapsedNodeLength: Infinity,
      itemHeight: 20,
    });

    watch(
      () => state.val,
      newVal => {
        try {
          state.data = JSON.parse(newVal);
        } catch (err) {
          // console.log('JSON ERROR');
        }
      },
    );

    return {
      state,
    };
  },
});
</script>
