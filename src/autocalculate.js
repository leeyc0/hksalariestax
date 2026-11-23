'use strict'

import combinatorics from './combinatorics.js'
import taxrule from './taxrule.js'
import { useTaxStore } from '@/stores/tax'

function normalizeCount (value) {
  const num = Number(value)
  if (!Number.isFinite(num) || num < 0) {
    return 0
  }
  return Math.floor(num)
}

export function autocalculate (totalSiblings, totalSiblings18, totalDisabledSiblings) {
  const store = useTaxStore()
  totalSiblings = normalizeCount(totalSiblings)
  totalSiblings18 = normalizeCount(totalSiblings18)
  totalDisabledSiblings = normalizeCount(totalDisabledSiblings)

  const parentList = [...store.parentMap.keys()]
  const taxpayerList = [...store.taxPayerMap.keys()]
  if (taxpayerList.length === 0) {
    return false
  }

  let minimumState = null
  let minimumTax = Infinity

  for (const parentCombo of combinatorics.distinguishableBallInBoxes(parentList, taxpayerList)) {
    for (const siblingCombo of combinatorics.indistinguishableBallInBoxes(totalSiblings, taxpayerList)) {
      for (const sibling18Combo of combinatorics.indistinguishableBallInBoxes(totalSiblings18, taxpayerList)) {
        for (const disabledSiblingCombo of combinatorics.indistinguishableBallInBoxes(totalDisabledSiblings, taxpayerList)) {
          let totalTax = 0

          const parentMap = new Map()
          for (const [parentId, parent] of store.parentMap) {
            parentMap.set(parentId, Object.assign({}, parent, { livingTogether: new Map(parent.livingTogether) }))
          }

          const parentsMapForTaxpayable = new Map()
          for (const taxpayerId of taxpayerList) {
            const claimedParents = []
            for (const parentId of parentCombo.get(taxpayerId)) {
              const parent = parentMap.get(parentId)
              parent.claimedBy = taxpayerId
              claimedParents.push({ id: parentId, name: parent.name, age: parent.age, livingTogether: parent.livingTogether.get(taxpayerId) })
            }
            parentsMapForTaxpayable.set(taxpayerId, claimedParents)
          }

          const taxPayerMap = new Map()
          for (const [taxpayerId, taxPayer] of store.taxPayerMap) {
            const taxPayerClone = Object.assign({}, taxPayer)
            taxPayerClone.siblings = siblingCombo.get(taxpayerId)
            taxPayerClone.siblings18 = sibling18Combo.get(taxpayerId)
            taxPayerClone.disabledSiblings = disabledSiblingCombo.get(taxpayerId)
            taxPayerMap.set(taxpayerId, taxPayerClone)

            const taxPayable = taxrule.taxPayable(taxPayerClone, parentsMapForTaxpayable.get(taxpayerId))
            totalTax += taxPayable.taxPayable
          }

          if (totalTax < minimumTax) {
            minimumTax = totalTax
            minimumState = { parentMap, taxPayerMap }
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
