<template>
<td>
  <input :type="type" v-model="value" />
  <img src="../icon/cancel.png" v-if="this.field==='name'" title="刪除" class="icon cursorpointer" v-on:click="deleteParent">
</td>
</template>

<script>
"use strict";
import {parentFormFieldUpdate} from "./parentform";

export default {
  name: 'parentforminputtextfield',
  props: ['index', 'parentObject', 'field'],
  computed: {
    value: {
      get: function() {return this.parentObject[this.field];},
      set: function(newValue) {parentFormFieldUpdate(this, newValue);},
    },
    type: function() {return this.field==="name" ? "text" : "number";},
  },
  methods: {
    deleteParent: function(event) {
      this.$store.dispatch('deleteParent', this.index);
      event.preventDefault();
    },
  },
};
</script>
