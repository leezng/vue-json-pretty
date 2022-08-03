<template>
  <div class="example-box">
    <div class="block">
      <h3>JSON:</h3>
      <textarea v-model="state.val" />

      <h3>Options:</h3>
      <div class="options">
        <div>
          <label>showIcon</label>
          <input v-model="state.showIcon" type="checkbox" />
        </div>
        <div>
          <label>selectableType</label>
          <select v-model="state.selectableType">
            <option>single</option>
            <option>multiple</option>
          </select>
        </div>
        <div>
          <label>showSelectController</label>
          <input v-model="state.showSelectController" type="checkbox" />
        </div>
        <div>
          <label>selectOnClickNode</label>
          <input v-model="state.selectOnClickNode" type="checkbox" />
        </div>
        <div>
          <label>path</label>
          <input v-model="state.path" type="text" />
        </div>
        <div>
          <label>showLength</label>
          <input v-model="state.showLength" type="checkbox" />
        </div>
        <div>
          <label>showLine</label>
          <input v-model="state.showLine" type="checkbox" />
        </div>
        <div>
          <label>showLineNumber</label>
          <input v-model="state.showLineNumber" type="checkbox" />
        </div>
        <div>
          <label>highlightSelectedNode</label>
          <input v-model="state.highlightSelectedNode" type="checkbox" />
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
      </div>
      <h3>v-model:selectedValue:</h3>
      <div>{{ state.selectedValue }}</div>
      <h3>Current Click:</h3>
      <div>path: {{ state.itemPath }}</div>
      <div>
        data:
        <pre>{{ state.itemData }}</pre>
      </div>
    </div>
    <div class="block">
      <h3>vue-json-pretty:</h3>
      <vue-json-pretty
        v-if="state.renderOK"
        v-model:selectedValue="state.selectedValue"
        :data="state.data"
        :path="state.path"
        :deep="state.deep"
        :show-double-quotes="true"
        :highlight-selected-node="state.highlightSelectedNode"
        :show-length="state.showLength"
        :show-line="state.showLine"
        :show-line-number="state.showLineNumber"
        :select-on-click-node="state.selectOnClickNode"
        :collapsed-on-click-brackets="state.collapsedOnClickBrackets"
        :path-selectable="(path, data) => typeof state.data !== 'number'"
        :selectable-type="state.selectableType"
        :show-select-controller="state.showSelectController"
        :show-icon="state.showIcon"
        @nodeClick="handleClick"
        @selectedChange="handleChange"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, watch, nextTick } from 'vue';
import VueJsonPretty from 'src';

const defaultData = {
  status: 200,
  error: '',
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
  name: 'SelectControl',
  components: {
    VueJsonPretty,
  },
  setup() {
    const state = reactive({
      renderOK: true,
      val: JSON.stringify(defaultData),
      data: defaultData,
      selectedValue: 'res.error',
      selectableType: 'single',
      showSelectController: true,
      showLength: false,
      showLine: true,
      showLineNumber: false,
      highlightSelectedNode: true,
      selectOnClickNode: true,
      collapsedOnClickBrackets: true,
      path: 'res',
      deep: 3,
      itemData: {},
      itemPath: '',
      showIcon: false,
    });

    const handleClick = (path, data) => {
      // console.log('click: ', path, data);
      state.itemPath = path;
      state.itemData = !data ? data + '' : data; // if data = null
    };

    const handleChange = () => {
      // console.log('newVal: ', newVal, ' oldVal: ', oldVal);
    };

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
      () => state.selectableType,
      async newVal => {
        state.renderOK = false;
        if (newVal === 'single') {
          state.selectedValue = 'res.error';
        } else if (newVal === 'multiple') {
          state.selectedValue = ['res.error', 'res.data[0].title'];
        }
        // Re-render because v-model:selectedValue format is different in case 2
        await nextTick();
        state.renderOK = true;
      },
    );

    return {
      state,
      handleClick,
      handleChange,
    };
  },
});
</script>
