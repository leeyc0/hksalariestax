"use strict";

import combinatorics from './combinatorics';
import {computeTaxPerTaxPayer} from './taxpayerformstore';

function autocalculate() {
  let parentList = [];
  let taxpayerList = [];
  let state = this.$store.state;
  let minimumState = null;
  let minimumTax = Infinity;

  for (let parentId of Object.keys(state.parents)) {
    parentList.push(parentId);
  }

  for (let taxPayerId of Object.keys(state.taxpayers)) {
    taxpayerList.push(taxPayerId);
  }

  for (let parentCombo of combinatorics.distinglishableBallInBoxes(parentList, taxpayerList)) {
    for (let siblingCombo of combinatorics.indistinglishableBallInBoxes(state.totalSiblings, taxpayerList)) {
      for (let disabledSiblingCombo of combinatorics.indistinglishableBallInBoxes(state.totalDisabledSiblings, taxpayerList)) {
        let totalTax = 0;
        let tempState = Object.assign({}, state);
        tempState.parents = Object.assign({}, tempState.parents);
        tempState.taxpayers = Object.assign({}, tempState.taxpayers);
        for (let parentId of Object.keys(tempState.parents)) {
          tempState.parents[parentId] = Object.assign({}, tempState.parents[parentId]);
        }
        for (let taxpayerId of Object.keys(tempState.taxpayers)) {
          tempState.taxpayers[taxpayerId] = Object.assign({}, tempState.taxpayers[taxpayerId]);
          for (let parentId of parentCombo[taxpayerId]) {
            tempState.parents[parentId].claimedBy = taxpayerId;
          }
          tempState.taxpayers[taxpayerId].siblings = siblingCombo[taxpayerId];
          tempState.taxpayers[taxpayerId].disabledSiblings = disabledSiblingCombo[taxpayerId];
        }
        for (let taxpayerId of Object.keys(tempState.taxpayers)) {
          let taxPayable = computeTaxPerTaxPayer(tempState, taxpayerId);
          /* eslint no-console: "off" */
          totalTax += taxPayable.taxPayable;
        }
        if (totalTax < minimumTax) {
          minimumTax = totalTax;
          minimumState = tempState;
        }
        /* eslint no-console: "off" */
        console.log({
          totalTax,
          parentCombo: Object.assign({}, parentCombo),
          siblingCombo: Object.assign({}, siblingCombo),
          disabledSiblingCombo: Object.assign({}, disabledSiblingCombo),
        });
      }
    }
  }
  this.$store.replaceState(minimumState);
  this.$store.dispatch('computeTax');
}

export {autocalculate};
