<template>
  <div class="example-box">
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
          <label>showLineNumber</label>
          <input v-model="showLineNumber" type="checkbox" />
        </div>
        <div>
          <label>editable</label>
          <input v-model="editable" type="checkbox" />
        </div>
        <div>
          <label>editableTrigger</label>
          <select v-model="editableTrigger">
            <option value="click">click</option>
            <option value="dblclick">dblclick</option>
          </select>
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
    </div>
    <div class="block">
      <h3>vue-json-pretty:</h3>
      <vue-json-pretty
        v-model="data"
        :deep="deep"
        :show-double-quotes="true"
        :show-length="showLength"
        :show-line="showLine"
        :show-line-number="showLineNumber"
        :editable="editable"
        :editable-trigger="editableTrigger"
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
  name: 'Editable',
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
      editable: true,
      editableTrigger: 'click',
      deep: 3,
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
    data(newVal) {
      try {
        this.val = JSON.stringify(newVal);
      } catch (err) {
        console.log('JSON ERROR');
      }
    },
  },
};
</script>
