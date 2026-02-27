import { defineStore } from 'pinia'
import { TaxPayer, Parent } from '../objects.js'

export const useTaxStore = defineStore('tax', {
  state: () => ({
    taxPayerMap: new Map([[1, new TaxPayer('納稅人1')]]),
    taxPayerCounter: 1,
    parentMap: new Map(),
    parentCounter: 0
  }),

  getters: {
    parentsClaimedByTaxpayer (state) {
      const parentsMapForTaxpayable = new Map()
      // Initialize lists for each taxpayer
      for (const taxPayerId of state.taxPayerMap.keys()) {
        parentsMapForTaxpayable.set(taxPayerId, [])
      }
      // Populate lists
      for (const [parentId, parent] of state.parentMap) {
        const parents = parentsMapForTaxpayable.get(parent.claimedBy)
        if (parents) { // Safety check
          parents.push({
            id: parentId,
            name: parent.name,
            age: parent.age,
            livingTogether: parent.livingTogether.get(parent.claimedBy)
          })
        }
      }
      return parentsMapForTaxpayable
    }
  },

  actions: {
    addTaxPayer () {
      this.taxPayerCounter++
      this.taxPayerMap.set(this.taxPayerCounter, new TaxPayer('納稅人'.concat(this.taxPayerCounter)))

      const firstTaxPayerId = this.taxPayerMap.keys().next().value
      for (const parent of this.parentMap.values()) {
        if (parent.claimedBy === undefined) {
          parent.claimedBy = firstTaxPayerId
        }
        // Vue 3 reactivity handles Map updates automatically
        parent.livingTogether.set(this.taxPayerCounter, false)
      }
    },

    deleteTaxPayer (id) {
      this.taxPayerMap.delete(id)
      // Re-assign parents if needed
      if (this.taxPayerMap.size > 0) {
        const firstTaxPayerId = this.taxPayerMap.keys().next().value
        for (const parent of this.parentMap.values()) {
          parent.claimedBy = firstTaxPayerId
          parent.livingTogether.delete(id)
        }
      } else {
        // Handle case where no taxpayers are left (optional safety)
        for (const parent of this.parentMap.values()) {
          parent.claimedBy = undefined
          parent.livingTogether.delete(id)
        }
      }
    },

    changeTaxPayerProp ({ i, prop, val }) {
      const payer = this.taxPayerMap.get(i)
      if (payer) payer[prop] = val
    },

    addParent () {
      // Ensure there is at least one taxpayer to link to
      const firstTaxPayerId = this.taxPayerMap.keys().next().value
      this.parentCounter++
      const newParent = new Parent('父母'.concat(this.parentCounter), firstTaxPayerId)

      for (const i of this.taxPayerMap.keys()) {
        newParent.livingTogether.set(i, false)
      }
      this.parentMap.set(this.parentCounter, newParent)
    },

    deleteParent (id) {
      this.parentMap.delete(id)
    },

    changeParentProp ({ i, prop, val }) {
      const parent = this.parentMap.get(i)
      if (parent) parent[prop] = val
    },

    setParentClaimedBy ({ parentId, taxPayerId }) {
      const parent = this.parentMap.get(parentId)
      if (parent) parent.claimedBy = taxPayerId
    },

    setParentLivingTogether ({ parentId, taxPayerId, livingTogether }) {
      const parent = this.parentMap.get(parentId)
      if (parent) parent.livingTogether.set(taxPayerId, livingTogether)
    }
  }
})
