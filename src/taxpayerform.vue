<template>
<form autocomplete="off">
  <fieldset style="margin-bottom: 20px; width: 30%;">
    <legend>自動分配免稅額專用選項</legend>
    <table>
      <tr><td>受供養健全兄弟姊妹總數</td><td><input type="number" v-model.number="totalSiblings" /></td></tr>
      <tr><td>受供養健全兄弟姊妹總數<br>（{{taxYear2}}年度失去資格）</td><td><input type="number" v-model.number="totalSiblings18" /></td></tr>
      <tr><td>受供養傷殘兄弟姊妹總數</td><td><input type="number" v-model.number="totalDisabledSiblings" /></td></tr>
    </table>
  </fieldset>
  <table border="1">
    <tbody>
      <tr><td title="僅作識別之用，可隨意輸入">納稅人<img src="../icon/info.png" class="icon"></td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="name" /></tr>
      <tr><td title="指納稅人本身">傷殘<img src="../icon/info.png" class="icon"></td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="disabledPerson" /></tr>
      <tr><td>夫婦合併評稅/單親</td><taxpayerformmartialstatusfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="martialStatus" /></tr>
      <tr><td>總入息</td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="income" /></tr>
      <tr><td title="報稅表申報項目位於「第4部薪俸稅 → 4.3 扣除 → (4)以僱員身分付給認可退休計劃的強制性供款」">強積金/認可退休計劃僱員供款<img src="../icon/info.png" class="icon"></td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="mpf" /></tr>
      <tr><td>適用於{{taxYear1}}年度的其他扣除項目</td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="otherDeductionsThisYear" /></tr>
      <tr><td>適用於{{taxYear2}}年度的其他扣除項目</td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="otherDeductionsNextYear" /></tr>
      <tr><td title="請參閱上年稅單暫繳稅項目">{{taxYear1}}年度暫繳稅實額<img src="../icon/info.png" class="icon"></td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="provisionalTax" /></tr>
      <tr><td>受供養父母/祖父母/外祖父母</td><taxpayerformparentstd v-for="(taxpayer,index) in taxpayers" :key=index :taxpayerindex=index :taxpayer="taxpayer" :parents="parents" /></tr>
      <tr><td>受供養健全兄弟姊妹數目</td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="siblings" /></tr>
      <tr><td>受供養健全兄弟姊妹數目<br>（{{taxYear2}}年度失去資格）</td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="siblings18" /></tr>
      <tr><td>受供養傷殘兄弟姊妹數目</td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="disabledSiblings" /></tr>
      <tr><td>子女數目（不包括新生子女）</td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="children" /></tr>
      <tr><td>子女數目<br>（{{taxYear2}}年度失去資格）</td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="children18" /></tr>
      <tr><td>{{taxYear1}}年度新生子女數目</td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="newbornChildrenThisYear" /></tr>
      <tr><td>{{taxYear2}}年度新生子女數目</td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="newbornChildrenNextYear" /></tr>
      <tr><td>受供養傷殘配偶及子女數目</td><taxpayerforminputtextfield v-for="(taxpayer,index) in taxpayers" :key=index :index=index :taxpayer="taxpayer" field="otherDisabledDependants" /></tr>
      <tr><td title="負數為應退還稅款">應繳/退還稅款<img src="../icon/info.png" class="icon"></td><taxpayable v-for="(taxresult,index) in taxresults" :key=index :index=index :taxresult="taxresult" /></tr>
    </tbody>
  </table>
  <input type="button" v-on:click="addTaxPayer" value="新增納稅人" />
  <input type="button" v-on:click="autocalculate" value="自動分配免稅額" />
  <input type="button" v-on:click="computeTax" value="手動計算稅款" />
</form>
</template>

<script>
"use strict";
import Vuex from 'vuex';
import taxpayable from './taxpayable';
import taxpayerformparentstd from './taxpayerformparentstd';
import taxpayerforminputtextfield from './taxpayerforminputtextfield';
import taxpayerformmartialstatusfield from './taxpayerformmartialstatusfield';
import {autocalculate} from './autocalculate';

function addTaxPayer(event) {
  event.preventDefault();
  this.$store.dispatch('addTaxPayer');
}

function computeTax(event) {
  event.preventDefault();
  this.$store.dispatch('computeTax');
}

export default {
  name: "taxpayerform",
  components: {
    taxpayerforminputtextfield,
    taxpayerformparentstd,
    taxpayable,
    taxpayerformmartialstatusfield,
  },
  computed: {
    ...Vuex.mapState(['taxpayers', 'parents', 'taxresults', 'taxYear1', 'taxYear2']),
    totalSiblings: {
      get() {return this.$store.state.totalSiblings;},
      set(value) {this.$store.dispatch('updateTotalSiblings', value);},
    },
    totalSiblings18: {
      get() {return this.$store.state.totalSiblings18;},
      set(value) {this.$store.dispatch('updateTotalSiblings18', value);},
    },
    totalDisabledSiblings: {
      get() {return this.$store.state.totalDisabledSiblings;},
      set(value) {this.$store.dispatch('updateTotalDisabledSiblings', value);},
    }
  },
  methods: {
    computeTax,
    addTaxPayer,
    autocalculate,
  },
};
</script>


<style>
.icon {
  vertical-align: middle;
}

.cursorpointer {
  cursor: pointer;
}
</style>
