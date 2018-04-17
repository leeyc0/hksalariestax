<template>
<div>{{name}}
  <input type="radio" :id="radioid" :name="radioname" :value="taxpayerindex" v-model.number="claim" /><label :for="radioid">申索</label>
  <input type="checkbox" :id="checkboxid" v-model="livingTogether" /><label :for="checkboxid">全年同住</label>
</div>
</template>

<script>
"use strict";

function updateTaxPayerClaimParent(vueObj, taxpayerindex) {
  let args = {
    parentindex: vueObj.parentindex,
    taxpayerindex: taxpayerindex,
  };
  vueObj.$store.dispatch('updateTaxPayerClaimParent', args);
}

function updateTaxPayerParentLivingTogether(vueObj, livingTogether) {
  let args = {
    parentindex: vueObj.parentindex,
    taxpayerindex: vueObj.taxpayerindex,
    livingTogether: livingTogether,
  };
  vueObj.$store.dispatch('updateTaxPayerParentLivingTogether', args);
}

export default {
  name: "taxpayerformparentsfield",
  props: ['taxpayerindex', 'parentindex', 'parent'],
  computed: {
    name: function() {return this.parent.name;},
    claim: {
      get: function() {return this.parent.claimedBy;},
      set: function(taxpayerindex) {updateTaxPayerClaimParent(this, taxpayerindex);},
    },
    livingTogether: {
      get: function() {return this.parent.livingTogether[this.taxpayerindex];},
      set: function(livingTogether) {updateTaxPayerParentLivingTogether(this, livingTogether);},
    },
    radioid: function() {return "taxpayerform-parent-claim-" + this.parentindex + "-" + this.taxpayerindex;},
    radioname: function() {return "taxpayerform-parent-claim-" + this.parentindex;},
    checkboxid: function() {return "taxpayerform-parent-livingtogether-" + this.parentindex + "-" + this.taxpayerindex;},
  },
};
</script>
