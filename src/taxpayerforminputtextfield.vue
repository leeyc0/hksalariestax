<template>
<td>
  <input :type="type" v-model="value" />
  <img src="../icon/cancel.png" v-if="this.field==='name'" title="刪除" class="icon cursorpointer" v-on:click="deleteTaxPayer">
</td>
</template>

<script>
import taxpayerformstore from "./taxpayerformstore.js";

function updateTaxPayerTextField(index, field, newValue) {
  let args = {
    index: index,
    field: field,
    value: newValue,
  };
  taxpayerformstore.store.dispatch('taxPayerFormTextFieldUpdate', args);
}

export default {
  name: 'taxpayerforminputtextfield',
  props: ['index', 'taxpayer', 'field'],
  computed: {
    value: {
      get: function() {return this.taxpayer[this.field];},
      set: function(newValue) {updateTaxPayerTextField(this.index, this.field, newValue);},
    },
    type: function() {return this.field==="name" ? "text" : "number";},
  },
  methods: {
    deleteTaxPayer: function(event) {
      taxpayerformstore.store.dispatch('deleteTaxPayer', this.index);
      event.preventDefault();
    },
  },
};

</script>
