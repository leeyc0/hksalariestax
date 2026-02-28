<template>
<VueFinalModal class="modal-container" content-class="modal-content taxResultModalWidth" @keydown="keydownEventlistener">
  <div class="taxResultRoot">
    <div class="border taxResult">
      <table>
        <tbody>
          <tr>
            <th colspan="2">{{props.taxYear1}}年度</th>
          </tr>
          <tr>
            <th colspan="2">累進稅率</th>
          </tr>
          <tr>
            <td>總入息</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.income)}}</td>
          </tr>
          <tr>
            <td>減：扣除項目：強積金僱員供款</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.mpf)}}</td>
          </tr>
          <tr>
            <td>減：其他扣除項目</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.otherDeductions)}}</td>
          </tr>
          <tr>
            <td>減：基本免稅額</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.basicAllowance)}}</td>
          </tr>
          <tr>
            <td>減：已婚人士免稅額</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.marriedAllowance)}}</td>
          </tr>
          <tr>
            <td>減：供養父母/祖父母/外祖父母免稅額</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.parentAllowance)}}</td>
          </tr>
          <tr>
            <td>減：供養兄弟姊妹免稅額</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.siblingAllowance | formatNumber)}}</td>
          </tr>
          <tr>
            <td>減：子女免稅額</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.childAllowance)}}</td>
          </tr>
          <tr>
            <td>減：單親免稅額</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.singleParentAllowance)}}</td>
          </tr>
          <tr>
            <td>減：傷殘受養人免稅額</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.disabledDependentAllowance)}}</td>
          </tr>
          <tr>
            <td>減：傷殘人士免稅額</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.personalDisabilityAllowance)}}</td>
          </tr>
          <tr>
            <td>應課稅入息</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.taxableIncome)}}</td>
          </tr>
          <tr>
            <th colspan="2">累進稅率稅款計算</th>
          </tr>
          <tr v-for="(tax, index) in props.taxResult.taxThisYear.progressiveTaxBreakdown" :key="index">
            <td>{{progressiveTaxPrefix(index, props.taxResult.taxThisYear.progressiveTaxBreakdown) + formatNumber(tax.step)}}@{{tax.rate + "%"}}</td>
            <td>{{formatNumber(tax.tax)}}</td>
          </tr>
          <tr v-for="i in progressiveThisYearExtraLines" :key="i">
            <td colspan="2">&nbsp;</td>
          </tr>
          <tr>
            <th class="beforeline">按累進稅率計算之稅款：</th>
            <th class="beforeline">{{formatNumber(props.taxResult.taxThisYear.progressiveTax)}}</th>
          </tr>
          <tr>
            <th colspan="2" class="line">標準稅率</th>
          </tr>
          <tr>
            <td>總入息</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.income)}}</td>
          </tr>
          <tr>
            <td>減：扣除項目：強積金僱員供款</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.mpf)}}</td>
          </tr>
          <tr>
            <td>減：其他扣除項目</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.otherDeductions)}}</td>
          </tr>
          <tr>
            <td>應課稅入息</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.taxableIncomeStdRate)}}</td>
          </tr>
          <tr>
            <th colspan="2">標準稅率稅款計算</th>
          </tr>
          <tr v-for="(tax, index) in props.taxResult.taxThisYear.stdRateTaxBreakdown" :key="index">
            <td>{{progressiveTaxPrefix(index, props.taxResult.taxThisYear.stdRateTaxBreakdown) + formatNumber(tax.step)}}@{{tax.rate + "%"}}</td>
            <td>{{formatNumber(tax.tax)}}</td>
          </tr>
          <tr v-for="i in stdRateThisYearExtraLines" :key="i">
            <td colspan="2">&nbsp;</td>
          </tr>
          <tr>
            <th class="beforeline">按標準稅率計算之稅款：</th>
            <th class="beforeline">{{formatNumber(props.taxResult.taxThisYear.stdRateTax)}}</th>
          </tr>
          <tr>
            <th colspan="2" class="line">{{props.taxYear1}}年度最終稅款</th>
          </tr>
          <tr>
            <td>適用稅率：{{props.taxResult.taxThisYear.rate === "progressiveTax" ? "累進稅率" : "標準稅率"}}</td>
            <td>{{formatNumber(props.taxResult.taxThisYear.tax)}}</td>
          </tr>
          <tr>
            <td>減：{{props.taxYear1}}年度暫繳稅實額</td>
            <td>{{formatNumber(props.taxResult.taxThisYearProvisional)}}</td>
          </tr>
          <tr>
            <td>減：稅務寬減</td>
            <td>{{formatNumber(props.taxResult.rebate)}}</td>
          </tr>
          <tr>
            <th>{{props.taxYear1}}年度最終稅款</th>
            <th>{{formatNumber(props.taxResult.taxThisYearFinal)}}</th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="border taxResult">
      <table>
        <tbody>
          <tr>
            <th colspan="2">{{props.taxYear2}}年度</th>
          </tr>
          <tr>
            <th colspan="2">累進稅率</th>
          </tr>
          <tr>
            <td>總入息</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.income)}}</td>
          </tr>
          <tr>
            <td>減：扣除項目：強積金僱員供款</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.mpf)}}</td>
          </tr>
          <tr>
            <td>減：其他扣除項目</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.otherDeductions)}}</td>
          </tr>
          <tr>
            <td>減：基本免稅額</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.basicAllowance)}}</td>
          </tr>
          <tr>
            <td>減：已婚人士免稅額</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.marriedAllowance)}}</td>
          </tr>
          <tr>
            <td>減：供養父母/祖父母/外祖父母免稅額</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.parentAllowance)}}</td>
          </tr>
          <tr>
            <td>減：供養兄弟姊妹免稅額</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.siblingAllowance | formatNumber)}}</td>
          </tr>
          <tr>
            <td>減：子女免稅額</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.childAllowance)}}</td>
          </tr>
          <tr>
            <td>減：單親免稅額</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.singleParentAllowance)}}</td>
          </tr>
          <tr>
            <td>減：傷殘受養人免稅額</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.disabledDependentAllowance)}}</td>
          </tr>
          <tr>
            <td>減：傷殘人士免稅額</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.personalDisabilityAllowance)}}</td>
          </tr>
          <tr>
            <td>應課稅入息</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.taxableIncome)}}</td>
          </tr>
          <tr>
            <th colspan="2">累進稅率稅款計算</th>
          </tr>
          <tr v-for="(tax, index) in props.taxResult.taxNextYearProvisional.progressiveTaxBreakdown" :key="index">
            <td>{{progressiveTaxPrefix(index, props.taxResult.taxNextYearProvisional.progressiveTaxBreakdown) + formatNumber(tax.step)}}@{{tax.rate + "%"}}</td>
            <td>{{formatNumber(tax.tax)}}</td>
          </tr>
          <tr v-for="i in progressiveNextYearExtraLines" :key="i">
            <td colspan="2">&nbsp;</td>
          </tr>
          <tr>
            <th class="beforeline">按累進稅率計算之稅款：</th>
            <th class="beforeline">{{formatNumber(props.taxResult.taxNextYearProvisional.progressiveTax)}}</th>
          </tr>
          <tr>
            <th colspan="2" class="line">標準稅率</th>
          </tr>
          <tr>
            <td>總入息</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.income)}}</td>
          </tr>
          <tr>
            <td>減：扣除項目：強積金僱員供款</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.mpf)}}</td>
          </tr>
          <tr>
            <td>減：其他扣除項目</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.otherDeductions)}}</td>
          </tr>
          <tr>
            <td>應課稅入息</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.taxableIncomeStdRate)}}</td>
          </tr>
          <tr>
            <th colspan="2">標準稅率稅款計算</th>
          </tr>
          <tr v-for="(tax, index) in props.taxResult.taxNextYearProvisional.stdRateTaxBreakdown" :key="index">
            <td>{{progressiveTaxPrefix(index, props.taxResult.taxNextYearProvisional.stdRateTaxBreakdown) + formatNumber(tax.step)}}@{{tax.rate + "%"}}</td>
            <td>{{formatNumber(tax.tax)}}</td>
          </tr>
          <tr v-for="i in stdRateNextYearExtraLines" :key="i">
            <td colspan="2">&nbsp;</td>
          </tr>
          <tr>
            <th class="beforeline">按標準稅率計算之稅款：</th>
            <th class="beforeline">{{formatNumber(props.taxResult.taxNextYearProvisional.stdRateTax)}}</th>
          </tr>
          <tr>
            <th colspan="2" class="line">{{props.taxYear1}}年度暫繳稅</th>
          </tr>
          <tr>
            <td>適用稅率：{{props.taxResult.taxNextYearProvisional.rate === "progressiveTax" ? "累進稅率" : "標準稅率"}}</td>
            <td>{{formatNumber(props.taxResult.taxNextYearProvisional.tax)}}</td>
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
            <th>{{props.taxYear2}}年度暫繳稅</th>
            <th>{{formatNumber(props.taxResult.taxNextYearProvisional.tax)}}</th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="taxPayable">
      總稅款：{{formatNumber(props.taxResult.taxPayable)}}
    </div>
    <div class="button">
      <button type="button" @click="$emit('backToTaxPayerModal')">返回報稅表 (<span style="text-decoration: underline">Backspace</span>)</button>
      <button type="button" @click="$emit('closeTaxResultModal')">關閉</button>
    </div>
  </div>
