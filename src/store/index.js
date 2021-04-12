import { createStore } from 'vuex'
import { TaxPayer, Parent } from './objects.js'

export default createStore({
  state: {
    taxPayerMap: new Map([[1, new TaxPayer('納稅人1')]]),
    taxPayerCounter: 1,
    parentMap: new Map(),
    parentCounter: 0
  },
  getters: {
    parentsClaimedByTaxpayer (state) {
      const parentsMapForTaxpayable = new Map()
      for (const taxPayerId of state.taxPayerMap.keys()) {
        parentsMapForTaxpayable.set(taxPayerId, [])
      }
      for (const [parentId, parent] of state.parentMap) {
        const parents = parentsMapForTaxpayable.get(parent.claimedBy)
        parents.push({ id: parentId, name: parent.name, age: parent.age, livingTogether: parent.livingTogether.get(parent.claimedBy) })
        parentsMapForTaxpayable.set(parent.claimedBy, parents)
      }
      return parentsMapForTaxpayable
    }
  },
  mutations: {
    addTaxPayer (state) {
      state.taxPayerCounter++
      state.taxPayerMap.set(state.taxPayerCounter, new TaxPayer('納稅人'.concat(state.taxPayerCounter)))
      const firstTaxPayerId = state.taxPayerMap.keys().next().value
      for (const parent of state.parentMap.values()) {
        if (parent.claimedBy === undefined) {
          parent.claimedBy = firstTaxPayerId
        }
        parent.livingTogether.set(state.taxPayerCounter, false)
      }
    },
    deleteTaxPayer (state, id) {
      state.taxPayerMap.delete(id)
      const firstTaxPayerId = state.taxPayerMap.keys().next().value
      for (const parent of state.parentMap.values()) {
        parent.claimedBy = firstTaxPayerId
        parent.livingTogether.delete(id)
      }
    },
    changeTaxPayerProp (state, { i, prop, val }) {
      state.taxPayerMap.get(i)[prop] = val
    },
    addParent (state) {
      const firstTaxPayerId = state.taxPayerMap.keys().next().value
      state.parentCounter++
      const newParent = new Parent('父母'.concat(state.parentCounter), firstTaxPayerId)
      for (const i of state.taxPayerMap.keys()) {
        newParent.livingTogether.set(i, false)
      }
      state.parentMap.set(state.parentCounter, newParent)
    },
    deleteParent (state, id) {
      state.parentMap.delete(id)
    },
    changeParentProp (state, { i, prop, val }) {
      state.parentMap.get(i)[prop] = val
    },
    setParentClaimedBy (state, { parentId, taxPayerId }) {
      state.parentMap.get(parentId).claimedBy = taxPayerId
    },
    setParentLivingTogether (state, { parentId, taxPayerId, livingTogether }) {
      state.parentMap.get(parentId).livingTogether.set(taxPayerId, livingTogether)
    }
  },
  actions: {
  },
  modules: {
  }
})
