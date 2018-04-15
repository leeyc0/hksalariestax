<template>
<td>
  <input :type="type" v-model="value" />
  <img src="../icon/cancel.png" v-if="this.field==='name'" title="刪除" class="icon cursorpointer" v-on:click="deleteTaxPayer">
</td>
</template>

<script>

function updateTaxPayerTextField(vueObj, newValue) {
  let args = {
    index: vueObj.index,
    field: vueObj.field,
    value: newValue,
  };
  vueObj.$store.dispatch('taxPayerFormTextFieldUpdate', args);
}

export default {
  name: 'taxpayerforminputtextfield',
  props: ['index', 'taxpayer', 'field'],
  computed: {
    value: {
      get: function() {return this.taxpayer[this.field];},
      set: function(newValue) {updateTaxPayerTextField(this, newValue);},
    },
    type: function() {return this.field==="name" ? "text" : "number";},
  },
  methods: {
    deleteTaxPayer: function(event) {
      this.$store.dispatch('deleteTaxPayer', this.index);
      event.preventDefault();
    },
  },
};

</script>
