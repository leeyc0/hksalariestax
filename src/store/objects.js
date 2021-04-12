'use strict'

/*
  name: name
  martialStatus:
    0: Seperate Taxation
    1: Joint Assessment
    2: Single Parent at next year
    3: Single Parent at previous year
  income: income
  mpf: MPF paid by employee
  otherDeductionsThisYear: all other deductions appliable to this year
  otherDeductionsNextYear: all other deductions applicable to next year
  siblings: number of dependent brother or sisters
  siblings18: number of dependent brother or sisters illegible in next year
  disabledSiblings: number of disabled siblings
  chidren: number of childen (not newborn)
  children18: number of children illegible in next year
  newbornChildren: number of newborn children
  otherDisabledDependants: number of disabled dependants (not siblings nor parents)
  provisionalTax: paid provisional tax
  disabledPerson: Personal disability
*/
export class TaxPayer {
  constructor (name) {
    this.name = name
    this.martialStatus = 0
    this.income = 0
    this.mpf = 0
    this.otherDeductionsThisYear = 0
    this.otherDeductionsNextYear = 0
    this.siblings = 0
    this.siblings18 = 0
    this.disabledSiblings = 0
    this.children = 0
    this.children18 = 0
    this.newbornChildrenThisYear = 0
    this.newbornChildrenNextYear = 0
    this.otherDisabledDependants = 0
    this.provisionalTax = 0
    this.disabledPerson = false
  }
}

/*
  name: name
  age: one of the following values:
       0 = disabled parent, age irrelevant
       1 = reach 55 in next year
       2 = reach 55 in prev year
       3 = reach 65 in next year
       4 = reach 65 in prev year
  livingTogether: Map of (taxpayerid, livingTogether(boolean))
  claimedBy: claimed by taxpayerid
*/
export class Parent {
  constructor (name, claimedBy) {
    this.name = name
    this.age = 1
    this.livingTogether = new Map()
    this.claimedBy = claimedBy
  }
}
