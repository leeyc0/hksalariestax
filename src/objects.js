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
  disabledDependents: number of disabled dependants
  provisionalTax: paid provisional tax
*/
function TaxPayer(name, income, mpf, otherDeductionsThisYear, otherDeductionsNextYear,
                  otherAllowancesThisYear, otherAllowancesNextYear, siblings,
                  disabledSiblings, provisionalTax) {
  this.name = name;
  this.income = income;
  this.mpf = mpf;
  this.otherDeductionsThisYear = otherDeductionsThisYear;
  this.otherDeductionsNextYear = otherDeductionsNextYear;
  this.otherAllowancesThisYear = otherAllowancesThisYear;
  this.otherAllowancesNextYear = otherAllowancesNextYear;
  this.siblings = siblings;
  this.disabledSiblings = disabledSiblings;
  this.provisionalTax = provisionalTax;
}

/*
  name: name
  over65: age over 65(boolean)
  disabledParent: eligible for disabled dependent allowance(boolean)
  livingTogether: Object of {taxpayerid: livingTogether(boolean), ...}
  claimedBy: claimed by taxpayerid
*/
function Parent(name, over65, disabledParent, livingTogether, claimedBy) {
  this.name = name;
  this.over65 = over65;
  this.disabledParent = disabledParent;
  this.livingTogether = livingTogether;
  this.claimedBy = claimedBy;
}

export default {TaxPayer, Parent};
