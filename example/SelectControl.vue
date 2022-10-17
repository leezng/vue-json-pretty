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
          <label>rootPath</label>
          <input v-model="rootPath" type="text" />
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
      <h3>Current Node Click:</h3>
      <div>{{ node }}</div>
    </div>
    <div class="block">
      <h3>vue-json-pretty:</h3>
      <vue-json-pretty
        v-if="renderOK"
        :selected-value.sync="selectedValue"
        :data="data"
        :root-path="rootPath"
        :deep="deep"
        :show-double-quotes="showDoubleQuotes"
        :highlight-mouseover-node="highlightMouseoverNode"
        :highlight-selected-node="highlightSelectedNode"
        :show-length="showLength"
        :show-line="showLine"
        :show-line-number="showLineNumber"
        :select-on-click-node="selectOnClickNode"
        :collapsed-on-click-brackets="collapsedOnClickBrackets"
        :node-selectable="(node) => typeof node.content !== 'number'"
        :selectable-type="selectableType"
        :show-select-controller="showSelectController"
        :show-icon="showIcon"
        @node-click="handleNodeClick(...arguments, 'SelectControl')"
        @brackets-click="handleAll"
        @icon-click="handleAll"
        @selected-change="handleAll"
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
      rootPath: 'res',
      deep: 3,
      node: null,
      showIcon: false,
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
    handleNodeClick(node, myParam) {
      // console.log('click: ', node, myParam);
      this.node = node;
    },
    handleAll(...rest) {
      console.log('handleAll: ', rest);
    },
  },
};
</script>
