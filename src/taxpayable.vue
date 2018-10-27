<template>
<td>
  {{taxpayable}}
  <img src="../icon/list.png" title="稅項計算明細" class="icon cursorpointer" v-on:click="show">
  <modal :name="taxpayableModalName" width="800" height="auto" :scrollable="true">
    <div>
      <div class="taxtable_div">
        <table v-if="taxresult.taxPayable != null" class="taxtable_table">
          <tr><th colspan="2">{{taxYear1}}年度</th></tr>
          <tr><th colspan="2">累進稅率</th></tr>
          <tr><td>總入息</td><td>{{taxresult.tax2017.income}}</td></tr>
          <tr><td>減：扣除項目：強積金僱員供款</td><td>{{taxresult.tax2017.mpf}}</td></tr>
          <tr><td>減：其他扣除項目</td><td>{{taxresult.tax2017.otherDeductions}}</td></tr>
          <tr><td>減：基本免稅額</td><td>{{taxresult.tax2017.basicAllowance}}</td></tr>
          <tr><td>減：已婚人士免稅額</td><td>{{taxresult.tax2017.marriedAllowance}}</td></tr>
          <tr><td>減：供養父母/祖父母/外祖父母免稅額</td><td>{{taxresult.tax2017.parentAllowance}}</td></tr>
          <tr><td>減：供養兄弟姊妹免稅額</td><td>{{taxresult.tax2017.siblingAllowance}}</td></tr>
          <tr><td>減：子女免稅額</td><td>{{taxresult.tax2017.childAllowance}}</td></tr>
          <tr><td>減：單親免稅額</td><td>{{taxresult.tax2017.singleParentAllowance}}</td></tr>
          <tr><td>減：傷殘受養人免稅額</td><td>{{taxresult.tax2017.disabledDependentAllowance}}</td></tr>
          <tr><td>減：傷殘人士免稅額</td><td>{{taxresult.tax2017.personalDisabilityAllowance}}</td></tr>
          <tr><td>應課稅入息</td><td>{{taxresult.tax2017.taxableIncome}}</td></tr>
          <tr><th colspan="2">累進稅率稅款計算</th></tr>
          <tr v-for="(tax,index) in taxresult.tax2017.progressiveTaxBreakdown" :key="index"><td>{{progressiveTaxPrefix(index,taxresult.tax2017.progressiveTaxBreakdown)+tax.step}}@{{tax.rate+"%"}}</td><td>{{tax.tax}}</td></tr>
          <tr v-for="i in progressive2017ExtraLines" :key="'progressive2017ExtraLines'+i"><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>累進稅率稅款：</td><td>{{taxresult.tax2017.progressiveTax}}</td></tr>
          <tr><td colspan="2"></td></tr>
          <tr><th colspan="2">標準稅率</th></tr>
          <tr><td>總入息</td><td>{{taxresult.tax2017.income}}</td></tr>
          <tr><td>減：扣除項目：強積金僱員供款</td><td>{{taxresult.tax2017.mpf}}</td></tr>
          <tr><td>減：其他扣除項目</td><td>{{taxresult.tax2017.otherDeductions}}</td></tr>
          <tr><td>應課稅入息</td><td>{{taxresult.tax2017.taxableIncomeStdRate}}</td></tr>
          <tr><td>標準稅率稅款計算：全數@{{taxresult.tax2017.stdRate}}%</td><td>{{taxresult.tax2017.stdRateTax}}</td>
          <tr><td colspan="2"></td></tr>
          <tr><th colspan="2">{{taxYear1}}年度最終稅款</th>
          <tr><td>適用稅率：{{taxresult.tax2017.rate=="progressiveTax" ? "累進稅率" : "標準稅率"}}</td><td>{{taxresult.tax2017.tax}}</td></tr>
          <tr><td>減：{{taxYear1}}年度暫繳稅實額</td><td>{{taxresult.tax2017Provisional}}</td></tr>
          <tr><td>減：稅務寬減</td><td>{{taxresult.rebate}}</td></tr>
          <tr><th>{{taxYear1}}年度最終稅款</th><th>{{taxresult.tax2017.tax - taxresult.tax2017Provisional - taxresult.rebate}}</th></tr>
        </table>
      </div>
      <div class="taxtable_div">
        <table v-if="taxresult.taxPayable != null" class="taxtable_table">
          <tr><th colspan="2">{{taxYear2}}年度</th></tr>
          <tr><th colspan="2">累進稅率</th></tr>
          <tr><td>總入息</td><td>{{taxresult.tax2018Provisional.income}}</td></tr>
          <tr><td>減：扣除項目：強積金僱員供款</td><td>{{taxresult.tax2018Provisional.mpf}}</td></tr>
          <tr><td>減：其他扣除項目</td><td>{{taxresult.tax2018Provisional.otherDeductions}}</td></tr>
          <tr><td>減：基本免稅額</td><td>{{taxresult.tax2018Provisional.basicAllowance}}</td></tr>
          <tr><td>減：已婚人士免稅額</td><td>{{taxresult.tax2018Provisional.marriedAllowance}}</td></tr>
          <tr><td>減：供養父母/祖父母/外祖父母免稅額</td><td>{{taxresult.tax2018Provisional.parentAllowance}}</td></tr>
          <tr><td>減：供養兄弟姊妹免稅額</td><td>{{taxresult.tax2018Provisional.siblingAllowance}}</td></tr>
          <tr><td>減：子女免稅額</td><td>{{taxresult.tax2018Provisional.childAllowance}}</td></tr>
          <tr><td>減：單親免稅額</td><td>{{taxresult.tax2018Provisional.singleParentAllowance}}</td></tr>
          <tr><td>減：傷殘受養人免稅額</td><td>{{taxresult.tax2018Provisional.disabledDependentAllowance}}</td></tr>
          <tr><td>減：傷殘人士免稅額</td><td>{{taxresult.tax2018Provisional.personalDisabilityAllowance}}</td></tr>
          <tr><td>應課稅入息</td><td>{{taxresult.tax2018Provisional.taxableIncome}}</td></tr>
          <tr><th colspan="2">累進稅率稅款計算</th></tr>
          <tr v-for="(tax,index) in taxresult.tax2018Provisional.progressiveTaxBreakdown" :key="index"><td>{{progressiveTaxPrefix(index,taxresult.tax2018Provisional.progressiveTaxBreakdown)+tax.step}}@{{tax.rate+"%"}}</td><td>{{tax.tax}}</td></tr>
          <tr v-for="i in progressive2018ExtraLines" :key="'progressive2018ExtraLines'+i"><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>累進稅率稅款：</td><td>{{taxresult.tax2018Provisional.progressiveTax}}</td></tr>
          <tr><td colspan="2"></td></tr>
          <tr><th colspan="2">標準稅率</th></tr>
          <tr><td>總入息</td><td>{{taxresult.tax2018Provisional.income}}</td></tr>
          <tr><td>減：扣除項目：強積金僱員供款</td><td>{{taxresult.tax2018Provisional.mpf}}</td></tr>
          <tr><td>減：其他扣除項目</td><td>{{taxresult.tax2018Provisional.otherDeductions}}</td></tr>
          <tr><td>應課稅入息</td><td>{{taxresult.tax2018Provisional.taxableIncomeStdRate}}</td></tr>
          <tr><td>標準稅率稅款計算：全數@{{taxresult.tax2018Provisional.stdRate}}%</td><td>{{taxresult.tax2018Provisional.stdRateTax}}</td>
          <tr><td colspan="2"></td></tr>
          <tr><th colspan="2">{{taxYear2}}年度暫繳稅</th>
          <tr><td>適用稅率：{{taxresult.tax2018Provisional.rate=="progressiveTax" ? "累進稅率" : "標準稅率"}}</td><td>{{taxresult.tax2018Provisional.tax}}</td></tr>
          <tr v-for="i in 2" :key="'dummy'+i"><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><th>{{taxYear2}}年度暫繳稅</th><th>{{taxresult.tax2018Provisional.tax}}</th></tr>
        </table>
      </div>
    </div>
  </modal>
