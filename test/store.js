"use strict";

import { createPinia, setActivePinia } from 'pinia';
import { useTaxStore } from "../src/stores/tax.js";
import { equal } from 'assert';

describe("tax store deleteTaxPayer", function() {
  beforeEach(function() {
    setActivePinia(createPinia());
  });

  it("should reassign only parents claimed by the deleted taxpayer", function() {
    let store = useTaxStore();
    store.addTaxPayer(); // id 2
    store.addTaxPayer(); // id 3
    store.addParent();   // id 1
    store.addParent();   // id 2
    store.addParent();   // id 3
    store.parentMap.get(1).claimedBy = 2;
    store.parentMap.get(2).claimedBy = 2;
    store.parentMap.get(3).claimedBy = 3;
    store.deleteTaxPayer(2);
    equal(store.parentMap.get(1).claimedBy, 1, "parent of deleted taxpayer reassigned to first surviving");
    equal(store.parentMap.get(2).claimedBy, 1, "second parent of deleted taxpayer reassigned to first surviving");
    equal(store.parentMap.get(3).claimedBy, 3, "parent claimed by surviving taxpayer must not move");
  });

  it("should remove the deleted taxpayer from all livingTogether maps", function() {
    let store = useTaxStore();
    store.addTaxPayer(); // id 2
    store.addParent();   // id 1
    store.deleteTaxPayer(2);
    equal(store.parentMap.get(1).livingTogether.has(2), false);
    equal(store.parentMap.get(1).livingTogether.has(1), true);
  });

  it("should unclaim all parents when the last taxpayer is deleted", function() {
    let store = useTaxStore();
    store.addParent(); // id 1, claimed by taxpayer 1
    store.deleteTaxPayer(1);
    equal(store.parentMap.get(1).claimedBy, undefined);
    equal(store.parentMap.get(1).livingTogether.has(1), false);
  });

  it("should not touch parents of taxpayers that survive", function() {
    let store = useTaxStore();
    store.addTaxPayer(); // id 2
    store.addParent();   // id 1, defaults to taxpayer 1
    store.parentMap.get(1).claimedBy = 2;
    store.deleteTaxPayer(1);
    equal(store.parentMap.get(1).claimedBy, 2, "parent claimed by surviving taxpayer 2 keeps its claim");
  });
});
