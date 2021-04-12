<template>
<vue-final-modal name="taxPayerModal" v-model="show"
  :esc-to-close="true" classes="modal-container" content-class="modal-content">
  <div>
    <table>
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
          <option :value="2">於{{$root.taxYear1}}課稅年度開始單親</option>
          <option :value="3">於整個{{$root.taxYear1}}課稅年度單親</option>
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
        <td>適用於{{$root.taxYear1}}年度的其他扣除項目</td>
        <td><input v-model.lazy="otherDeductionsThisYear" type="text" pattern="[0-9,]*[0-9]" /></td>
      </tr>
      <tr>
        <td>適用於{{$root.taxYear2}}年度的其他扣除項目</td>
        <td><input v-model.lazy="otherDeductionsNextYear" type="text" pattern="[0-9,]*[0-9]" /></td>
      </tr>
      <tr>
        <td><span class="comment" title="請參閱上年稅單暫繳稅項目">{{$root.taxYear1}}年度暫繳稅實額</span></td>
        <td><input v-model.lazy="provisionalTax" type="text" pattern="[0-9,]*[0-9]" /></td>
      </tr>
      <tr>
        <td>受供養父母/祖父母/外祖父母</td>
        <td>
          <div v-for="[i, parent] of $root.parentMap" :key="i">
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
        <td>受供養健全兄弟姊妹數目<br/>（{{$root.taxYear2}}年度失去資格）</td>
        <td><input v-model.lazy.number="siblings18" type="number" min="0" /></td>
      </tr>
      <tr>
        <td>子女數目（不包括新生子女）</td>
        <td><input v-model.lazy.number="children" type="number" min="0" /></td>
      </tr>
      <tr>
        <td>子女數目<br/>（{{$root.taxYear2}}年度失去資格）</td>
        <td><input v-model.lazy.number="children18" type="number" min="0" /></td>
      </tr>
      <tr>
        <td>{{$root.taxYear1}}年度新生子女數目</td>
        <td><input v-model.lazy.number="newbornChildrenThisYear" type="number" min="0" /></td>
      </tr>
      <tr>
        <td>{{$root.taxYear2}}年度新生子女數目</td>
        <td><input v-model.lazy.number="newbornChildrenNextYear" type="number" min="0" /></td>
      </tr>
      <tr>
        <td>受供養傷殘配偶及子女數目</td>
        <td><input v-model.lazy.number="otherDisabledDependants" type="number" min="0" /></td>
      </tr>
    </table>
    <button type="button" @click="$emit('computeTax')">計算稅款</button>
    <button type="button" @click="disableModalMethod()">關閉</button>
  </div>
</vue-final-modal>
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

<script>
const numberFormatter = new Intl.NumberFormat()

function parseNumberWithComma (num) {
  return parseInt(num.replace(/,/g, ''))
}

export default {
  props: ['taxPayer', 'index'],
  data: () => ({
    show: false
  }),
  emits: [
    'computeTax'
  ],
  computed: {
    name: {
      get () { return this.taxPayer.name },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'name', val }) }
    },
    disabledPerson: {
      get () { return this.taxPayer.disabledPerson },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'disabledPerson', val }) }
    },
    martialStatus: {
      get () { return this.taxPayer.martialStatus },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'martialStatus', val }) }
    },
    income: {
      get () { return numberFormatter.format(this.taxPayer.income) },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'income', val: parseNumberWithComma(val) }) }
    },
    mpf: {
      get () { return numberFormatter.format(this.taxPayer.mpf) },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'mpf', val: parseNumberWithComma(val) }) }
    },
    otherDeductionsThisYear: {
      get () { return numberFormatter.format(this.taxPayer.otherDeductionsThisYear) },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'otherDeductionsThisYear', val: parseNumberWithComma(val) }) }
    },
    otherDeductionsNextYear: {
      get () { return numberFormatter.format(this.taxPayer.otherDeductionsNextYear) },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'otherDeductionsNextYear', val: parseNumberWithComma(val) }) }
    },
    provisionalTax: {
      get () { return numberFormatter.format(this.taxPayer.provisionalTax) },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'provisionalTax', val: parseNumberWithComma(val) }) }
    },
    siblings: {
      get () { return numberFormatter.format(this.taxPayer.siblings) },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'siblings', val }) }
    },
    siblings18: {
      get () { return numberFormatter.format(this.taxPayer.siblings18) },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'siblings18', val }) }
    },
    disabledSiblings: {
      get () { return numberFormatter.format(this.taxPayer.disabledSiblings) },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'disabledSiblings', val }) }
    },
    children: {
      get () { return numberFormatter.format(this.taxPayer.children) },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'children', val }) }
    },
    children18: {
      get () { return numberFormatter.format(this.taxPayer.children18) },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'children18', val }) }
    },
    newbornChildrenThisYear: {
      get () { return numberFormatter.format(this.taxPayer.newbornChildrenThisYear) },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'newbornChildrenThisYear', val }) }
    },
    newbornChildrenNextYear: {
      get () { return numberFormatter.format(this.taxPayer.newbornChildrenNextYear) },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'newbornChildrenNextYear', val }) }
    },
    otherDisabledDependants: {
      get () { return numberFormatter.format(this.taxPayer.otherDisabledDependants) },
      set (val) { this.$store.commit('changeTaxPayerProp', { i: this.index, prop: 'otherDisabledDependants', val }) }
    }
  },
  methods: {
    disableModalMethod () {
      this.$vfm.hide('taxPayerModal')
    },
    setParentClaimedBy (parentId) {
      this.$store.commit('setParentClaimedBy', { parentId, taxPayerId: this.index })
    },
    setParentLivingTogether (event, parentId) {
      this.$store.commit('setParentLivingTogether', { parentId, taxPayerId: this.index, livingTogether: event.target.checked })
    }
  }
}
</script>
