<template>
<vue-final-modal name="taxResultModal" v-model="show"
  :esc-to-close="true" classes="modal-container" content-class="modal-content taxResultModalWidth">
  <div class="taxResultRoot">
    <div class="border taxResult">
      <table>
        <tr>
          <th colspan="2">{{$root.taxYear1}}年度</th>
        </tr>
        <tr>
          <th colspan="2">累進稅率</th>
        </tr>
        <tr>
          <td>總入息</td>
          <td>{{formatNumber(taxResult.taxThisYear.income)}}</td>
        </tr>
        <tr>
          <td>減：扣除項目：強積金僱員供款</td>
          <td>{{formatNumber(taxResult.taxThisYear.mpf)}}</td>
        </tr>
        <tr>
          <td>減：其他扣除項目</td>
          <td>{{formatNumber(taxResult.taxThisYear.otherDeductions)}}</td>
        </tr>
        <tr>
          <td>減：基本免稅額</td>
          <td>{{formatNumber(taxResult.taxThisYear.basicAllowance)}}</td>
        </tr>
        <tr>
          <td>減：已婚人士免稅額</td>
          <td>{{formatNumber(taxResult.taxThisYear.marriedAllowance)}}</td>
        </tr>
        <tr>
          <td>減：供養父母/祖父母/外祖父母免稅額</td>
          <td>{{formatNumber(taxResult.taxThisYear.parentAllowance)}}</td>
        </tr>
        <tr>
          <td>減：供養兄弟姊妹免稅額</td>
          <td>{{formatNumber(taxResult.taxThisYear.siblingAllowance|formatNumber)}}</td>
        </tr>
        <tr>
          <td>減：子女免稅額</td>
          <td>{{formatNumber(taxResult.taxThisYear.childAllowance)}}</td>
        </tr>
        <tr>
          <td>減：單親免稅額</td>
          <td>{{formatNumber(taxResult.taxThisYear.singleParentAllowance)}}</td>
        </tr>
        <tr>
          <td>減：傷殘受養人免稅額</td>
          <td>{{formatNumber(taxResult.taxThisYear.disabledDependentAllowance)}}</td>
        </tr>
        <tr>
          <td>減：傷殘人士免稅額</td>
          <td>{{formatNumber(taxResult.taxThisYear.personalDisabilityAllowance)}}</td>
        </tr>
        <tr>
          <td>應課稅入息</td>
          <td>{{formatNumber(taxResult.taxThisYear.taxableIncome)}}</td>
        </tr>
        <tr>
          <th colspan="2">累進稅率稅款計算</th>
        </tr>
        <tr v-for="(tax,index) in taxResult.taxThisYear.progressiveTaxBreakdown" :key="index">
          <td>{{progressiveTaxPrefix(index,taxResult.taxThisYear.progressiveTaxBreakdown)+formatNumber(tax.step)}}@{{tax.rate+"%"}}</td>
          <td>{{formatNumber(tax.tax)}}</td>
        </tr>
        <tr v-for="i in progressiveThisYearExtraLines" :key="i">
          <td colspan="2">&nbsp;</td>
        </tr>
        <tr>
          <th colspan="2">標準稅率</th>
        </tr>
        <tr>
          <td>總入息</td>
          <td>{{formatNumber(taxResult.taxThisYear.income)}}</td>
        </tr>
        <tr>
          <td>減：扣除項目：強積金僱員供款</td>
          <td>{{formatNumber(taxResult.taxThisYear.mpf)}}</td>
        </tr>
        <tr>
          <td>減：其他扣除項目</td>
          <td>{{formatNumber(taxResult.taxThisYear.otherDeductions)}}</td>
        </tr>
        <tr>
          <td>應課稅入息</td>
          <td>{{formatNumber(taxResult.taxThisYear.taxableIncomeStdRate)}}</td>
        </tr>
        <tr>
          <td>標準稅率稅款計算：全數@{{taxResult.taxThisYear.stdRate}}%</td>
          <td>{{formatNumber(taxResult.taxThisYear.stdRateTax)}}</td>
        </tr>
        <tr>
          <th colspan="2">{{$root.taxYear1}}年度最終稅款</th>
        </tr>
        <tr>
          <td>適用稅率：{{taxResult.taxThisYear.rate=="progressiveTax" ? "累進稅率" : "標準稅率"}}</td>
          <td>{{formatNumber(taxResult.taxThisYear.tax)}}</td>
        </tr>
        <tr>
          <td>減：{{$root.taxYear1}}年度暫繳稅實額</td>
          <td>{{formatNumber(taxResult.taxThisYearProvisional)}}</td>
        </tr>
        <tr>
          <td>減：稅務寬減</td>
          <td>{{formatNumber(taxResult.rebate)}}</td>
        </tr>
        <tr>
          <th>{{$root.taxYear1}}年度最終稅款</th>
          <th>{{formatNumber(taxResult.taxThisYearFinal)}}</th>
        </tr>
      </table>
    </div>
    <div class="border taxResult">
      <table>
        <tr>
          <th colspan="2">{{$root.taxYear2}}年度</th>
        </tr>
        <tr>
          <th colspan="2">累進稅率</th>
        </tr>
        <tr>
          <td>總入息</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.income)}}</td>
        </tr>
        <tr>
          <td>減：扣除項目：強積金僱員供款</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.mpf)}}</td>
        </tr>
        <tr>
          <td>減：其他扣除項目</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.otherDeductions)}}</td>
        </tr>
        <tr>
          <td>減：基本免稅額</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.basicAllowance)}}</td>
        </tr>
        <tr>
          <td>減：已婚人士免稅額</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.marriedAllowance)}}</td>
        </tr>
        <tr>
          <td>減：供養父母/祖父母/外祖父母免稅額</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.parentAllowance)}}</td>
        </tr>
        <tr>
          <td>減：供養兄弟姊妹免稅額</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.siblingAllowance|formatNumber)}}</td>
        </tr>
        <tr>
          <td>減：子女免稅額</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.childAllowance)}}</td>
        </tr>
        <tr>
          <td>減：單親免稅額</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.singleParentAllowance)}}</td>
        </tr>
        <tr>
          <td>減：傷殘受養人免稅額</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.disabledDependentAllowance)}}</td>
        </tr>
        <tr>
          <td>減：傷殘人士免稅額</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.personalDisabilityAllowance)}}</td>
        </tr>
        <tr>
          <td>應課稅入息</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.taxableIncome)}}</td>
        </tr>
        <tr>
          <th colspan="2">累進稅率稅款計算</th>
        </tr>
        <tr v-for="(tax,index) in taxResult.taxNextYearProvisional.progressiveTaxBreakdown" :key="index">
          <td>{{progressiveTaxPrefix(index,taxResult.taxNextYearProvisional.progressiveTaxBreakdown)+formatNumber(tax.step)}}@{{tax.rate+"%"}}</td>
          <td>{{formatNumber(tax.tax)}}</td>
        </tr>
        <tr v-for="i in progressiveNextYearExtraLines" :key="i">
          <td colspan="2">&nbsp;</td>
        </tr>
        <tr>
          <th colspan="2">標準稅率</th>
        </tr>
        <tr>
          <td>總入息</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.income)}}</td>
        </tr>
        <tr>
          <td>減：扣除項目：強積金僱員供款</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.mpf)}}</td>
        </tr>
        <tr>
          <td>減：其他扣除項目</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.otherDeductions)}}</td>
        </tr>
        <tr>
          <td>應課稅入息</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.taxableIncomeStdRate)}}</td>
        </tr>
        <tr>
          <td>標準稅率稅款計算：全數@{{taxResult.taxNextYearProvisional.stdRate}}%</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.stdRateTax)}}</td>
        </tr>
        <tr>
          <th colspan="2">{{$root.taxYear1}}年度暫繳稅</th>
        </tr>
        <tr>
          <td>適用稅率：{{taxResult.taxNextYearProvisional.rate=="progressiveTax" ? "累進稅率" : "標準稅率"}}</td>
          <td>{{formatNumber(taxResult.taxNextYearProvisional.tax)}}</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <th>{{$root.taxYear2}}年度暫繳稅</th>
          <th>{{formatNumber(taxResult.taxNextYearProvisional.tax)}}</th>
        </tr>
      </table>
    </div>
    <div class="taxPayable">
      總稅款：{{formatNumber(taxResult.taxPayable)}}
    </div>
    <div class="button">
      <button type="button" @click="back()">返回報稅表 (<span style="text-decoration: underline">Backspace</span>)</button>
      <button type="button" @click="disableModalMethod()">關閉</button>
    </div>
  </div>
