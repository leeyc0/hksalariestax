<template>
<h1>薪俸稅計算機</h1>
<div id="version">
根據 {{taxYear2}} 年度財政預算案制定<br/>
<a href="https://github.com/leeyc0/hksalariestax/wiki">使用說明</a> <a href="https://github.com/leeyc0/hksalariestax/">Source code</a>
</div>
<div id="formLayout">
  <div id="autocalculate" class="border">
    自動分配免稅額專用選項
    <table>
      <tbody>
        <tr><td>受供養健全兄弟姊妹總數</td><td><input type="number" v-model.number="totalSiblings" /></td></tr>
        <tr><td>受供養健全兄弟姊妹總數<br>（{{taxYear2}}年度失去資格）</td><td><input type="number" v-model.number="totalSiblings18" /></td></tr>
        <tr><td>受供養傷殘兄弟姊妹總數</td><td><input type="number" v-model.number="totalDisabledSiblings" /></td></tr>
      </tbody>
    </table>
    <button type="button" @click="optimizeTax()">自動分配免稅額</button>
  </div>
  <div id="taxpayerform" class="border">
    納稅人
    <button type="button" @click="addTaxPayer()">新增</button>
    <button type="button" @click="computeTax()">全部計算</button>
    <br/>
    <div v-for="[i, taxPayer] of taxPayerMap" :key="i" class="taxPayerInput">
      <div>
        <input size="12" :value="taxPayer.name" @change="changeTaxPayerProp({ i, prop: 'name', val: $event.target.value })" /><br />
        稅款 <input size="10" readonly :value="taxPayerResult.get(i) === undefined ? '0' : formatNumber(taxPayerResult.get(i).taxPayable)" />
        <button type="button" @click="openTaxPayerButton(i)">填寫報稅表</button>
        <button type="button" @click="deleteTaxPayer(i)">刪除</button><br/>
        健全兄弟姊妹
        <input :value="taxPayer.siblings" @change="changeTaxPayerProp({ i, prop: 'siblings', val: parseInt($event.target.value) })" type="number" min="0" />
        傷殘兄弟姊妹
        <input :value="taxPayer.disabledSiblings" @change="changeTaxPayerProp({ i, prop: 'disabledSiblings', val: parseInt($event.target.value) })" type="number" min="0" />
        <br />
        健全兄弟姊妹（{{taxYear2}}年度年滿）
        <input :value="taxPayer.siblings18" @change="changeTaxPayerProp({ i, prop: 'siblings18', val: parseInt($event.target.value) })" type="number" min="0" />
        <br />
        父母免稅額
        <div class="flex">
          <div v-for="parent in parentsClaimedByTaxpayer.get(i)" :key="parent.id" class="parentTag">
            {{parent.name}}
          </div>
          <div v-if="parentsClaimedByTaxpayer.get(i).length === 0">
            （無）
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="parentform" class="border">
    受供養父母
    <button type="button" @click="addParent()">新增</button><br/>
    <div v-for="[i, parent] of parentMap" :key="i" class="parentInput">
      <div>
        <input :value="parent.name" @change="changeParentProp({ i, prop: 'name', val: $event.target.value })" />
        <select @change="changeParentProp({ i, prop: 'age', val: parseInt($event.target.value) })">
          <option :value="0" v-bind:selected="parent.age === 0">傷殘——不論年齡</option>
          <optgroup label="以下選項均非傷殘人士"/>
          <option :value="1" v-bind:selected="parent.age === 1">於{{taxYear1}}年度滿54歲</option>
          <option :value="2" v-bind:selected="parent.age === 2">於{{taxYear1}}年度滿55歲</option>
          <option :value="3" v-bind:selected="parent.age === 3">於{{taxYear1}}年度滿59歲</option>
          <option :value="4" v-bind:selected="parent.age === 4">於{{taxYear1}}年度滿60歲</option>
        </select>
        <button type="button" @click="deleteParent(i)">刪除</button><br/>
      </div>
      <div class="flex">
        <div v-for="[taxPayerId, taxPayer] of taxPayerMap" :key="taxPayerId">
          <label>
            <input type="radio" :name="'parent'.concat(i)" :checked="parent.claimedBy === taxPayerId"
              @change="setParentClaimedBy(i, taxPayerId)" /> {{taxPayer.name}}
          </label>
          <label>
            <input type="checkbox" :checked="parent.livingTogether.get(taxPayerId)"
              @change="setParentLivingTogether($event, i, taxPayerId)" /> 全年同住
          </label>
        </div>
      </div>
    </div>
  </div>
</div>
<ModalsContainer />
</template>

<style>
.modal-container {
  display: flex;
    align-items: flex-start;
  overflow: auto;
}

