<template>
  <div class="example-box">
    <div class="block">
      <h3>JSON:</h3>
      <textarea :class="{ 'dark-textarea': globalDarkModeState }" v-model="state.val"></textarea>

      <h3>Options:</h3>
      <div class="options">
        <div>
          <label>itemHeight</label>
          <input v-model="state.itemHeight" type="number" />
        </div>
        <div>
          <label>dynamicHeight</label>
          <input v-model="state.dynamicHeight" type="checkbox" />
        </div>
        <div v-if="state.dynamicHeight">
          <label>estimatedItemHeight</label>
          <input v-model="state.estimatedItemHeight" type="number" />
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
        <label>theme</label>
        <select v-model="localDarkMode">
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>
      </div>
    </div>
    <div class="block">
      <h3>vue-json-pretty(10000+ items):</h3>
      <vue-json-pretty
        :theme="localDarkMode"
        :collapsed-node-length="state.collapsedNodeLength"
        :virtual="true"
        :item-height="+state.itemHeight"
        :dynamic-height="state.dynamicHeight"
        :estimated-item-height="+state.estimatedItemHeight"
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
import { useDarkMode } from './useDarkMode';

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
    title: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
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
      dynamicHeight: true,
      estimatedItemHeight: 20,
    });

    const { localDarkMode, toggleLocalDarkMode, globalDarkModeState } = useDarkMode();

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
      localDarkMode,
      toggleLocalDarkMode,
      globalDarkModeState,
    };
  },
});
</script>
