<template>
<td>
<select v-model="value">
  <option :value="0">單身或夫婦分別評稅</option>
  <option :value="1">夫婦合併評稅</option>
  <option :value="2">於{{taxYear1}}課稅年度開始單親</option>
  <option :value="3">於整個{{taxYear1}}課稅年度單親</option>
</select>
</td>
</template>

<script>
"use strict";
import Vuex from 'vuex';
import {updateTaxPayerTextField} from "./taxpayerforminputtextfield";

export default {
  props: ['index', 'taxpayer', 'field'],
  computed: {
    ...Vuex.mapState(['taxYear1', 'taxYear2']),
    value: {
      get: function() {return this.taxpayer[this.field];},
      set: function(newValue) {updateTaxPayerTextField(this, newValue);},
    },
  },
};
</script>