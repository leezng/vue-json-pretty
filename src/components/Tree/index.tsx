import {
  defineComponent,
  reactive,
  computed,
  watchEffect,
  watch,
  ref,
  PropType,
  CSSProperties,
  nextTick,
} from 'vue';
import TreeNode, { treeNodePropsPass, NodeDataType } from 'src/components/TreeNode';
import { emitError, jsonFlatten, cloneDeep, JSONFlattenReturnType } from 'src/utils';
import './styles.less';

export default defineComponent({
  name: 'Tree',

  props: {
    ...treeNodePropsPass,
    collapsedNodeLength: {
      type: Number,
      default: Infinity,
    },
    // Define the depth of the tree, nodes greater than this depth will not be expanded.
    deep: {
      type: Number,
      default: Infinity,
    },
    pathCollapsible: {
      type: Function as PropType<(node: NodeDataType) => boolean>,
      default: (): boolean => false,
    },
    // Whether to use virtual scroll, usually applied to big data.
    virtual: {
      type: Boolean,
      default: false,
    },
    // When using virtual scroll, set the height of tree.
    height: {
      type: Number,
      default: 400,
    },
    // When using virtual scroll without dynamicHeight, define the height of each row.
    itemHeight: {
      type: Number,
      default: 20,
    },
    // Enable dynamic row heights for virtual scroll.
    dynamicHeight: {
      type: Boolean,
      default: true,
    },
    // When there is a selection function, define the selected path.
    // For multiple selections, it is an array ['root.a','root.b'], for single selection, it is a string of 'root.a'.
    selectedValue: {
      type: [String, Array] as PropType<string | string[]>,
      default: () => '',
    },
    // Collapsed control.
    collapsedOnClickBrackets: {
      type: Boolean,
      default: true,
    },
    style: Object as PropType<CSSProperties>,
    onSelectedChange: {
      type: Function as PropType<(newVal: string | string[], oldVal: string | string[]) => void>,
    },
    theme: {
      type: String as PropType<'light' | 'dark'>,
      default: 'light',
    },
    // Search keyword for filtering the JSON tree.
    search: {
      type: String,
      default: '',
    },
    // Whether the search is case-sensitive.
    searchCaseSensitive: {
      type: Boolean,
      default: false,
    },
    // Search scope: 'key' | 'value' | 'all'.
    searchMode: {
      type: String as PropType<'key' | 'value' | 'all'>,
      default: 'all',
    },
    // Whether to use strict (exact) matching. When false, uses fuzzy (includes) matching.
    searchStrict: {
      type: Boolean,
      default: false,
    },

  },

  slots: ['renderNodeKey', 'renderNodeValue', 'renderNodeActions'],

  emits: [
    'nodeClick',
    'nodeMouseover',
    'bracketsClick',
    'iconClick',
    'selectedChange',
    'update:selectedValue',
    'update:data',
    'searchMatchChange',
  ],

  setup(props, { emit, slots, expose }) {
    const treeRef = ref<HTMLElement>();

    const originFlatData = computed(() => jsonFlatten(props.data, props.rootPath));

    // ── Search state ──
    const searchMatchInfo = reactive({
      paths: [] as string[],
      totalCount: 0,
      activeIndex: -1,
    });

    const matchesSearch = (
      text: string,
      keyword: string,
      caseSensitive: boolean,
      strict: boolean,
    ): boolean => {
      if (!text) return false;
      const source = caseSensitive ? text : text.toLowerCase();
      const key = caseSensitive ? keyword : keyword.toLowerCase();
      return strict ? source === key : source.includes(key);
    };

    // Collect ancestor paths from a given path string.
    // Correctly handles bracket notation like `data[0]` and special keys like `["foo.bar"]`.
    const getAncestorPaths = (path: string): Set<string> => {
      const ancestors = new Set<string>();

      // Parse path into segments, respecting bracket depth
      const segments: string[] = [];
      let current = '';
      let bracketDepth = 0;
      for (const ch of path) {
        if (ch === '.' && bracketDepth === 0) {
          segments.push(current);
          current = '';
        } else {
          if (ch === '[') bracketDepth++;
          else if (ch === ']') bracketDepth--;
          current += ch;
        }
      }
      if (current) segments.push(current);

      // Build ancestor paths; for array-indexed segments (e.g. `data[0]`),
      // also add the parent path without the index (e.g. `root.data`).
      let acc = '';
      for (const seg of segments) {
        const bracketIdx = seg.indexOf('[');
        if (bracketIdx >= 0) {
          const keyPart = seg.slice(0, bracketIdx);
          const parentAcc = acc ? `${acc}.${keyPart}` : keyPart;
          ancestors.add(parentAcc);
        }
        acc = acc ? `${acc}.${seg}` : seg;
        ancestors.add(acc);
      }

      return ancestors;
    };

    // Pure computed: filters the flattened data based on search criteria.
    const searchFilteredData = computed<JSONFlattenReturnType[]>(() => {
      const origin = originFlatData.value;
      const keyword = props.search?.trim();
      if (!keyword) return origin;

      const caseSensitive = props.searchCaseSensitive;
      const strict = props.searchStrict;
      const mode = props.searchMode;

      // Step 1: Find matching nodes
      // Key matching: check content nodes AND structural nodes (objectStart/arrayStart)
      // Value matching: check only content nodes
      const matchedPaths = new Set<string>();
      for (const item of origin) {
        let keyMatch = false;
        let valueMatch = false;

        if (mode === 'key' || mode === 'all') {
          if (item.key) {
            keyMatch = matchesSearch(item.key, keyword, caseSensitive, strict);
          }
        }
        if (mode === 'value' || mode === 'all') {
          if (item.type === 'content') {
            const strValue = String(item.content ?? '');
            valueMatch = matchesSearch(strValue, keyword, caseSensitive, strict);
          }
        }

        if (keyMatch || valueMatch) {
          matchedPaths.add(item.path);
        }
      }

      // Step 2: Collect ancestor paths
      const allowedPaths = new Set<string>();
      for (const p of matchedPaths) {
        const ancestors = getAncestorPaths(p);
        for (const a of ancestors) {
          allowedPaths.add(a);
        }
      }

      // Step 2b: If a matched path is a structural node (objectStart/arrayStart),
      // include all descendant paths so the full subtree is visible.
      // e.g. searching key "members" matches the arrayStart node — show everything inside.
      const structuralMatched = new Set<string>();
      for (const item of origin) {
        if (
          (item.type === 'objectStart' || item.type === 'arrayStart') &&
          matchedPaths.has(item.path)
        ) {
          structuralMatched.add(item.path);
        }
      }
      if (structuralMatched.size > 0) {
        for (const item of origin) {
          for (const smp of structuralMatched) {
            if (
              item.path !== smp &&
              (item.path.startsWith(smp + '.') || item.path.startsWith(smp + '['))
            ) {
              allowedPaths.add(item.path);
              break;
            }
          }
        }
      }

      // Step 3: Filter originFlatData to only include allowed paths, preserving order
      const result: JSONFlattenReturnType[] = [];
      for (const item of origin) {
        if (allowedPaths.has(item.path)) {
          result.push(item);
        }
      }

      // If search yields no matches, show the original data (with 0-match indicator)
      if (result.length === 0) return origin;

      return result;
    });

    // Watch to update searchMatchInfo reactively (side effects are allowed here)
    watch([searchFilteredData, () => props.search], () => {
      const origin = originFlatData.value;
      const keyword = props.search?.trim();

      if (!keyword) {
        searchMatchInfo.paths = [];
        searchMatchInfo.totalCount = 0;
        searchMatchInfo.activeIndex = -1;
        emit('searchMatchChange', {
          currentIndex: -1,
          totalCount: 0,
        });
        return;
      }

      const caseSensitive = props.searchCaseSensitive;
      const strict = props.searchStrict;
      const mode = props.searchMode;

      // Re-derive matched paths (lightweight operation on the already-flat data)
      const matchedPaths: string[] = [];
      for (const item of origin) {
        let keyMatch = false;
        let valueMatch = false;

        if (mode === 'key' || mode === 'all') {
          if (item.key) {
            keyMatch = matchesSearch(item.key, keyword, caseSensitive, strict);
          }
        }
        if (mode === 'value' || mode === 'all') {
          if (item.type === 'content') {
            const strValue = String(item.content ?? '');
            valueMatch = matchesSearch(strValue, keyword, caseSensitive, strict);
          }
        }

        if (keyMatch || valueMatch) {
          matchedPaths.push(item.path);
        }
      }

      searchMatchInfo.paths = matchedPaths;
      searchMatchInfo.totalCount = matchedPaths.length;

      if (searchMatchInfo.activeIndex < 0 && matchedPaths.length > 0) {
        searchMatchInfo.activeIndex = 0;
      } else if (matchedPaths.length === 0) {
        searchMatchInfo.activeIndex = -1;
      } else if (searchMatchInfo.activeIndex >= matchedPaths.length) {
        searchMatchInfo.activeIndex = matchedPaths.length - 1;
      }

      // Emit change event so parent can update its UI
      emit('searchMatchChange', {
        currentIndex: searchMatchInfo.activeIndex,
        totalCount: searchMatchInfo.totalCount,
      });
    });

    const initHiddenPaths = (deep: number, collapsedNodeLength: number) => {
      return originFlatData.value.reduce((acc, item) => {
        const doCollapse = item.level >= deep || item.length >= collapsedNodeLength;
        const pathComparison = props.pathCollapsible?.(item as NodeDataType);
        if (
          (item.type === 'objectStart' || item.type === 'arrayStart') &&
          (doCollapse || pathComparison)
        ) {
          acc[item.path] = 1;
        }
        return acc;
      }, {} as Record<string, 1>);
    };

    const state = reactive({
      translateY: 0,
      visibleData: null as NodeDataType[] | null,
      hiddenPaths: initHiddenPaths(props.deep, props.collapsedNodeLength),
      startIndex: 0,
      endIndex: 0,
    });

    // Dynamic height bookkeeping
    // heights[i] is the measured height of row i in the current flatData (or estimated if not measured yet)
    // offsets[i] is the cumulative offset before row i (offsets[0] = 0, offsets[length] = totalHeight)
    let heights: number[] = [];
    let offsets: number[] = [];
    const totalHeight = ref(0);
    const rowRefs: Record<number, HTMLElement | null> = {};
    const OVERSCAN_COUNT = 5;

    const initDynamicHeights = (length: number) => {
      heights = Array(length)
        .fill(0)
        .map(() => props.itemHeight || 20);
      offsets = new Array(length + 1);
      offsets[0] = 0;
      for (let i = 0; i < length; i++) {
        offsets[i + 1] = offsets[i] + heights[i];
      }
      totalHeight.value = offsets[length] || 0;
    };

    const recomputeOffsetsFrom = (start: number) => {
      const length = heights.length;
      if (start < 0) start = 0;
      if (start > length) start = length;
      for (let i = start; i < length; i++) {
        offsets[i + 1] = offsets[i] + heights[i];
      }
      totalHeight.value = offsets[length] || 0;
    };

    const setRowRef = (index: number, el: HTMLElement | null) => {
      if (el) {
        rowRefs[index] = el;
      } else {
        delete rowRefs[index];
      }
    };

    const lowerBound = (arr: number[], target: number) => {
      // first index i where arr[i] >= target
      let lo = 0;
      let hi = arr.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    };

    const findStartIndexByScrollTop = (scrollTop: number) => {
      // largest i such that offsets[i] <= scrollTop
      const i = lowerBound(offsets, scrollTop + 0.0001); // epsilon to handle exact matches
      return Math.max(0, Math.min(i - 1, heights.length - 1));
    };

    const findEndIndexByViewport = (scrollTop: number, viewportHeight: number) => {
      const target = scrollTop + viewportHeight;
      const i = lowerBound(offsets, target);
      return Math.max(0, Math.min(i + 1, heights.length));
    };

    const flatData = computed(() => {
      const source = searchFilteredData.value as NodeDataType[];
      let startHiddenItem: null | NodeDataType = null;
      const data = [];
      const length = source.length;
      for (let i = 0; i < length; i++) {
        const cur = source[i];
        const item = {
          ...cur,
          id: i,
        };
        const isHidden = state.hiddenPaths[item.path];
        if (startHiddenItem && startHiddenItem.path === item.path) {
          const isObject = startHiddenItem.type === 'objectStart';
          const mergeItem = {
            ...item,
            ...startHiddenItem,
            showComma: item.showComma,
            content: isObject ? '{...}' : '[...]',
            type: isObject ? 'objectCollapsed' : 'arrayCollapsed',
          } as NodeDataType;
          startHiddenItem = null;
          data.push(mergeItem);
        } else if (isHidden && !startHiddenItem) {
          startHiddenItem = item;
          continue;
        } else {
          if (startHiddenItem) continue;
          else data.push(item);
        }
      }
      return data;
    });

    const selectedPaths = computed(() => {
      const value = props.selectedValue;
      if (value && props.selectableType === 'multiple' && Array.isArray(value)) {
        return value;
      }
      return [value];
    });

    const propsErrorMessage = computed(() => {
      const error = props.selectableType && !props.selectOnClickNode && !props.showSelectController;
      return error
        ? 'When selectableType is not null, selectOnClickNode and showSelectController cannot be false at the same time, because this will cause the selection to fail.'
        : '';
    });

    const listHeight = computed(() => {
      if (props.dynamicHeight) {
        return totalHeight.value || 0;
      }
      return flatData.value.length * props.itemHeight;
    });

    const updateVisibleData = () => {
      const flatDataValue = flatData.value;
      if (!flatDataValue) return;
      if (props.virtual) {
        const scrollTop = treeRef.value?.scrollTop || 0;

        if (props.dynamicHeight) {
          // Ensure dynamic arrays are initialized and consistent with data length
          if (heights.length !== flatDataValue.length) {
            initDynamicHeights(flatDataValue.length);
          }

          const start = findStartIndexByScrollTop(scrollTop);
          const endNoOverscan = findEndIndexByViewport(scrollTop, props.height);
          const startWithOverscan = Math.max(0, start - OVERSCAN_COUNT);
          const endWithOverscan = Math.min(flatDataValue.length, endNoOverscan + OVERSCAN_COUNT);

          state.startIndex = startWithOverscan;
          state.endIndex = endWithOverscan;
          state.translateY = offsets[startWithOverscan] || 0;
          state.visibleData = flatDataValue.slice(startWithOverscan, endWithOverscan);

          // Measure after render and update heights/offets if needed
          nextTick().then(() => {
            let changed = false;
            for (let i = state.startIndex; i < state.endIndex; i++) {
              const el = rowRefs[i];
              if (!el) continue;
              const h = el.offsetHeight;
              if (h && heights[i] !== h) {
                heights[i] = h;
                // Update offsets from i forward
                offsets[i + 1] = offsets[i] + heights[i];
                recomputeOffsetsFrom(i + 1);
                changed = true;
              }
            }
            if (changed) {
              // Recalculate slice based on new offsets
              updateVisibleData();
            }
          });
        } else {
          const visibleCount = props.height / props.itemHeight;
          const scrollCount = Math.floor(scrollTop / props.itemHeight);
          let start =
            scrollCount < 0
              ? 0
              : scrollCount + visibleCount > flatDataValue.length
              ? flatDataValue.length - visibleCount
              : scrollCount;
          if (start < 0) {
            start = 0;
          }
          const end = start + visibleCount;
          state.translateY = start * props.itemHeight;
          state.startIndex = start;
          state.endIndex = end;
          state.visibleData = flatDataValue.slice(start, end);
        }
      } else {
        state.translateY = 0;
        state.startIndex = 0;
        state.endIndex = flatDataValue.length;
        state.visibleData = flatDataValue;
      }
    };

    let rafId: number | null = null;
    const handleTreeScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        updateVisibleData();
      });
    };

    const handleSelectedChange = ({ path }: NodeDataType) => {
      const type = props.selectableType;
      if (type === 'multiple') {
        const index = selectedPaths.value.findIndex(item => item === path);
        const newVal = [...selectedPaths.value];
        if (index !== -1) {
          newVal.splice(index, 1);
        } else {
          newVal.push(path);
        }
        emit('update:selectedValue', newVal);
        emit('selectedChange', newVal, [...selectedPaths.value]);
      } else if (type === 'single') {
        if (selectedPaths.value[0] !== path) {
          const [oldVal] = selectedPaths.value;
          const newVal = path;
          emit('update:selectedValue', newVal);
          emit('selectedChange', newVal, oldVal);
        }
      }
    };

    const handleNodeClick = (node: NodeDataType) => {
      emit('nodeClick', node);
    };

    const handleNodeMouseover = (node: NodeDataType) => {
      emit('nodeMouseover', node);
    };

    const updateCollapsedPaths = (collapsed: boolean, path: string) => {
      if (collapsed) {
        state.hiddenPaths = {
          ...state.hiddenPaths,
          [path]: 1,
        };
      } else {
        const newPaths = { ...state.hiddenPaths };
        delete newPaths[path];
        state.hiddenPaths = newPaths;
      }
    };

    const handleBracketsClick = (collapsed: boolean, node: NodeDataType) => {
      if (props.collapsedOnClickBrackets) {
        updateCollapsedPaths(collapsed, node.path);
      }
      emit('bracketsClick', collapsed, node);
    };

    const handleIconClick = (collapsed: boolean, node: NodeDataType) => {
      updateCollapsedPaths(collapsed, node.path);
      emit('iconClick', collapsed, node);
    };

    const handleValueChange = (value: unknown, path: string) => {
      const newData = cloneDeep(props.data);
      const rootPath = props.rootPath;
      new Function('data', 'val', `data${path.slice(rootPath.length)}=val`)(newData, value);
      emit('update:data', newData);
    };

    watchEffect(() => {
      if (propsErrorMessage.value) {
        emitError(propsErrorMessage.value);
      }
    });

    watchEffect(() => {
      if (flatData.value) {
        if (props.virtual && props.dynamicHeight) {
          if (heights.length !== flatData.value.length) {
            initDynamicHeights(flatData.value.length);
          }
        }
        updateVisibleData();
      }
    });

    // Re-initialize dynamic height arrays when data shape changes significantly
    watch(
      () => [props.dynamicHeight, props.itemHeight, originFlatData.value.length],
      () => {
        if (props.virtual && props.dynamicHeight) {
          initDynamicHeights(flatData.value.length);
          nextTick(updateVisibleData);
        }
      },
    );

    watch(
      () => props.deep,
      val => {
        if (val) state.hiddenPaths = initHiddenPaths(val, props.collapsedNodeLength);
      },
    );

    watch(
      () => props.collapsedNodeLength,
      val => {
        if (val) state.hiddenPaths = initHiddenPaths(props.deep, val);
      },
    );

    // ── Search: auto-expand ancestors of matched paths ──
    watch(
      () => props.search,
      text => {
        if (text?.trim()) {
          // Expand all paths that appear in the search-filtered result
          const visiblePaths = new Set<string>();
          for (const item of searchFilteredData.value) {
            visiblePaths.add(item.path);
          }
          const newHidden: Record<string, 1> = { ...state.hiddenPaths };
          for (const path of Object.keys(newHidden)) {
            if (visiblePaths.has(path)) {
              delete newHidden[path];
            }
          }
          state.hiddenPaths = newHidden;

          // Make tree container scrollable so navigation doesn't scroll the page
          nextTick(() => {
            if (!props.virtual && treeRef.value && !treeRef.value.style.maxHeight) {
              treeRef.value.style.maxHeight = '55vh';
              treeRef.value.style.overflowY = 'auto';
            }
          });
        } else {
          // Restore initial hidden state
          state.hiddenPaths = initHiddenPaths(props.deep, props.collapsedNodeLength);

          // Remove scroll confinement
          if (treeRef.value) {
            treeRef.value.style.maxHeight = '';
            treeRef.value.style.overflowY = '';
          }
        }
      },
    );

    // ── Navigation methods (exposed via ref) ──
    // Find the flatData index of a matched path (for virtual scroll navigation)
    const getFlatIndexByPath = (targetPath: string): number => {
      const fd = flatData.value;
      for (let i = 0; i < fd.length; i++) {
        if (fd[i].path === targetPath) return i;
      }
      return -1;
    };

    const scrollToPath = (path: string) => {
      nextTick(() => {
        // Escape special characters for querySelector
        const escaped = path.replace(/"/g, '\\"');
        const el = treeRef.value?.querySelector(`[data-vjs-path="${escaped}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          return;
        }
        // If DOM element not found (e.g. virtual scroll, element off-screen),
        // calculate and set scrollTop manually.
        if (props.virtual && treeRef.value) {
          const idx = getFlatIndexByPath(path);
          if (idx >= 0) {
            const scrollTop = props.dynamicHeight ? offsets[idx] || 0 : idx * props.itemHeight;
            treeRef.value.scrollTop = Math.max(0, scrollTop - 40);
          }
        }
      });
    };

    const nextMatch = () => {
      if (searchMatchInfo.totalCount <= 0) return;
      const next = (searchMatchInfo.activeIndex + 1) % searchMatchInfo.totalCount;
      searchMatchInfo.activeIndex = next;
      scrollToPath(searchMatchInfo.paths[next]);
      emit('searchMatchChange', {
        currentIndex: next,
        totalCount: searchMatchInfo.totalCount,
      });
    };

    const prevMatch = () => {
      if (searchMatchInfo.totalCount <= 0) return;
      const prev =
        (searchMatchInfo.activeIndex - 1 + searchMatchInfo.totalCount) % searchMatchInfo.totalCount;
      searchMatchInfo.activeIndex = prev;
      scrollToPath(searchMatchInfo.paths[prev]);
      emit('searchMatchChange', {
        currentIndex: prev,
        totalCount: searchMatchInfo.totalCount,
      });
    };

    const getSearchResultInfo = () => ({
      currentIndex: searchMatchInfo.activeIndex,
      totalCount: searchMatchInfo.totalCount,
    });

    // Expose methods for external ref access
    expose({
      nextMatch,
      prevMatch,
      getSearchResultInfo,
    });

    return () => {
      const renderNodeKey = props.renderNodeKey ?? slots.renderNodeKey;
      const renderNodeValue = props.renderNodeValue ?? slots.renderNodeValue;
      const renderNodeActions = props.renderNodeActions ?? slots.renderNodeActions ?? false;

      const nodeContent = state.visibleData?.map((item, localIndex) => {
        const globalIndex = state.startIndex + localIndex;
        const isActiveMatch =
          searchMatchInfo.activeIndex >= 0 &&
          searchMatchInfo.paths[searchMatchInfo.activeIndex] === item.path;
        return (
          <div
            key={item.id}
            ref={el => setRowRef(globalIndex, (el as HTMLElement) || null)}
            data-vjs-path={item.path}
            data-vjs-active={isActiveMatch ? 'true' : undefined}
          >
            <TreeNode
              data={props.data}
              rootPath={props.rootPath}
              indent={props.indent}
              node={item}
              collapsed={!!state.hiddenPaths[item.path]}
              theme={props.theme}
              showDoubleQuotes={props.showDoubleQuotes}
              showLength={props.showLength}
              checked={selectedPaths.value.includes(item.path)}
              selectableType={props.selectableType}
              showLine={props.showLine}
              showLineNumber={props.showLineNumber}
              showSelectController={props.showSelectController}
              selectOnClickNode={props.selectOnClickNode}
              nodeSelectable={props.nodeSelectable}
              highlightSelectedNode={props.highlightSelectedNode}
              editable={props.editable}
              editableTrigger={props.editableTrigger}
              showIcon={props.showIcon}
              showKeyValueSpace={props.showKeyValueSpace}
              renderNodeKey={renderNodeKey}
              renderNodeValue={renderNodeValue}
              renderNodeActions={renderNodeActions}
              highlightText={props.search}
              highlightCaseSensitive={props.searchCaseSensitive}
              isActiveMatch={isActiveMatch}
              onNodeClick={handleNodeClick}
              onNodeMouseover={handleNodeMouseover}
              onBracketsClick={handleBracketsClick}
              onIconClick={handleIconClick}
              onSelectedChange={handleSelectedChange}
              onValueChange={handleValueChange}
              class={props.dynamicHeight ? 'dynamic-height' : undefined}
              style={
                props.dynamicHeight
                  ? {}
                  : props.itemHeight && props.itemHeight !== 20
                  ? { lineHeight: `${props.itemHeight}px` }
                  : {}
              }
            />
          </div>
        );
      });

      return (
        <div
          ref={treeRef}
          class={{
            'vjs-tree': true,
            'is-virtual': props.virtual,
            dark: props.theme === 'dark',
          }}
          onScroll={props.virtual ? handleTreeScroll : undefined}
          style={
            props.showLineNumber
              ? {
                  paddingLeft: `${
                    Number(searchFilteredData.value.length.toString().length) * 12
                  }px`,
                  ...props.style,
                }
              : props.style
          }
        >
          {props.virtual ? (
            <div class="vjs-tree-list" style={{ height: `${props.height}px` }}>
              <div class="vjs-tree-list-holder" style={{ height: `${listHeight.value}px` }}>
                <div
                  class="vjs-tree-list-holder-inner"
                  style={{ transform: `translateY(${state.translateY}px)` }}
                >
                  {nodeContent}
                </div>
              </div>
            </div>
          ) : (
            nodeContent
          )}
        </div>
      );
    };
  },
});
