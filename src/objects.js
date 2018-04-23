"use strict";

/*
  name: name
  income: income
  mpf: MPF paid by employee
  otherDeductionsThisYear: all other deductions appliable to this year
  otherDeductionsNextYear: all other deductions applicable to next year
  otherAllowancesThisYear: all other allowances applicable to this year
  otherAllowancesNextYear: all other allowances appliable to this year
  siblings: number of dependent brother or sisters
  disabledSiblings: number of disabled siblings
  otherDisabledDependants: number of disabled dependants (not siblings nor parents)
  provisionalTax: paid provisional tax
*/
function TaxPayer(name, income, mpf, otherDeductionsThisYear, otherDeductionsNextYear,
                  otherAllowancesThisYear, otherAllowancesNextYear, siblings,
                  disabledSiblings, otherDisabledDependants, provisionalTax) {
  this.name = name;
  this.income = income;
  this.mpf = mpf;
  this.otherDeductionsThisYear = otherDeductionsThisYear;
  this.otherDeductionsNextYear = otherDeductionsNextYear;
  this.otherAllowancesThisYear = otherAllowancesThisYear;
  this.otherAllowancesNextYear = otherAllowancesNextYear;
  this.siblings = siblings;
  this.disabledSiblings = disabledSiblings;
  this.otherDisabledDependants = otherDisabledDependants;
  this.provisionalTax = provisionalTax;
}

/*
  name: name
  age: one of the following values:
       1 = reach 55 in next year
       2 = reach 55 in prev year
       3 = reach 65 in next year
       4 = reach 65 in prev year
  disabledParent: eligible for disabled dependent allowance(boolean)
  livingTogether: Object of {taxpayerid: livingTogether(boolean), ...}
  claimedBy: claimed by taxpayerid
*/
function Parent(name, age, disabledParent, livingTogether, claimedBy) {
  this.name = name;
  this.age = age;
  this.disabledParent = disabledParent;
  this.livingTogether = livingTogether;
  this.claimedBy = claimedBy;
}

export default {TaxPayer, Parent};