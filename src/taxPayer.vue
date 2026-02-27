<template>
<VueFinalModal class="modal-container" content-class="modal-content" @keydown="keydownEventlistener">
  <div>
    <table>
      <tbody>
        <tr>
          <td>納稅人</td>
          <td><input v-model.lazy="name" /></td>
        </tr>
        <tr>
          <td>傷殘納稅人</td>
          <td><input v-model.lazy="disabledPerson" type="checkbox" /></td>
        </tr>
        <tr>
          <td>夫婦合併評稅/單親</td>
          <td>
          <select v-model.lazy.number="martialStatus">
            <option :value="0">單身或夫婦分別評稅</option>
            <option :value="1">夫婦合併評稅</option>
            <option :value="2">於{{props.taxYear1}}課稅年度開始單親</option>
            <option :value="3">於整個{{props.taxYear1}}課稅年度單親</option>
          </select>
          </td>
        </tr>
        <tr>
          <td>總入息</td>
          <td><input v-model.lazy="income" type="text" pattern="[0-9,]*[0-9]" /></td>
        </tr>
        <tr>
          <td><span class="comment" title="報稅表申報項目位於「第4部薪俸稅 → 4.3 扣除 → (4)以僱員身分付給認可退休計劃的強制性供款」">強積金/認可退休計劃僱員供款</span></td>
          <td><input v-model.lazy="mpf" type="text" pattern="[0-9,]*[0-9]" /></td>
        </tr>
        <tr>
          <td>適用於{{props.taxYear1}}年度的其他扣除項目</td>
          <td><input v-model.lazy="otherDeductionsThisYear" type="text" pattern="[0-9,]*[0-9]" /></td>
        </tr>
        <tr>
          <td>適用於{{props.taxYear2}}年度的其他扣除項目</td>
          <td><input v-model.lazy="otherDeductionsNextYear" type="text" pattern="[0-9,]*[0-9]" /></td>
        </tr>
        <tr>
          <td><span class="comment" title="請參閱上年稅單暫繳稅項目">{{props.taxYear1}}年度暫繳稅實額</span></td>
          <td><input v-model.lazy="provisionalTax" type="text" pattern="[0-9,]*[0-9]" /></td>
        </tr>
        <tr>
          <td>受供養父母/祖父母/外祖父母</td>
          <td>
            <div v-for="[i, parent] of parentMap" :key="i">
              {{parent.name}}
              <label><input type="radio" :checked="parent.claimedBy === index" @change="setParentClaimedBy(i)" />申索</label>
              <label><input type="checkbox" :checked="parent.livingTogether.get(index)" @change="setParentLivingTogether($event, i)" />全年同住</label>
            </div>
          </td>
        </tr>
        <tr>
          <td>受供養兄弟姊妹數目</td>
          <td>
            <input v-model.lazy.number="siblings" type="number" min="0" />健全&nbsp;
            <input v-model.lazy.number="disabledSiblings" type="number" min="0" />傷殘
          </td>
        </tr>
        <tr>
          <td>受供養健全兄弟姊妹數目<br/>（{{props.taxYear2}}年度失去資格）</td>
          <td><input v-model.lazy.number="siblings18" type="number" min="0" /></td>
        </tr>
        <tr>
          <td>子女數目（不包括新生子女）</td>
          <td><input v-model.lazy.number="children" type="number" min="0" /></td>
        </tr>
        <tr>
          <td>子女數目<br/>（{{props.taxYear2}}年度失去資格）</td>
          <td><input v-model.lazy.number="children18" type="number" min="0" /></td>
        </tr>
        <tr>
          <td>{{props.taxYear1}}年度新生子女數目</td>
          <td><input v-model.lazy.number="newbornChildrenThisYear" type="number" min="0" /></td>
        </tr>
        <tr>
          <td>{{props.taxYear2}}年度新生子女數目</td>
          <td><input v-model.lazy.number="newbornChildrenNextYear" type="number" min="0" /></td>
        </tr>
        <tr>
          <td>受供養傷殘配偶及子女數目</td>
          <td><input v-model.lazy.number="otherDisabledDependants" type="number" min="0" /></td>
        </tr>
      </tbody>
    </table>
    <button type="button" @click="$emit('openTaxResultModal')">計算稅款</button>
    <button type="button" @click="$emit('closeTaxPayerModal')">關閉</button>
  </div>
