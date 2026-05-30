<template>
  <div class="example-box">
    <div class="block">
      <h3>JSON:</h3>
      <textarea :class="{ 'dark-textarea': globalDarkModeState }" v-model="state.val"></textarea>

      <h3>Search:</h3>
      <div class="search-row">
        <input
          v-model="state.searchInput"
          type="text"
          placeholder="Type to search keys / values..."
          class="search-input"
        />
        <span class="match-info">
          <button class="nav-btn" @click="prevMatch">‹</button>
          <strong>{{ resultInfo.totalCount > 0 ? resultInfo.currentIndex + 1 : 0 }}</strong
          >/{{ resultInfo.totalCount }}
          <button class="nav-btn" @click="nextMatch">›</button>
        </span>
      </div>

      <h3>Options:</h3>
      <div class="options">
        <div>
          <label>Case Sensitive</label>
          <input v-model="state.caseSensitive" type="checkbox" />
        </div>
        <div>
          <label>Exact Match</label>
          <input v-model="state.strict" type="checkbox" />
        </div>
        <div>
          <label>Search Mode</label>
          <select v-model="state.searchMode">
            <option value="all">Key + Value</option>
            <option value="key">Key only</option>
            <option value="value">Value only</option>
          </select>
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
          <label>showLength</label>
          <input v-model="state.showLength" type="checkbox" />
        </div>
        <div>
          <label>showIcon</label>
          <input v-model="state.showIcon" type="checkbox" />
        </div>
        <div>
          <label>Virtual Scroll</label>
          <input v-model="state.virtual" type="checkbox" />
        </div>
        <div>
          <label>Show Result Bar</label>
          <input v-model="state.showResultInfo" type="checkbox" />
        </div>
        <div>
          <label>deep</label>
          <select v-model="state.deep">
            <option :value="2">2</option>
            <option :value="3">3</option>
            <option :value="4">4</option>
            <option :value="Infinity">Infinity</option>
          </select>
        </div>
        <div>
          <label>theme</label>
          <select v-model="localDarkMode">
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </div>
      </div>
    </div>
    <div class="block">
      <h3>vue-json-pretty:</h3>
      <vue-json-pretty
        ref="jsonPrettyRef"
        :theme="localDarkMode"
        :data="state.data"
        :deep="state.deep"
        :show-icon="state.showIcon"
        :show-line="state.showLine"
        :show-line-number="state.showLineNumber"
        :show-length="state.showLength"
        :virtual="state.virtual"
        :search-text="state.searchText"
        :search-case-sensitive="state.caseSensitive"
        :search-strict="state.strict"
        :search-mode="state.searchMode"
        :show-search-result-info="state.showResultInfo"
        @search-match-change="handleSearchMatchChange"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue';
import VueJsonPretty from 'src';
import { useDarkMode } from './useDarkMode';

const defaultData = {
  status: 200,
  message: 'OK',
  pagination: {
    page: 1,
    pageSize: 20,
    total: 100,
  },
  data: [
    {
      id: 1,
      title: 'iPhone X Review: Innovative future with real black technology',
      source: 'Netease phone',
      published: true,
      tags: ['apple', 'iphone', 'review'],
      stats: { views: 15234, likes: 892, shares: 123 },
    },
    {
      id: 2,
      title:
        'Traffic paradise: How to design streets for people and unmanned vehicles in the future?',
      source: 'Netease smart',
      link: 'http://netease.smart/traffic-paradise',
      published: true,
      tags: ['traffic', 'design', 'AI'],
      stats: { views: 8231, likes: 451, shares: 67 },
    },
    {
      id: 3,
      title: "Tesla's American Business Relations",
      source: 'AI Finance',
      published: false,
      tags: ['tesla', 'business', 'finance'],
      stats: { views: 4421, likes: 203, shares: 34 },
      members: [
        { name: 'Daniel', role: 'admin' },
        { name: 'Mike', role: 'editor' },
        { name: 'John', role: 'viewer' },
      ],
    },
    {
      id: 4,
      title: 'Deep Learning Trends in 2026',
      source: 'Tech Weekly',
      published: true,
      tags: ['AI', 'deep-learning', 'research'],
      stats: { views: 21087, likes: 1543, shares: 456 },
    },
    {
      id: 5,
      title: 'Vue 4 Composition API Deep Dive',
      source: 'Frontend Masters',
      link: 'http://frontend.masters/vue4',
      published: true,
      tags: ['vue', 'javascript', 'frontend'],
      stats: { views: 12654, likes: 987, shares: 234 },
    },
  ],
};

for (let i = 6; i <= 200; i++) {
  defaultData.data.push({
    id: i,
    title: `Auto-generated article #${i}`,
    source: 'Auto Publisher',
    published: i % 3 !== 0,
    tags: ['auto', 'generated', i % 2 === 0 ? 'even' : 'odd'],
    stats: { views: Math.floor(Math.random() * 50000), likes: 0, shares: 0 },
  });
}

export default defineComponent({
  name: 'Searchable',
  components: {
    VueJsonPretty,
  },
  setup() {
    const jsonPrettyRef = ref(null);

    const state = reactive({
      val: JSON.stringify(defaultData),
      data: defaultData,
      searchInput: '',
      searchText: '',
      caseSensitive: false,
      strict: false,
      searchMode: 'all',
      showResultInfo: true,
      showLine: true,
      showLineNumber: false,
      showLength: false,
      showIcon: false,
      deep: Infinity,
      virtual: true,
    });

    const resultInfo = reactive({
      currentIndex: 0,
      totalCount: 0,
    });

    const { localDarkMode, globalDarkModeState } = useDarkMode();

    // Debounce search: wait 200ms after typing before updating searchText
    let searchDebounceTimer = null;
    watch(
      () => state.searchInput,
      val => {
        if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          state.searchText = val;
        }, 200);
      },
    );

    watch(
      () => state.val,
      newVal => {
        try {
          state.data = JSON.parse(newVal);
        } catch {
          // invalid JSON
        }
      },
    );

    const handleSearchMatchChange = ({ currentIndex, totalCount }) => {
      resultInfo.currentIndex = currentIndex;
      resultInfo.totalCount = totalCount;
    };

    const nextMatch = () => {
      jsonPrettyRef.value?.nextMatch();
    };

    const prevMatch = () => {
      jsonPrettyRef.value?.prevMatch();
    };

    return {
      jsonPrettyRef,
      state,
      resultInfo,
      localDarkMode,
      globalDarkModeState,
      nextMatch,
      prevMatch,
      handleSearchMatchChange,
    };
  },
});
</script>

<style scoped>
.search-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  flex: 1;
  min-width: 0;
  max-width: 260px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.match-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #999;
  white-space: nowrap;
  flex-shrink: 0;
}

.nav-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 20px;
  color: #666;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.nav-btn:hover {
  color: #1890ff;
}

.no-match {
  font-size: 12px;
  color: #ff4d4f;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
