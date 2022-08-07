<template>
  <div>
    <div class="block">
      <h3>JSON:</h3>
      <textarea v-model="val" />

      <h3>Options:</h3>
      <div class="options">
        <div>
          <label>showIcon</label>
          <input v-model="showIcon" type="checkbox" />
        </div>
        <div>
          <label>selectableType</label>
          <select v-model="selectableType">
            <option>single</option>
            <option>multiple</option>
          </select>
        </div>
        <div>
          <label>showSelectController</label>
          <input v-model="showSelectController" type="checkbox" />
        </div>
        <div>
          <label>selectOnClickNode</label>
          <input v-model="selectOnClickNode" type="checkbox" />
        </div>
        <div>
          <label>path</label>
          <input v-model="path" type="text" />
        </div>
        <div>
          <label>showLength</label>
          <input v-model="showLength" type="checkbox" />
        </div>
        <div>
          <label>showLine</label>
          <input v-model="showLine" type="checkbox" />
        </div>
        <div>
          <label>showLineNumber</label>
          <input v-model="showLineNumber" type="checkbox" />
        </div>
        <div>
          <label>showDoubleQuotes</label>
          <input v-model="showDoubleQuotes" type="checkbox" />
        </div>
        <div>
          <label>highlightMouseoverNode</label>
          <input v-model="highlightMouseoverNode" type="checkbox" />
        </div>
        <div>
          <label>highlightSelectedNode</label>
          <input v-model="highlightSelectedNode" type="checkbox" />
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
      </div>
      <h3>selectedValue.sync:</h3>
      <div>{{ selectedValue }}</div>
      <h3>Current Click:</h3>
      <div>path: {{ itemPath }}</div>
      <div>
        data:
        <pre>{{ itemData }}</pre>
      </div>
    </div>
    <div class="block">
      <h3>vue-json-pretty:</h3>
      <vue-json-pretty
        v-if="renderOK"
        :selected-value.sync="selectedValue"
        :data="data"
        :path="path"
        :deep="deep"
        :show-double-quotes="showDoubleQuotes"
        :highlight-mouseover-node="highlightMouseoverNode"
        :highlight-selected-node="highlightSelectedNode"
        :show-length="showLength"
        :show-line="showLine"
        :show-line-number="showLineNumber"
        :select-on-click-node="selectOnClickNode"
        :collapsed-on-click-brackets="collapsedOnClickBrackets"
        :path-selectable="(path, data) => typeof data !== 'number'"
        :selectable-type="selectableType"
        :show-select-controller="showSelectController"
        :show-icon="showIcon"
        @node-click="handleClick(...arguments, 'complexTree')"
        @selected-change="handleChange"
      />
    </div>
  </div>
</template>

<script>
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

export default {
  name: 'SelectControl',
  components: {
    VueJsonPretty,
  },
  data() {
    return {
      renderOK: true,
      val: JSON.stringify(defaultData),
      data: defaultData,
      selectedValue: 'res.error',
      selectableType: 'single',
      showSelectController: true,
      showLength: false,
      showLine: true,
      showLineNumber: false,
      showDoubleQuotes: true,
      highlightMouseoverNode: true,
      highlightSelectedNode: true,
      selectOnClickNode: true,
      collapsedOnClickBrackets: true,
      path: 'res',
      deep: 3,
      itemData: {},
      itemPath: '',
      showIcon: false,
    };
  },
  watch: {
    val(newVal) {
      try {
        this.data = JSON.parse(this.val);
      } catch (err) {
        console.log('JSON ERROR');
      }
    },
    selectableType(newVal) {
      this.renderOK = false;
      if (newVal === 'single') {
        this.selectedValue = 'res.error';
      } else if (newVal === 'multiple') {
        this.selectedValue = ['res.error', 'res.data[0].title'];
      }
      // Re-render because v-model:selectedValue format is different in case 2
      this.$nextTick(() => {
        this.renderOK = true;
      });
    },
  },
  methods: {
    handleClick(path, data, treeName = '') {
      // console.log('click: ', path, data, treeName);
      this.itemPath = path;
      this.itemData = !data ? data + '' : data; // 处理 data = null 的情况
    },
    handleChange(newVal, oldVal) {
      console.log('newVal: ', newVal, ' oldVal: ', oldVal);
    },
  },
};
</script>
