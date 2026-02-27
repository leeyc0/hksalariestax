'use strict'

import combinatorics from './combinatorics.js'
import taxrule from './taxrule.js'

export function autocalculate (store, totalSiblings, totalSiblings18, totalDisabledSiblings) {
  const parentList = []
  const taxpayerList = []
  let minimumState = null
  let minimumTax = Infinity

  for (const i of store.parentMap.keys()) {
    parentList.push(i)
  }

  for (const i of store.taxPayerMap.keys()) {
    taxpayerList.push(i)
  }

  for (const parentCombo of combinatorics.distinglishableBallInBoxes(parentList, taxpayerList)) {
    for (const siblingCombo of combinatorics.indistinglishableBallInBoxes(totalSiblings, taxpayerList)) {
      for (const sibling18Combo of combinatorics.indistinglishableBallInBoxes(totalSiblings18, taxpayerList)) {
        for (const disabledSiblingCombo of combinatorics.indistinglishableBallInBoxes(totalDisabledSiblings, taxpayerList)) {
          let totalTax = 0
          const tempState = Object.assign({}, store)
          tempState.parentMap = new Map(store.parentMap)
          tempState.taxPayerMap = new Map(store.taxPayerMap)
          for (const [parentId, parent] of store.parentMap) {
            tempState.parentMap.set(parentId, Object.assign({}, parent))
          }

          const parentsMapForTaxpayable = new Map()
          for (const taxpayerId of store.taxPayerMap.keys()) {
            parentsMapForTaxpayable.set(taxpayerId, [])
            for (const parentId of parentCombo.get(taxpayerId)) {
              const parent = tempState.parentMap.get(parentId)
              const parentsForTaxpayable = parentsMapForTaxpayable.get(taxpayerId)
              parent.claimedBy = taxpayerId
              parentsForTaxpayable.push({ id: parentId, name: parent.name, age: parent.age, livingTogether: parent.livingTogether.get(parent.claimedBy) })
              parentsMapForTaxpayable.set(parent.claimedBy, parentsForTaxpayable)
            }
          }

          for (const [taxpayerId, taxPayer] of store.taxPayerMap) {
            const taxPayerClone = Object.assign({}, taxPayer)
            tempState.taxPayerMap.set(taxpayerId, taxPayerClone)

            taxPayerClone.siblings = siblingCombo.get(taxpayerId)
            taxPayerClone.siblings18 = sibling18Combo.get(taxpayerId)
            taxPayerClone.disabledSiblings = disabledSiblingCombo.get(taxpayerId)

            const taxPayable = taxrule.taxPayable(taxPayerClone, parentsMapForTaxpayable.get(taxpayerId))
            totalTax += taxPayable.taxPayable
          }
          if (totalTax < minimumTax) {
            minimumTax = totalTax
            minimumState = tempState
          }

          console.log({
            totalTax,
            parentCombo: new Map(parentCombo),
            siblingCombo: new Map(siblingCombo),
            sibling18Combo: new Map(sibling18Combo),
            disabledSiblingCombo: new Map(disabledSiblingCombo)
          })
        }
      }
    }
  }
  store.$patch(minimumState)
}
