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

      <h3>Slots:</h3>
      <div class="options">
        <div>
          <label>nodeValue</label>
          <input v-model="useNodeValueSlot" type="checkbox" />
        </div>
      </div>
    </div>
    <div class="block">
      <h3>vue-json-pretty:</h3>
      <vue-json-pretty
        :data="data"
        :deep="deep"
        :show-double-quotes="showDoubleQuotes"
        :show-length="showLength"
        :show-line="showLine"
        :show-line-number="showLineNumber"
        :highlight-mouseover-node="highlightMouseoverNode"
        :collapsed-on-click-brackets="collapsedOnClickBrackets"
        :show-icon="showIcon"
        style="position: relative"
      >
        <template v-if="useNodeValueSlot" #nodeValue="{ node, defaultValue }">
          <template v-if="typeof node.content === 'string' && node.content.startsWith('http://')">
            <a href="node.content" target="_blank">{{ node.content }}</a>
          </template>
          <template v-else>{{ defaultValue }}</template>
        </template>
      </vue-json-pretty>
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
  name: 'Basic',
  components: {
    VueJsonPretty,
  },
  data() {
    return {
      val: JSON.stringify(defaultData),
      data: defaultData,
      showLength: false,
      showLine: true,
      showLineNumber: false,
      showDoubleQuotes: true,
      highlightMouseoverNode: true,
      collapsedOnClickBrackets: true,
      useNodeValueSlot: false,
      deep: 3,
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
  },
};
</script>

<style scoped>
a {
  color: blue;
}
</style>
