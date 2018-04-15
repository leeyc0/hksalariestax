"use strict";
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import obj from "./objects.js";
import taxrule from "./taxrule.js";

const initialState = {
  taxpayers: {},
  parents: {},
  taxpayerId: 1,
  parentId: 1,
  taxresults: {},
  totalSiblings: 0,
  totalDisabledSiblings: 0,
};
initialState.taxpayers[initialState.taxpayerId] = new obj.TaxPayer("納稅人1", 0, 0, 0, 0, 0, 0, 0, 0, 0);
initialState.taxresults[initialState.taxpayerId] = {taxPayable: null};
initialState.taxpayerId++;

function addTaxPayer(state) {
  Vue.set(state.taxpayers, state.taxpayerId, new obj.TaxPayer("納稅人"+state.taxpayerId, 0, 0, 0, 0, 0, 0, 0, 0, 0));
  Vue.set(state.taxresults, state.taxpayerId, {taxPayable: null});
  for (let id of Object.keys(state.parents)) {
    Vue.set(state.parents[id].livingTogether, state.taxpayerId, false);
  }
  state.taxpayerId++;
}

function deleteTaxPayer(state, index) {
  Vue.delete(state.taxpayers, index);
  Vue.delete(state.taxresults, index);
  for (let id of Object.keys(state.parents)) {
    Vue.delete(state.parents[id].livingTogether, index);
    // re-select taxpayer if the selected one is deleted
    if (state.parents[id].claimedBy == index) {
      Vue.set(state.parents[id], "claimedBy", store.getters.firsttaxpayerId);
    }
  }
}

function taxPayerFormTextFieldUpdate(state, args) {
  Vue.set(state.taxpayers[args.index], args.field, args.value);
}

function addParent(state) {
  let livingTogether = {};
  Vue.set(state.parents, state.parentId, new obj.Parent("父母"+state.parentId, false, false, livingTogether, store.getters.firsttaxpayerId));
  for (let id of Object.keys(state.taxpayers)) {
    livingTogether[id] = false;
  }
  state.parentId++;
}

function deleteParent(state, index) {
  Vue.delete(state.parents, index);
}

function parentFormFieldUpdate(state, args) {
  Vue.set(state.parents[args.index], args.field, args.value);
}

function updateTaxPayerClaimParent(state, args) {
  Vue.set(state.parents[args.parentindex], "claimedBy", parseInt(args.taxpayerindex));
}

function updateTaxPayerParentLivingTogether(state, args) {
  let newLivingTogether = Object.assign({}, state.parents[args.parentindex].livingTogether,
                          {[args.taxpayerindex]: args.livingTogether});
  Vue.set(state.parents[args.parentindex], "livingTogether", newLivingTogether);
}

function computeTaxPerTaxPayer(state, taxPayerId) {
  let income = state.taxpayers[taxPayerId].income;
  let mpf = state.taxpayers[taxPayerId].mpf;
  let otherDeductionsThisYear = state.taxpayers[taxPayerId].otherDeductionsThisYear;
  let otherDeductionsNextYear = state.taxpayers[taxPayerId].otherDeductionsNextYear;
  let otherAllowancesThisYear = state.taxpayers[taxPayerId].otherAllowancesThisYear;
  let otherAllowancesNextYear = state.taxpayers[taxPayerId].otherAllowancesNextYear;
  let parents = {livingTogether: 0, nonLivingTogether: 0, livingTogether55: 0, nonLivingTogether55: 0};
  let siblings = state.taxpayers[taxPayerId].siblings;
  let disabledDependents = state.taxpayers[taxPayerId].disabledSiblings;
  let provisionalTax = state.taxpayers[taxPayerId].provisionalTax;
  for (let parentObject of Object.values(state.parents)) {
    if (parentObject.claimedBy == taxPayerId) {
      if (parentObject.disabledParent) {
        disabledDependents++;
      }
      if (parentObject.over65) {
        if (parentObject.livingTogether[taxPayerId]) {
          parents.livingTogether++;
        } else {
          parents.nonLivingTogether++;
        }
      } else {
        if (parentObject.livingTogether[taxPayerId]) {
          parents.livingTogether55++;
        } else {
          parents.nonLivingTogether55++;
        }
      }
    }
  }
  let taxResult = taxrule.taxPayable(income, mpf, otherDeductionsThisYear, otherDeductionsNextYear,
                                     otherAllowancesThisYear, otherAllowancesNextYear,
                                     parents, siblings, disabledDependents, provisionalTax);
  return taxResult;
}

function computeTax(state) {
  for (let id of Object.keys(state.taxpayers)) {
    let taxResult = computeTaxPerTaxPayer(state, id);
    Vue.set(state.taxresults, id, taxResult);
  }
}

function updateTotalSiblings(state, totalSiblings) {
  Vue.set(state, "totalSiblings", totalSiblings);
}

function updateTotalDisabledSiblings(state, totalDisabledSiblings) {
  Vue.set(state, "totalDisabledSiblings", totalDisabledSiblings);
}

let store = new Vuex.Store({
  state: initialState,
  mutations: {
    addTaxPayer,
    deleteTaxPayer,
    taxPayerFormTextFieldUpdate,
    addParent,
    deleteParent,
    parentFormFieldUpdate,
    updateTaxPayerClaimParent,
    updateTaxPayerParentLivingTogether,
    computeTax,
    updateTotalSiblings,
    updateTotalDisabledSiblings,
  },
  actions: {
    addTaxPayer: () => store.commit('addTaxPayer'),
    deleteTaxPayer: ({getters, state}, index) => store.commit('deleteTaxPayer', index),
    taxPayerFormTextFieldUpdate: ({getters, state}, args) => store.commit('taxPayerFormTextFieldUpdate', args),
    addParent: () => store.commit('addParent'),
    deleteParent: ({getters, state}, index) => store.commit('deleteParent', index),
    parentFormFieldUpdate: ({getters, state}, args) => store.commit('parentFormFieldUpdate', args),
    updateTaxPayerClaimParent: ({getters, state}, args) => store.commit('updateTaxPayerClaimParent', args),
    updateTaxPayerParentLivingTogether: ({getters, state}, args) => store.commit('updateTaxPayerParentLivingTogether', args),
    computeTax: () => store.commit("computeTax"),
    updateTotalSiblings: ({getters, state}, totalSiblings) => store.commit("updateTotalSiblings", totalSiblings),
    updateTotalDisabledSiblings: ({getters, state}, totalDisabledSiblings) => store.commit("updateTotalDisabledSiblings", totalDisabledSiblings),
  },
  getters: {
    firsttaxpayerId: (state) => parseInt(Object.keys(state.taxpayers)[0]),
  },
});

export default {store};
export {computeTaxPerTaxPayer};
