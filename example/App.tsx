import { defineComponent, reactive, provide, onMounted, watch } from 'vue';
import Basic from './Basic.vue';
import VirtualList from './VirtualList.vue';
import SelectControl from './SelectControl.vue';
import Editable from './Editable.vue';
// import Tsx from './Tsx';
import './styles.less';

const list = [
  {
    title: 'Basic Use',
    key: 'Basic',
    component: Basic,
  },
  {
    title: 'Virtual List',
    key: 'VirtualList',
    component: VirtualList,
  },
  {
    title: 'Selector',
    key: 'Selector',
    component: SelectControl,
  },
  {
    title: 'Editable',
    key: 'Editable',
    component: Editable,
  },
  // {
  //   title: 'Tsx',
  //   key: 'Tsx',
  //   component: Tsx,
  // },
];

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 0112.21 3C11.66 3 11.11 3.05 10.58 3.15A9 9 0 1021 12.79z"></path>
  </svg>
);

export default defineComponent({
  setup() {
    const state = reactive({
      activeKey: list[0].key,
      opened: [list[0].key],
    });

    const globalDarkModeState = reactive({
      isDarkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    });

    provide('darkModeState', globalDarkModeState);

    const onActiveChange = (key: string) => {
      state.activeKey = key;
      if (!state.opened.includes(key)) {
        state.opened.push(key);
      }
    };

    const toggleDarkMode = () => {
      globalDarkModeState.isDarkMode = !globalDarkModeState.isDarkMode;
    };

    onMounted(() => {
      document.body.classList.toggle('dark-mode', globalDarkModeState.isDarkMode);
    });

    watch(
      () => globalDarkModeState.isDarkMode,
      newVal => {
        document.body.classList.toggle('dark-mode', newVal);
      },
      { immediate: true },
    );

    return {
      state,
      onActiveChange,
      toggleDarkMode,
    };
  },

  render() {
    const { state, onActiveChange, toggleDarkMode } = this;

    return (
      <div class={`example ${state.isDarkMode ? 'dark-mode' : ''}`}>
        <h1>Vue Json Pretty</h1>
        <p>
          Welcome to the demo space of Vue Json Pretty, here we provide the following different
          usage scenarios, try to click on different tab panel to browse.
        </p>

        <div class="tabs">
          <div class="tabs-header">
            <div class="tabs-items-container">
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
            <div class="dark-mode-toggle" onClick={toggleDarkMode}>
              {state.isDarkMode ? <SunIcon /> : <MoonIcon />}
            </div>
          </div>

          <div class="tabs-content">
            {list.map(({ component: Component, key }) => (
              <div key={key} style={{ display: `${key === state.activeKey ? 'block' : 'none'}` }}>
                {key === state.activeKey || state.opened.includes(key) ? <Component /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
});
