<template>
  <div class="example-box">
    <div class="block">
      <h3>JSON:</h3>
      <textarea :class="{ 'dark-textarea': globalDarkModeState }" v-model="state.val"></textarea>

      <h3>Options:</h3>
      <div class="options">
        <div>
          <label>showLine</label>
          <input v-model="state.showLine" type="checkbox" />
        </div>
        <div>
          <label>showLineNumber</label>
          <input v-model="state.showLineNumber" type="checkbox" />
        </div>
        <div>
          <label>editable</label>
          <input v-model="state.editable" type="checkbox" />
        </div>
        <div>
          <label>editableTrigger</label>
          <select v-model="state.editableTrigger">
            <option value="click">click</option>
            <option value="dblclick">dblclick</option>
          </select>
        </div>
        <div>
          <label>deep</label>
          <select v-model="state.deep">
            <option :value="2">2</option>
            <option :value="3">3</option>
            <option :value="4">4</option>
          </select>
        </div>
      </div>
      <div>
        <label>darkHighlightMode</label>
        <input v-model="localDarkMode" type="checkbox" />
      </div>
    </div>
    <div class="block">
      <h3>vue-json-pretty:</h3>
      <vue-json-pretty
        v-model:data="state.data"
        :darkHighlightMode="localDarkMode"
        :deep="state.deep"
        :show-double-quotes="true"
        :show-line="state.showLine"
        :show-line-number="state.showLineNumber"
        :editable="state.editable"
        :editable-trigger="state.editableTrigger"
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
  data: [
    {
      news_id: 51184,
      title: 'iPhone X Review: Innovative future with real black technology',
      source: 'Netease phone',
    },
    {
      news_id: 51183,
      title:
        'Traffic paradise: How to design streets for people and unmanned vehicles in the future?',
      source: 'Netease smart',
      link: 'http://netease.smart/traffic-paradise/1235',
    },
    {
      news_id: 51182,
      title:
        "Teslamask's American Business Relations: The government does not pay billions to build factories",
      source: 'AI Finance',
      members: ['Daniel', 'Mike', 'John'],
    },
  ],
};

export default defineComponent({
  name: 'Editable',
  components: {
    VueJsonPretty,
  },
  setup() {
    const state = reactive({
      val: JSON.stringify(defaultData),
      data: defaultData,
      showLine: true,
      showLineNumber: false,
      editable: true,
      editableTrigger: 'click',
      deep: 3,
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

    watch(
      () => state.data,
      newVal => {
        try {
          state.val = JSON.stringify(newVal);
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
./useDarkMode