.modal-content {
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: 30px;
  background-color: white;
  padding: 16px;
  border-radius: 4px;
}

.flex {
  display: flex;
  flex-wrap: wrap;
}

div.border {
  border: 1px solid black;
}
</style>

<style scoped>
#formLayout {
  display: grid;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  grid-template-columns: repeat(auto-fill, 450px);
  max-width: 910px;
}

h1 {
  line-height: 0.5em;
}

#version {
  padding-bottom: 10px;
}

#autocalculate, #taxpayerform, #parentform {
  padding: 10px;
}

#autocalculate {
  grid-column: 1/-1;
}

.taxPayerInput {
  margin-top: 10px;
  margin-bottom: 10px;
}

.parentInput {
  margin-top: 10px;
  margin-bottom: 10px;
}

.parentTag {
  margin-right: 5px;
}

input[type=number] {
  width: 3em;
}
</style>

<script setup>
import { ref } from 'vue'
import { useModal, ModalsContainer } from 'vue-final-modal'
import { useTaxStore } from '@/stores/tax'
import { storeToRefs } from 'pinia'
import taxrule from '@/taxrule.js'
import { autocalculate } from '@/autocalculate.js'
import TaxPayerComponent from '@/taxPayer.vue'
import TaxResultComponent from '@/taxResult.vue'

// component data
const taxYear1 = ref('2025/26')
const taxYear2 = ref('2026/27')
const showTaxPayerIndex = ref(1)
const taxPayerResult = ref(new Map())
const totalSiblings = ref(0)
const totalSiblings18 = ref(0)
const totalDisabledSiblings = ref(0)

const store = useTaxStore()
const { taxPayerMap, parentMap, parentsClaimedByTaxpayer } = storeToRefs(store)

const numberFormatter = new Intl.NumberFormat()

function formatNumber (num) {
  return numberFormatter.format(num)
}

function optimizeTax() {
  autocalculate(store, totalSiblings.value, totalSiblings18.value, totalDisabledSiblings.value)
  computeTax()
}

function computeTax () {
  for (const i of store.taxPayerMap.keys()) {
    const taxResult = taxrule.taxPayable(store.taxPayerMap.get(i), store.parentsClaimedByTaxpayer.get(i))
    taxPayerResult.value.set(i, taxResult)
  }
}

function addTaxPayer () {
  store.addTaxPayer()
  if (isNaN(showTaxPayerIndex.value)) {
    showTaxPayerIndex.value = store.taxPayerMap.keys().next().value
  }
  computeTax()
}

function deleteTaxPayer (i) {
  store.deleteTaxPayer(i)
  taxPayerResult.value.delete(i)
  if (i === showTaxPayerIndex.value) {
    const nextVal = store.taxPayerMap.keys().next()
    if (nextVal.done) {
      showTaxPayerIndex.value = NaN
    } else {
      this.computeTax()
      showTaxPayerIndex.value = nextVal.value
    }
  }
}

function changeTaxPayerProp (obj) {
  store.changeTaxPayerProp(obj)
}

function addParent () {
  store.addParent()
}

function deleteParent (i) {
  store.deleteParent(i)
}

function changeParentProp (obj) {
  store.changeParentProp(obj)
}

function setParentClaimedBy (parentId, taxPayerId) {
  store.setParentClaimedBy({ parentId, taxPayerId })
}

function setParentLivingTogether (event, parentId, taxPayerId) {
  store.setParentLivingTogether({ parentId, taxPayerId, livingTogether: event.target.checked })
}

function openTaxPayerButton (i) {
  showTaxPayerIndex.value = i
  const { open: openTaxPayerModal, close: closeTaxPayerModal } = useModal({
    component: TaxPayerComponent,
    attrs: {
      taxYear1,
      taxYear2,
      index: showTaxPayerIndex.value,
      taxPayer: store.taxPayerMap.get(showTaxPayerIndex.value),
      onCloseTaxPayerModal () {
        closeTaxPayerModal()
      },
      onOpenTaxResultModal () {
        computeTax()
        closeTaxPayerModal()
        const { open: openTaxResultModal, close: closeTaxResultModal } = useModal({
          component: TaxResultComponent,
          attrs: {
            taxYear1,
            taxYear2,
            taxResult: taxPayerResult.value.get(showTaxPayerIndex.value),
            onCloseTaxResultModal () {
              closeTaxResultModal()
            },
            onBackToTaxPayerModal () {
              closeTaxResultModal()
              openTaxPayerModal()
            }
          }
        })
        openTaxResultModal()
      }
    }
  })
  openTaxPayerModal()
}

computeTax()
</script>
