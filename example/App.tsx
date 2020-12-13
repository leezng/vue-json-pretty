import { defineComponent } from 'vue';
import Basic from './Basic.vue';
import VirtualList from './VirtualList.vue';
import SelectControl from './SelectControl.vue';
import './styles.less';

export default defineComponent({
  render() {
    const list = [
      {
        title: 'Basic Use',
        key: 'basic',
        component: <Basic />,
      },
      {
        title: 'Virtual List',
        key: 'virtual-list',
        component: <VirtualList />,
      },
      {
        title: 'Selector',
        key: 'select-control',
        component: <SelectControl />,
      },
    ];

    return (
      <div class="example">
        {list.map(item => (
          <div class="example-box" id={item.key}>
            <h2 class="title">{item.title}</h2>
            {item.component}
          </div>
        ))}

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