</VueFinalModal>
</template>

<style>
@media (min-width: 800px) {
  .taxResultModalWidth {
    width: 700px
  }
}
</style>

<style scoped>
table {
  border-collapse: collapse;
}

.beforeline {
  padding-bottom: 5px;
}

.line {
  border-top: 1px solid black;
  padding-top: 5px;
}

.taxResultRoot {
  display: grid;
  grid-template-columns: repeat(auto-fill, 350px);
}

.taxResult th:nth-child(1), .taxResult td:nth-child(1) {
  text-align: left;
}

.taxResult th:nth-child(2), .taxResult td:nth-child(2) {
  text-align: right;
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

<script setup>
import { computed } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

const numberFormatter = new Intl.NumberFormat()

const props = defineProps(['taxResult', 'taxYear1', 'taxYear2'])
const emit = defineEmits(['closeTaxResultModal', 'backToTaxPayerModal'])

function keydownEventlistener (event) {
  if (event.key === 'Backspace') {
    emit('backToTaxPayerModal')
  }
}

function progressiveTaxPrefix (index, progressiveTaxBreakdown) {
  if (progressiveTaxBreakdown.length === 1) {
    return '全數'
  } else if (index === 0) {
    return '首'
  } else if (index === progressiveTaxBreakdown.length - 1) {
    return '餘'
  } else {
    return '次'
  }
}

function formatNumber (num) {
  return numberFormatter.format(num)
}

const progressiveThisYearExtraLines = computed(() => {
  const lines = props.taxResult.taxNextYearProvisional.progressiveTaxBreakdown.length - props.taxResult.taxThisYear.progressiveTaxBreakdown.length
  return lines < 0 ? 0 : lines
})

const progressiveNextYearExtraLines = computed(() => {
  const lines = props.taxResult.taxThisYear.progressiveTaxBreakdown.length - props.taxResult.taxNextYearProvisional.progressiveTaxBreakdown.length
  return lines < 0 ? 0 : lines
})

const stdRateThisYearExtraLines = computed(() => {
  const lines = props.taxResult.taxNextYearProvisional.stdRateTaxBreakdown.length - props.taxResult.taxThisYear.stdRateTaxBreakdown.length
  return lines < 0 ? 0 : lines
})

const stdRateNextYearExtraLines = computed(() => {
  const lines = props.taxResult.taxThisYear.stdRateTaxBreakdown.length - props.taxResult.taxNextYearProvisional.stdRateTaxBreakdown.length
  return lines < 0 ? 0 : lines
})
</script>