</vue-final-modal>
</template>

<style>
@media (min-width: 800px) {
  .taxResultModalWidth {
    width: 700px
  }
}
</style>

<style scoped>
.taxResultRoot {
  display: grid;
  grid-template-columns: repeat(auto-fill, 350px);
}

table {
  text-align: left;
}

.taxResult, .taxPayable {
  padding: 5px;
}

.taxPayable {
  font-weight: bold;
  grid-column: 1/-1;
}

.button {
  grid-column: 1/-1;
}
</style>

<script>
const numberFormatter = new Intl.NumberFormat()

export default {
  props: ['taxResult'],
  data: () => ({
    show: false
  }),
  computed: {
    progressiveThisYearExtraLines () {
      const lines = this.taxResult.taxNextYearProvisional.progressiveTaxBreakdown.length - this.taxResult.taxThisYear.progressiveTaxBreakdown.length
      return lines < 0 ? 0 : lines
    },
    progressiveNextYearExtraLines () {
      const lines = this.taxResult.taxThisYear.progressiveTaxBreakdown.length - this.taxResult.taxNextYearProvisional.progressiveTaxBreakdown.length
      return lines < 0 ? 0 : lines
    }
  },
  methods: {
    back () {
      this.$vfm.hide('taxResultModal')
      this.$vfm.show('taxPayerModal')
    },
    disableModalMethod () {
      this.$vfm.hide('taxResultModal')
    },
    progressiveTaxPrefix (index, progressiveTaxBreakdown) {
      if (progressiveTaxBreakdown.length === 1) {
        return '全數'
      } else if (index === 0) {
        return '首'
      } else if (index === progressiveTaxBreakdown.length - 1) {
        return '餘'
      } else {
        return '次'
      }
    },
    formatNumber: (num) => numberFormatter.format(num)
  }
}
</script>
