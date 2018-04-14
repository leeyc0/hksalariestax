<template>
<form>
  <table border="1">
    <tbody>
      <tr><td title="僅作識別之用，可隨意輸入">父母/祖父母/外祖父母<img src="../icon/info.png" class="icon"></td><parentforminputtextfield v-for="(parentObject,index) in parents" :key="index" :index="index" :parentObject="parentObject" field="name" /></tr>
      <tr><td>65歲以上</td><parentformcheckboxfield v-for="(parentObject,index) in parents" :key="index" :index="index" :parentObject="parentObject" field="over65" /></tr>
      <tr><td>傷殘</td><parentformcheckboxfield v-for="(parentObject,index) in parents" :key="index" :index="index" :parentObject="parentObject" field="disabledParent" /></tr>
    </tbody>
  </table>
  <input type="button" v-on:click="addParent" value="新增父母/祖父母/外祖父母" />
</form>
</template>

<script>
"use strict";
import Vuex from 'vuex';
import taxpayerformstore from "./taxpayerformstore.js";
import parentforminputtextfield from "./parentforminputtextfield";
import parentformcheckboxfield from "./parentformcheckboxfield";

function addParent(event) {
  taxpayerformstore.store.dispatch('addParent');
  event.preventDefault();
}

function parentFormFieldUpdate(index, field, newValue) {
  let args = {
    index: index,
    field: field,
    value: newValue,
  };
  taxpayerformstore.store.dispatch('parentFormFieldUpdate', args);
}

export default {
  name: "parentform",
  components: {parentforminputtextfield, parentformcheckboxfield},
  computed: Vuex.mapState(['parents']),
  methods: {
    addParent,
  },
};

export {parentFormFieldUpdate};
</script>
