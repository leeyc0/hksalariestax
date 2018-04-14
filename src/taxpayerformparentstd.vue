<template>
<td :key="taxpayerindex">
  <taxpayerformparentsfield v-for="(parent,parentindex) in parents" :key="parentindex" :taxpayerindex="taxpayerindex" :parentindex="parentindex" :parent="parent" />
</td>
</template>

<script>
"use strict";
import taxpayerformparentsfield from "./taxpayerformparentsfield";

export default {
  name: 'taxpayerformparentstd',
  props: ['taxpayerindex', 'taxpayer', 'parents'],
  components: {taxpayerformparentsfield},
};
</script>
