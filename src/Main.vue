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
    <button type="button" @click="autocalculate">自動分配免稅額</button>
  </div>
  <div id="taxpayerform" class="border">
    納稅人
    <button type="button" @click="addTaxPayer">新增</button>
    <button type="button" @click="computeTax()">全部計算</button>
    <br/>
    <div v-for="[i, taxPayer] of taxPayerMap" :key="i" class="taxPayerInput">
      <div>
        <input size="12" :value="taxPayer.name" @change="changeTaxPayerProp({ i, prop: 'name', val: $event.target.value })" /><br />
        稅款 <input size="10" readonly :value="taxPayerResult.get(i) === undefined ? '0' : formatNumber(taxPayerResult.get(i).taxPayable)" />
        <button type="button" @click="showTaxPayerModal(i)">填寫報稅表</button>
        <button type="button" @click="deleteTaxPayer(i)">刪除</button><br/>
        健全兄弟姊妹
        <input :value="taxPayer.siblings" @change="changeTaxPayerProp({ i, prop: 'siblings', val: parseInt($event.target.value) })" type="number" min="0" />
        傷殘兄弟姊妹
        <input :value="taxPayer.disabledSiblings" @change="changeTaxPayerProp({ i, prop: 'disabledSiblings', val: parseInt($event.target.value) })" type="number" min="0" />
        <br />
        健全兄弟姊妹（{{$root.taxYear2}}年度年滿）
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
    <button type="button" @click="addParent">新增</button><br/>
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
<taxpayer ref="taxpayer" v-if="taxPayerMap.get(showTaxPayerIndex) !== undefined" :tax-payer="taxPayerMap.get(showTaxPayerIndex)"
  :index="showTaxPayerIndex" @showTaxResult="showTaxResult" @opened="taxpayerOpen" @before-close="taxpayerClose" />
<taxresult ref="taxresult" v-if="taxPayerResult.get(showTaxPayerIndex) !== undefined" :tax-result="taxPayerResult.get(showTaxPayerIndex)"
  :index="showTaxPayerIndex" @opened="taxresultOpen" @before-close="taxresultClose" />
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

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import taxrule from './taxrule.js'
import { autocalculate } from './autocalculate.js'
import taxpayer from './taxPayer.vue'
import taxresult from './taxResult.vue'

const numberFormatter = new Intl.NumberFormat()

export default {
  name: 'TaxCalculator',
  data: () => ({
    taxYear1: '2025/26',
    taxYear2: '2026/27',
    showTaxPayerIndex: 1,
    taxPayerResult: new Map(),
    totalSiblings: 0,
    totalSiblings18: 0,
    totalDisabledSiblings: 0
  }),
  computed: {
    ...mapState(['taxPayerMap', 'parentMap']),
    ...mapGetters(['parentsClaimedByTaxpayer'])
  },
  components: {
    taxpayer,
    taxresult
  },
  created () {
    this.computeTax()
  },
  methods: {
    showTaxPayerModal (i) {
      this.showTaxPayerIndex = i
      this.$vfm.show('taxPayerModal')
    },
    disableModalMethod () {
      this.showTaxPayerIndex = NaN
    },
    ...mapMutations(['addParent', 'deleteParent', 'changeTaxPayerProp', 'changeParentProp']),
    addTaxPayer () {
      this.$store.commit('addTaxPayer')
      if (isNaN(this.showTaxPayerIndex)) {
        this.showTaxPayerIndex = this.taxPayerMap.keys().next().value
        this.computeTax()
      }
      this.computeTax()
    },
    deleteTaxPayer (i) {
      this.$store.commit('deleteTaxPayer', i)
      this.taxPayerResult.delete(i)
      if (i === this.showTaxPayerIndex) {
        const nextVal = this.taxPayerMap.keys().next()
        if (nextVal.done) {
          this.showTaxPayerIndex = NaN
        } else {
          this.computeTax()
          this.showTaxPayerIndex = nextVal.value
        }
      }
    },
    computeTax () {
      const parentsMapForTaxpayable = this.$store.getters.parentsClaimedByTaxpayer
      for (const i of this.taxPayerMap.keys()) {
        const taxResult = taxrule.taxPayable(this.taxPayerMap.get(i), parentsMapForTaxpayable.get(i))
        this.taxPayerResult.set(i, taxResult)
      }
    },
    showTaxResult () {
      this.computeTax()
      this.$vfm.hide('taxPayerModal')
      this.$vfm.show('taxResultModal')
    },
    setParentClaimedBy (parentId, taxPayerId) {
      this.$store.commit('setParentClaimedBy', { parentId, taxPayerId })
    },
    setParentLivingTogether (event, parentId, taxPayerId) {
      this.$store.commit('setParentLivingTogether', { parentId, taxPayerId, livingTogether: event.target.checked })
    },
    taxpayerOpenKeydownListener (event) {
      if (event.key === 'Enter') {
        document.activeElement.dispatchEvent(new Event('change'))
        this.showTaxResult()
      }
    },
    taxresultOpenKeydownListener (event) {
      if (event.key === 'Backspace') {
        this.$vfm.hide('taxResultModal')
        this.$vfm.show('taxPayerModal')
      }
    },
    taxpayerOpen () {
      this.$refs.taxpayer.$el.addEventListener('keydown', this.taxpayerOpenKeydownListener)
    },
    taxpayerClose () {
      this.$refs.taxpayer.$el.removeEventListener('keydown', this.taxpayerOpenKeydownListener)
    },
    taxresultOpen () {
      this.$refs.taxresult.$el.addEventListener('keydown', this.taxresultOpenKeydownListener)
    },
    taxresultClose () {
      this.$refs.taxresult.$el.removeEventListener('keydown', this.taxresultOpenKeydownListener)
    },
    formatNumber: (num) => numberFormatter.format(num),
    autocalculate
  }
}
</script>
