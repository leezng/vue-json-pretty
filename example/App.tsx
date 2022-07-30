import { defineComponent, reactive } from 'vue';
import Basic from './Basic.vue';
import VirtualList from './VirtualList.vue';
import SelectControl from './SelectControl.vue';
import Editable from './Editable.vue';
import './styles.less';

const list = [
  {
    title: 'Basic Use',
    key: 'basic',
    component: Basic,
  },
  {
    title: 'Virtual List',
    key: 'virtual-list',
    component: VirtualList,
  },
  {
    title: 'Selector',
    key: 'select-control',
    component: SelectControl,
  },
  {
    title: 'Editable',
    key: 'editable',
    component: Editable,
  },
];

export default defineComponent({
  setup() {
    const state = reactive({
      activeKey: list[0].key,
      opened: [list[0].key],
    });

    const onActiveChange = (key: string) => {
      state.activeKey = key;
    };

    return {
      state,
      onActiveChange,
    };
  },

  render() {
    const { state, onActiveChange } = this;

    return (
      <div class="example">
        <h1>Vue Json Pretty</h1>
        <p>
          Welcome to the demo space of Vue Json Pretty, here we provide the following different
          usage scenarios, try to click on different tab panel to browse.
        </p>

        <div class="tabs">
          <div class="tabs-header">
            {list.map(({ title, key }) => (
              <div
                key={key}
                class={`tabs-header-item ${key === state.activeKey ? 'is-active' : ''}`}
                onClick={() => onActiveChange(key)}
              >
                {title}
              </div>
            ))}
          </div>

          <div class="tabs-content">
            {list.map(({ component: Component, key }) => (
              <div key={key} style={{ display: `${key === state.activeKey ? 'block' : 'none'}` }}>
                {key === state.activeKey || state.opened.includes(key) ? <Component /> : null}
              </div>
            ))}
          </div>
        </div>

        <a
          style="position: fixed; right: 0; top: 0;"
          href="https://github.com/leezng/vue-json-pretty"
          target="_blank"
        >
          <img
            style="position: absolute; top: 0; right: 0; border: 0;"
            src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67"
            alt="Fork me on GitHub"
            data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"
          />
        </a>
      </div>
    );
  },
});
