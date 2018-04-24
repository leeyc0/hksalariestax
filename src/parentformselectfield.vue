<template>
<td>
<select v-model="value">
  <option :value="0">傷殘——不限年齡</option>
  <optgroup label="以下選項均非傷殘人士"/>
  <option :value="1">於{{taxYear2}}年度滿55歲</option>
  <option :value="2">於{{taxYear1}}年度滿55歲</option>
  <option :value="3">於{{taxYear2}}年度滿60歲</option>
  <option :value="4">於{{taxYear1}}年度滿60歲</option>
</select>
</td>
</template>

<script>
"use strict";
import Vuex from 'vuex';
import {parentFormFieldUpdate} from "./parentform";

export default {
  props: ['index', 'parentObject', 'field'],
  computed: {
    ...Vuex.mapState(['taxYear1', 'taxYear2']),
    value: {
      get: function() {return this.parentObject[this.field];},
      set: function(newValue) {parentFormFieldUpdate(this, newValue);},
    },
  },
};
</script>
