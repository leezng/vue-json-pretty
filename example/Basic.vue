<template>
  <div>
    <div class="block">
      <h3>JSON:</h3>
      <textarea v-model="state.val" />

      <h3>Options:</h3>
      <div class="options">
        <div>
          <label>showLength</label>
          <input v-model="state.showLength" type="checkbox" />
        </div>
        <div>
          <label>showLine</label>
          <input v-model="state.showLine" type="checkbox" />
        </div>
        <div>
          <label>showDoubleQuotes</label>
          <input v-model="state.showDoubleQuotes" type="checkbox" />
        </div>
        <div>
          <label>collapsedOnClickBrackets</label>
          <input v-model="state.collapsedOnClickBrackets" type="checkbox" />
        </div>
        <div>
          <label>use custom formatter</label>
          <input v-model="state.useCustomLinkFormatter" type="checkbox" />
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
          <label>deepCollapseChildren</label>
          <input v-model="state.deepCollapseChildren" type="checkbox" />
        </div>
        <div>
          <label>defaultCollapsePath</label>
          <input v-model="state.collapsePathPattern" type="input" />
        </div>
      </div>
    </div>
    <div class="block">
      <h3>vue-json-pretty:</h3>
      <vue-json-pretty
        :data="state.data"
        :deep="state.deep"
        :deepCollapseChildren="state.deepCollapseChildren"
        :collapsePath="state.collapsePath"
        :show-double-quotes="state.showDoubleQuotes"
        :show-length="state.showLength"
        :show-line="state.showLine"
        :collapsed-on-click-brackets="state.collapsedOnClickBrackets"
        :custom-value-formatter="state.useCustomLinkFormatter ? customLinkFormatter : null"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from 'vue';
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
      author: {
        names: ['Daniel', 'Mike', 'John'],
      },
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
  name: 'Basic',
  components: {
    VueJsonPretty,
  },
  setup() {
    const state = reactive({
      val: JSON.stringify(defaultData),
      data: defaultData,
      showLength: false,
      showLine: true,
      showDoubleQuotes: true,
      collapsedOnClickBrackets: true,
      useCustomLinkFormatter: false,
      deep: 4,
      deepCollapseChildren: false,
      collapsePath: /members/,
      collapsePathPattern: 'members',
    });

    const customLinkFormatter = (data, key, path, defaultFormatted) => {
      if (typeof data === 'string' && data.startsWith('http://')) {
        return `<a style="color:red;" href="${data}" target="_blank">"${data}"</a>`;
      } else {
        return defaultFormatted;
      }
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
      () => state.collapsePath,
      newVal => {
        try {
          state.collapsePath = new RegExp(newVal);
        } catch (err) {
          // console.log('Regexp ERROR');
        }
      },
    );

    return {
      state,
      customLinkFormatter,
    };
  },
});
</script>
