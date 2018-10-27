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
      set: function(newValue) {
        if (this.type == "number") {
          newValue = parseInt(newValue);
        }
        updateTaxPayerTextField(this, newValue);
      },
    },
    type: function() {
      if (this.field==="name") {
        return "text";
      } else if (this.field==="disabledPerson") {
        return "checkbox";
      } else {
        return "number";
      }
    },
  },
  methods: {
    deleteTaxPayer: function(event) {
      this.$store.dispatch('deleteTaxPayer', this.index);
      event.preventDefault();
    },
  },
};

export {updateTaxPayerTextField};
</script>