</td>
</template>

<script>
"use strict";
import Vue from 'vue';
import Vuex from 'vuex';
import VModal from 'vue-js-modal';
/* eslint no-unused-vars: "off" */
Vue.use(VModal);

export default {
  name: 'taxpayable',
  props: ['taxresult', 'index'],
  computed: {
    ...Vuex.mapState(['taxYear1', 'taxYear2']),
    taxpayable: function() {return this.taxresult.taxPayable;},
    breakdown: function() {return JSON.stringify(this.taxresult, null, 2);},
    taxpayableModalName: function() {return "taxpayableModal"+this.index;},
    progressive2017ExtraLines: function() {
      let lines = this.taxresult.tax2018Provisional.progressiveTaxBreakdown.length - this.taxresult.tax2017.progressiveTaxBreakdown.length;
      return lines<0 ? 0 : lines;
    },
    progressive2018ExtraLines: function() {
      let lines = this.taxresult.tax2017.progressiveTaxBreakdown.length - this.taxresult.tax2018Provisional.progressiveTaxBreakdown.length;
      return lines<0 ? 0 : lines;
    },
  },
  methods: {
    show() {
      this.$modal.show(this.taxpayableModalName);
    },
    hide() {
      this.$modal.hide(this.taxpayableModalName);
    },
    progressiveTaxPrefix(index, progressiveTaxBreakdown) {
      if (progressiveTaxBreakdown.length==1) {
        return "全數";
      } else if (index==0) {
        return "首";
      } else if (index==progressiveTaxBreakdown.length-1) {
        return "餘";
      } else {
        return "次";
      }
    },
  },
};
</script>

<style scoped>
.taxtable_div {
  display: inline;
  margin: 20px;
}

.taxtable_table {
  display: inline;
}
</style>
