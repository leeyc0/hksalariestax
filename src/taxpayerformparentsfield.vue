<template>
<div>{{name}}
  <input type="radio" :id="radioid" :name="radioname" :value="taxpayerindex" v-model="claim" /><label :for="radioid">申報</label>
  <input type="checkbox" :id="checkboxid" v-model="livingTogether" /><label :for="checkboxid">全年同住</label>
</div>
</template>

<script>
"use strict";
import taxpayerformstore from "./taxpayerformstore.js";

function updateTaxPayerClaimParent(parentindex, taxpayerindex) {
  let args = {
    parentindex: parentindex,
    taxpayerindex: taxpayerindex,
  };
  taxpayerformstore.store.dispatch('updateTaxPayerClaimParent', args);
}

function updateTaxPayerParentLivingTogether(parentindex, taxpayerindex, livingTogether) {
  let args = {
    parentindex: parentindex,
    taxpayerindex: taxpayerindex,
    livingTogether: livingTogether,
  };
  taxpayerformstore.store.dispatch('updateTaxPayerParentLivingTogether', args);
}

export default {
  name: "taxpayerformparentsfield",
  props: ['taxpayerindex', 'parentindex', 'parent'],
  computed: {
    name: function() {return this.parent.name;},
    claim: {
      get: function() {return this.parent.claimedBy;},
      set: function(taxpayerindex) {updateTaxPayerClaimParent(this.parentindex, taxpayerindex);},
    },
    livingTogether: {
      get: function() {return this.parent.livingTogether[this.taxpayerindex];},
      set: function(livingTogether) {updateTaxPayerParentLivingTogether(this.parentindex, this.taxpayerindex, livingTogether);},
    },
    radioid: function() {return "taxpayerform-parent-claim-" + this.parentindex + "-" + this.taxpayerindex;},
    radioname: function() {return "taxpayerform-parent-claim-" + this.parentindex;},
    checkboxid: function() {return "taxpayerform-parent-livingtogether-" + this.parentindex + "-" + this.taxpayerindex;},
  },
};
</script>
