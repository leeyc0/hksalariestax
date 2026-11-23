'use strict'

/*
  name: name
  maritalStatus:
    0: Separate Taxation
    1: Joint Assessment
    2: Single Parent at next year
    3: Single Parent at previous year
  income: income
  mpf: MPF paid by employee
  otherDeductionsThisYear: all other deductions applicable to this year
  otherDeductionsNextYear: all other deductions applicable to next year
  siblings: number of dependent brother or sisters
  siblings18: number of dependent brother or sisters ineligible in next year
  disabledSiblings: number of disabled siblings
  children: number of children (not newborn)
  children18: number of children eligible in next year
  newbornChildrenThisYear: number of newborn children this year
  newbornChildrenNextYear: number of newborn children next year
  otherDisabledDependants: number of disabled dependants (not siblings nor parents)
  provisionalTax: paid provisional tax
  disabledPerson: Personal disability
*/
export class TaxPayer {
  constructor (name) {
    this.name = name
    this.maritalStatus = 0
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
  age: one of the following values, matching the options in Main.vue.
       Allowance thresholds: 55 = half-rate (55-59) allowance,
                             60 = full allowance.
       "this year" = current tax year, "next year" = provisional tax year:
       0 = disabled parent, age irrelevant: full allowance both years
       1 = reach 54 this year (55 next year):
           ineligible this year, half-rate allowance next year
       2 = reach 55 this year: half-rate allowance both years
       3 = reach 59 this year (60 next year):
           half-rate allowance this year, full allowance next year
       4 = reach 60 this year: full allowance both years
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
