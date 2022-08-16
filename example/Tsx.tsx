import { defineComponent, reactive } from 'vue';
import VueJsonPretty from 'src';

const defaultData = {
  status: 200,
  data: [
    {
      news_id: 51184,
      link: 'http://netease.smart/traffic-paradise/51184',
    },
    {
      news_id: 51183,
      link: 'http://netease.smart/traffic-paradise/51183',
    },
  ],
};

export default defineComponent({
  setup() {
    const state = reactive({
      data: defaultData,
    });

    return () => (
      <VueJsonPretty
        data={state.data}
        showLineNumber
        showIcon
        renderNodeValue={({ node, defaultValue }) =>
          typeof node.content === 'string' && node.content?.startsWith('http://') ? (
            <a href={node.content} target="_blank">
              {node.content}
            </a>
          ) : (
            defaultValue
          )
        }
      />
    );
  },
});
