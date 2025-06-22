<template>
  <div class="example-box">
    <div class="block">
      <h3>JSON:</h3>
      <textarea :class="{ 'dark-textarea': globalDarkModeState }" v-model="state.val"></textarea>

      <h3>Options:</h3>
      <div class="options">
        <div>
          <label>showIcon</label>
          <input v-model="state.showIcon" type="checkbox" />
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
          <label>showDoubleQuotes</label>
          <input v-model="state.showDoubleQuotes" type="checkbox" />
        </div>
        <div>
          <label>showKeyValueSpace</label>
          <input v-model="state.showKeyValueSpace" type="checkbox" />
        </div>
        <div>
          <label>collapsedOnClickBrackets</label>
          <input v-model="state.collapsedOnClickBrackets" type="checkbox" />
        </div>
        <div>
          <label>indent</label>
          <select v-model="state.indent">
            <option :value="2">2</option>
            <option :value="4">4</option>
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
        <div>
          <label>setPathCollapsible</label>
          <input v-model="state.setPathCollapsible" type="checkbox" />
        </div>
        <div>
          <label>theme</label>
          <select v-model="localDarkMode">
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </div>
      </div>

      <h3>Slots:</h3>
      <div class="options">
        <div>
          <label>renderNodeKey</label>
          <input v-model="state.useRenderNodeKeySlot" type="checkbox" />
        </div>
        <div>
          <label>renderNodeValue</label>
          <input v-model="state.useRenderNodeValueSlot" type="checkbox" />
        </div>
        <div>
          <label>renderNodeActions</label>
          <select v-model="state.useRenderNodeActionsSlot">
            <option :value="false">default(false)</option>
            <option :value="true">true</option>
            <option value="custom">custom</option>
          </select>
        </div>
      </div>
    </div>
    <div class="block">
      <h3>vue-json-pretty:</h3>
      <vue-json-pretty
        :theme="localDarkMode"
        :data="state.data"
        :deep="state.deep"
        :indent="state.indent"
        :path-collapsible="state.setPathCollapsible ? pathCollapsible : undefined"
        :show-double-quotes="state.showDoubleQuotes"
        :show-length="state.showLength"
        :show-line="state.showLine"
        :show-line-number="state.showLineNumber"
        :collapsed-on-click-brackets="state.collapsedOnClickBrackets"
        :show-icon="state.showIcon"
        :show-key-value-space="state.showKeyValueSpace"
        :render-node-actions="
          typeof state.useRenderNodeActionsSlot === 'boolean'
            ? state.useRenderNodeActionsSlot
            : undefined
        "
        style="position: relative"
      >
        <template v-if="state.useRenderNodeKeySlot" #renderNodeKey="{ node, defaultKey }">
          <template v-if="node.key === 'title'">
            <a>"{{ node.key }}"</a>
          </template>
          <template v-else>{{ defaultKey }}</template>
        </template>

        <template v-if="state.useRenderNodeValueSlot" #renderNodeValue="{ node, defaultValue }">
          <template v-if="typeof node.content === 'string' && node.content.startsWith('http://')">
            <a :href="node.content" target="_blank">{{ node.content }}</a>
          </template>
          <template v-else>{{ defaultValue }}</template>
        </template>

        <template
          v-if="state.useRenderNodeActionsSlot === 'custom'"
          #renderNodeActions="{ node, defaultActions }"
        >
          <span><a :href="node.content" target="_blank">link</a></span>
          <span @click="defaultActions.copy" style="margin-left: 4px">copy</span>
        </template>
      </vue-json-pretty>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from 'vue';
import { useDarkMode } from './useDarkMode';
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
      showLineNumber: false,
      showDoubleQuotes: true,
      collapsedOnClickBrackets: true,
      useRenderNodeKeySlot: false,
      useRenderNodeValueSlot: false,
      useRenderNodeActionsSlot: false,
      indent: 2,
      deep: 4,
      setPathCollapsible: false,
      showIcon: false,
      showKeyValueSpace: true,
    });

    const { localDarkMode, toggleLocalDarkMode, globalDarkModeState } = useDarkMode();

    const pathCollapsible = node => {
      return node.key === 'members';
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

    return {
      state,
      pathCollapsible,
      localDarkMode,
      toggleLocalDarkMode,
      globalDarkModeState,
    };
  },
});
</script>

<style scoped>
a {
  color: blue;
}
</style>
