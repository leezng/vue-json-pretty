<template>
  <div>
    <div class="block">
      <h3>JSON:</h3>
      <textarea v-model="val" />

      <h3>Options:</h3>
      <div class="options">
        <div>
          <label>itemHeight</label>
          <input v-model="itemHeight" type="number" />
        </div>
        <div>
          <label>showLine</label>
          <input v-model="showLine" type="checkbox" />
        </div>
        <div>
          <label>collapsedOnClickBrackets</label>
          <input v-model="collapsedOnClickBrackets" type="checkbox" />
        </div>
        <div>
          <label>deep</label>
          <select v-model="deep">
            <option :value="2">2</option>
            <option :value="3">3</option>
            <option :value="4">4</option>
          </select>
        </div>
        <div>
          <label>collapsedNodeLength</label>
          <select v-model="collapsedNodeLength">
            <option :value="10">10</option>
            <option :value="Infinity">Infinity</option>
          </select>
        </div>
      </div>
    </div>
    <div class="block">
      <h3>vue-json-pretty(1000+ items):</h3>
      <vue-json-pretty
        :collapse-threshold="collapsedNodeLength"
        :virtual="true"
        :item-height="+itemHeight"
        :data="data"
        :deep="deep"
        :show-line="showLine"
        :collapsed-on-click-brackets="collapsedOnClickBrackets"
      />
    </div>
  </div>
</template>

<script>
import VueJsonPretty from 'src';

const defaultData = {
  status: 200,
  text: '',
  error: null,
  config: undefined,
  data: Array.from(Array(1000)).map((item, index) => ({
    news_id: index,
    title: 'iPhone X Review: Innovative future with real black technology',
    source: 'Netease phone',
  })),
};

export default {
  name: 'VirtualList',
  components: {
    VueJsonPretty,
  },
  data() {
    return {
      val: JSON.stringify(defaultData),
      data: defaultData,
      showLine: true,
      collapsedOnClickBrackets: true,
      deep: 3,
      collapsedNodeLength: Infinity,
      itemHeight: 20,
    };
  },
  watch: {
    val(newVal) {
      try {
        this.data = JSON.parse(newVal);
      } catch (err) {
        console.log('JSON ERROR');
      }
    },
  },
};
</script>
