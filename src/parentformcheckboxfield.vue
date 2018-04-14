<template>
<td><input type="checkbox" v-model="value" /></td>
</template>

<script>
"use strict";
import {parentFormFieldUpdate} from "./parentform";

export default {
  props: ['index', 'parentObject', 'field'],
  computed: {
    value: {
      get: function() {return this.parentObject[this.field];},
      set: function(newValue) {parentFormFieldUpdate(this.index, this.field, newValue);},
    },
  },
};
</script>