</VueFinalModal>
</template>

<style scoped>
input[type=number] {
  width: 3em;
}

.comment {
  text-decoration: underline dashed 0.1em;
  cursor: help;
}

table, tr, td {
  border: 1px solid black;
}

td {
  padding: 3px;
}

table {
  border-collapse: collapse;
  margin-bottom: 5px;
}
</style>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { VueFinalModal } from 'vue-final-modal'
import { useTaxStore } from '@/stores/tax'

const store = useTaxStore()
const { parentMap } = storeToRefs(store)

const numberFormatter = new Intl.NumberFormat()

const props = defineProps(['taxPayer', 'index', 'taxYear1', 'taxYear2'])
const emit = defineEmits(['openTaxResultModal', 'closeTaxPayerModal'])

function keydownEventlistener (event) {
  if (event.key === 'Enter') {
    document.activeElement.dispatchEvent(new Event('change'))
    emit('openTaxResultModal')
  }
}

function setParentClaimedBy (parentId) {
  store.setParentClaimedBy({ parentId, taxPayerId: props.index })
}

function setParentLivingTogether (event, parentId) {
  store.setParentLivingTogether({ parentId, taxPayerId: props.index, livingTogether: event.target.checked })
}

function parseNumberWithComma (num) {
  return parseInt(num.replace(/,/g, ''))
}

const name = computed({
  get () { return props.taxPayer.name },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'name', val }) }
})

const disabledPerson = computed({
  get () { return props.taxPayer.disabledPerson },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'disabledPerson', val }) }
})

const martialStatus = computed({
  get () { return props.taxPayer.martialStatus },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'martialStatus', val }) }
})

const income = computed({
  get () { return numberFormatter.format(props.taxPayer.income) },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'income', val: parseNumberWithComma(val) }) }
})

const mpf = computed({
  get () { return numberFormatter.format(props.taxPayer.mpf) },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'mpf', val: parseNumberWithComma(val) }) }
})

const otherDeductionsThisYear = computed({
  get () { return numberFormatter.format(props.taxPayer.otherDeductionsThisYear) },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'otherDeductionsThisYear', val: parseNumberWithComma(val) }) }
})

const otherDeductionsNextYear = computed({
  get () { return numberFormatter.format(props.taxPayer.otherDeductionsNextYear) },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'otherDeductionsNextYear', val: parseNumberWithComma(val) }) }
})

const provisionalTax = computed({
  get () { return numberFormatter.format(props.taxPayer.provisionalTax) },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'provisionalTax', val: parseNumberWithComma(val) }) }
})

const siblings = computed({
  get () { return numberFormatter.format(props.taxPayer.siblings) },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'siblings', val }) }
})

const siblings18 = computed({
  get () { return numberFormatter.format(props.taxPayer.siblings18) },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'siblings18', val }) }
})
const disabledSiblings = computed({
  get () { return numberFormatter.format(props.taxPayer.disabledSiblings) },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'disabledSiblings', val }) }
})

const children = computed({
  get () { return numberFormatter.format(props.taxPayer.children) },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'children', val }) }
})

const children18 = computed({
  get () { return numberFormatter.format(props.taxPayer.children18) },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'children18', val }) }
})

const newbornChildrenThisYear = computed({
  get () { return numberFormatter.format(props.taxPayer.newbornChildrenThisYear) },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'newbornChildrenThisYear', val }) }
})

const newbornChildrenNextYear = computed({
  get () { return numberFormatter.format(props.taxPayer.newbornChildrenNextYear) },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'newbornChildrenNextYear', val }) }
})

const otherDisabledDependants = computed({
  get () { return numberFormatter.format(props.taxPayer.otherDisabledDependants) },
  set (val) { store.changeTaxPayerProp({ i: props.index, prop: 'otherDisabledDependants', val }) }
})
</script>
