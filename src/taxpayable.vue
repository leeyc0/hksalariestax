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
          <tr><td>總入息</td><td>{{taxresult.taxThisYear.income}}</td></tr>
          <tr><td>減：扣除項目：強積金僱員供款</td><td>{{taxresult.taxThisYear.mpf}}</td></tr>
          <tr><td>減：其他扣除項目</td><td>{{taxresult.taxThisYear.otherDeductions}}</td></tr>
          <tr><td>減：基本免稅額</td><td>{{taxresult.taxThisYear.basicAllowance}}</td></tr>
          <tr><td>減：已婚人士免稅額</td><td>{{taxresult.taxThisYear.marriedAllowance}}</td></tr>
          <tr><td>減：供養父母/祖父母/外祖父母免稅額</td><td>{{taxresult.taxThisYear.parentAllowance}}</td></tr>
          <tr><td>減：供養兄弟姊妹免稅額</td><td>{{taxresult.taxThisYear.siblingAllowance}}</td></tr>
          <tr><td>減：子女免稅額</td><td>{{taxresult.taxThisYear.childAllowance}}</td></tr>
          <tr><td>減：單親免稅額</td><td>{{taxresult.taxThisYear.singleParentAllowance}}</td></tr>
          <tr><td>減：傷殘受養人免稅額</td><td>{{taxresult.taxThisYear.disabledDependentAllowance}}</td></tr>
          <tr><td>減：傷殘人士免稅額</td><td>{{taxresult.taxThisYear.personalDisabilityAllowance}}</td></tr>
          <tr><td>應課稅入息</td><td>{{taxresult.taxThisYear.taxableIncome}}</td></tr>
          <tr><th colspan="2">累進稅率稅款計算</th></tr>
          <tr v-for="(tax,index) in taxresult.taxThisYear.progressiveTaxBreakdown" :key="index"><td>{{progressiveTaxPrefix(index,taxresult.taxThisYear.progressiveTaxBreakdown)+tax.step}}@{{tax.rate+"%"}}</td><td>{{tax.tax}}</td></tr>
          <tr v-for="i in progressiveThisYearExtraLines" :key="'progressiveThisYearExtraLines'+i"><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>累進稅率稅款：</td><td>{{taxresult.taxThisYear.progressiveTax}}</td></tr>
          <tr><td colspan="2"></td></tr>
          <tr><th colspan="2">標準稅率</th></tr>
          <tr><td>總入息</td><td>{{taxresult.taxThisYear.income}}</td></tr>
          <tr><td>減：扣除項目：強積金僱員供款</td><td>{{taxresult.taxThisYear.mpf}}</td></tr>
          <tr><td>減：其他扣除項目</td><td>{{taxresult.taxThisYear.otherDeductions}}</td></tr>
          <tr><td>應課稅入息</td><td>{{taxresult.taxThisYear.taxableIncomeStdRate}}</td></tr>
          <tr><td>標準稅率稅款計算：全數@{{taxresult.taxThisYear.stdRate}}%</td><td>{{taxresult.taxThisYear.stdRateTax}}</td>
          <tr><td colspan="2"></td></tr>
          <tr><th colspan="2">{{taxYear1}}年度最終稅款</th>
          <tr><td>適用稅率：{{taxresult.taxThisYear.rate=="progressiveTax" ? "累進稅率" : "標準稅率"}}</td><td>{{taxresult.taxThisYear.tax}}</td></tr>
          <tr><td>減：{{taxYear1}}年度暫繳稅實額</td><td>{{taxresult.taxThisYearProvisional}}</td></tr>
          <tr><td>減：稅務寬減</td><td>{{taxresult.rebate}}</td></tr>
          <tr><th>{{taxYear1}}年度最終稅款</th><th>{{taxresult.taxThisYear.tax - taxresult.taxThisYearProvisional - taxresult.rebate}}</th></tr>
        </table>
      </div>
      <div class="taxtable_div">
        <table v-if="taxresult.taxPayable != null" class="taxtable_table">
          <tr><th colspan="2">{{taxYear2}}年度</th></tr>
          <tr><th colspan="2">累進稅率</th></tr>
          <tr><td>總入息</td><td>{{taxresult.taxNextYearProvisional.income}}</td></tr>
          <tr><td>減：扣除項目：強積金僱員供款</td><td>{{taxresult.taxNextYearProvisional.mpf}}</td></tr>
          <tr><td>減：其他扣除項目</td><td>{{taxresult.taxNextYearProvisional.otherDeductions}}</td></tr>
          <tr><td>減：基本免稅額</td><td>{{taxresult.taxNextYearProvisional.basicAllowance}}</td></tr>
          <tr><td>減：已婚人士免稅額</td><td>{{taxresult.taxNextYearProvisional.marriedAllowance}}</td></tr>
          <tr><td>減：供養父母/祖父母/外祖父母免稅額</td><td>{{taxresult.taxNextYearProvisional.parentAllowance}}</td></tr>
          <tr><td>減：供養兄弟姊妹免稅額</td><td>{{taxresult.taxNextYearProvisional.siblingAllowance}}</td></tr>
          <tr><td>減：子女免稅額</td><td>{{taxresult.taxNextYearProvisional.childAllowance}}</td></tr>
          <tr><td>減：單親免稅額</td><td>{{taxresult.taxNextYearProvisional.singleParentAllowance}}</td></tr>
          <tr><td>減：傷殘受養人免稅額</td><td>{{taxresult.taxNextYearProvisional.disabledDependentAllowance}}</td></tr>
          <tr><td>減：傷殘人士免稅額</td><td>{{taxresult.taxNextYearProvisional.personalDisabilityAllowance}}</td></tr>
          <tr><td>應課稅入息</td><td>{{taxresult.taxNextYearProvisional.taxableIncome}}</td></tr>
          <tr><th colspan="2">累進稅率稅款計算</th></tr>
          <tr v-for="(tax,index) in taxresult.taxNextYearProvisional.progressiveTaxBreakdown" :key="index"><td>{{progressiveTaxPrefix(index,taxresult.taxNextYearProvisional.progressiveTaxBreakdown)+tax.step}}@{{tax.rate+"%"}}</td><td>{{tax.tax}}</td></tr>
          <tr v-for="i in progressiveNextYearExtraLines" :key="'progressiveNextYearExtraLines'+i"><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>累進稅率稅款：</td><td>{{taxresult.taxNextYearProvisional.progressiveTax}}</td></tr>
          <tr><td colspan="2"></td></tr>
          <tr><th colspan="2">標準稅率</th></tr>
          <tr><td>總入息</td><td>{{taxresult.taxNextYearProvisional.income}}</td></tr>
          <tr><td>減：扣除項目：強積金僱員供款</td><td>{{taxresult.taxNextYearProvisional.mpf}}</td></tr>
          <tr><td>減：其他扣除項目</td><td>{{taxresult.taxNextYearProvisional.otherDeductions}}</td></tr>
          <tr><td>應課稅入息</td><td>{{taxresult.taxNextYearProvisional.taxableIncomeStdRate}}</td></tr>
          <tr><td>標準稅率稅款計算：全數@{{taxresult.taxNextYearProvisional.stdRate}}%</td><td>{{taxresult.taxNextYearProvisional.stdRateTax}}</td>
          <tr><td colspan="2"></td></tr>
          <tr><th colspan="2">{{taxYear2}}年度暫繳稅</th>
          <tr><td>適用稅率：{{taxresult.taxNextYearProvisional.rate=="progressiveTax" ? "累進稅率" : "標準稅率"}}</td><td>{{taxresult.taxNextYearProvisional.tax}}</td></tr>
          <tr v-for="i in 2" :key="'dummy'+i"><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><th>{{taxYear2}}年度暫繳稅</th><th>{{taxresult.taxNextYearProvisional.tax}}</th></tr>
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
Vue.use(VModal);

export default {
  name: 'taxpayable',
  props: ['taxresult', 'index'],
  computed: {
    ...Vuex.mapState(['taxYear1', 'taxYear2']),
    taxpayable: function() {return this.taxresult.taxPayable;},
    breakdown: function() {return JSON.stringify(this.taxresult, null, 2);},
    taxpayableModalName: function() {return "taxpayableModal"+this.index;},
    progressiveThisYearExtraLines: function() {
      let lines = this.taxresult.taxNextYearProvisional.progressiveTaxBreakdown.length - this.taxresult.taxThisYear.progressiveTaxBreakdown.length;
      return lines<0 ? 0 : lines;
    },
    progressiveNextYearExtraLines: function() {
      let lines = this.taxresult.taxThisYear.progressiveTaxBreakdown.length - this.taxresult.taxNextYearProvisional.progressiveTaxBreakdown.length;
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
