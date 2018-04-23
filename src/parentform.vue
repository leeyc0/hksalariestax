<template>
<form autocomplete="off">
  <table border="1">
    <tbody>
      <tr><td title="僅作識別之用，可隨意輸入">父母/祖父母/外祖父母<img src="../icon/info.png" class="icon"></td><parentforminputtextfield v-for="(parentObject,index) in parents" :key="index" :index="index" :parentObject="parentObject" field="name" /></tr>
      <tr><td>年齡</td><parentformselectfield v-for="(parentObject,index) in parents" :key="index" :index="index" :parentObject="parentObject" field="age" /></tr>
      <tr><td>傷殘</td><parentformcheckboxfield v-for="(parentObject,index) in parents" :key="index" :index="index" :parentObject="parentObject" field="disabledParent" /></tr>
    </tbody>
  </table>
  <input type="button" v-on:click="addParent" value="新增父母/祖父母/外祖父母" />
</form>
</template>

<script>
"use strict";
import Vuex from 'vuex';
import parentforminputtextfield from "./parentforminputtextfield";
import parentformcheckboxfield from "./parentformcheckboxfield";
import parentformselectfield from "./parentformselectfield";

function addParent(event) {
  this.$store.dispatch('addParent');
  event.preventDefault();
}

function parentFormFieldUpdate(vueObj, newValue) {
  let args = {
    index: vueObj.index,
    field: vueObj.field,
    value: newValue,
  };
  vueObj.$store.dispatch('parentFormFieldUpdate', args);
}

export default {
  name: "parentform",
  components: {parentforminputtextfield, parentformcheckboxfield, parentformselectfield},
  computed: Vuex.mapState(['parents']),
  methods: {
    addParent,
  },
};

export {parentFormFieldUpdate};
</script>
