<template>
  <div>
    <div class="block">
      <h3>JSON:</h3>
      <textarea v-model="val" />

      <h3>Options:</h3>
      <div class="options">
        <div>
          <label>showLength</label>
          <input v-model="showLength" type="checkbox" />
        </div>
        <div>
          <label>showLine</label>
          <input v-model="showLine" type="checkbox" />
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
          <label>use custom formatter</label>
          <input v-model="useCustomLinkFormatter" type="checkbox" />
        </div>
        <div>
          <label>deep</label>
          <select v-model="deep">
            <option :value="2">
              2
            </option>
            <option :value="3">
              3
            </option>
            <option :value="4">
              4
            </option>
          </select>
        </div>
        <div>
          <label>deepCollapseChildren</label>
          <input v-model="deepCollapseChildren" type="checkbox" />
        </div>
      </div>
    </div>
    <div class="block">
      <h3>vue-json-pretty:</h3>
      <vue-json-pretty
        :data="data"
        :deep="deep"
        :deepCollapseChildren="deepCollapseChildren"
        :show-double-quotes="showDoubleQuotes"
        :show-length="showLength"
        :show-line="showLine"
        :highlight-mouseover-node="highlightMouseoverNode"
        :collapsed-on-click-brackets="collapsedOnClickBrackets"
        :custom-value-formatter="useCustomLinkFormatter ? customLinkFormatter : null"
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
  name: 'App',
  components: {
    VueJsonPretty,
  },
  data() {
    return {
      val: JSON.stringify(defaultData),
      data: defaultData,
      showLength: false,
      showLine: true,
      showDoubleQuotes: true,
      highlightMouseoverNode: true,
      collapsedOnClickBrackets: true,
      useCustomLinkFormatter: false,
      deep: 3,
      deepCollapseChildren: false,
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
  },
  methods: {
    customLinkFormatter(data, key, path, defaultFormatted) {
      if (typeof data === 'string' && data.startsWith('http://')) {
        return `<a style="color:red;" href="${data}" target="_blank">"${data}"</a>`;
      } else {
        return defaultFormatted;
      }
    },
  },
};
</script>
