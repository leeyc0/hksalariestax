"use strict";

class TaxRule {
  /*
    Constructor
    progressiveRate:             Array of {step,rate}
      step:                        current rate step (int), the last step must be Infinity
      rate:                        current rate in percent (float)
      Example:
      [
        {step:45000, rate:2},     // first $45000 at 2%
        {step:45000, rate:7},     // next $45000 at 7%
        {step:45000, rate:12},    // next $45000 at 12%
        {step:Infinity, rate:17}  // remainder at 17%
      ];
    stdRate:                     Standard Rate in percent (float)
    basicAllowance:              Basic Allowance
    mpfMax:                      Maximum MPF mandatory payment
    mpfMaxMultiplier:            Maximum MPF mandatory payment multiplier (mpfMaxNextYear/mpfMax), used when mpfMax increases
    parentAllowance:             Dependent Parent and Dependent Grandparent Allowance
    parentAdditionalAllowance:   Dependent Parent and Dependent Grandparent Additional Allowance
    parentAllowance55:           Dependent Parent and Dependent Grandparent Allowance (55-64)
    parentAdditionalAllowance55: Dependent Parent and Dependent Grandparent Additional Allowance (55-64)
    siblingAllowance:            Dependent Brother or Dependent Sister Allowance
    disabledDependentAllowance:  Disabled dependant allowance
  */
  constructor(progressiveRate, stdRate,
              basicAllowance, mpfMax, mpfMaxMultiplier,
              parentAllowance, parentAdditionalAllowance,
              parentAllowance55, parentAdditionalAllowance55,
              siblingAllowance, disabledDependentAllowance) {
    this.progressiveRate = progressiveRate;
    this.stdRate = stdRate;
    this.basicAllowance = basicAllowance;
    this.mpfMax = mpfMax;
    this.mpfMaxMultiplier = mpfMaxMultiplier;
    this.parentAllowance = parentAllowance;
    this.parentAdditionalAllowance = parentAdditionalAllowance;
    this.parentAllowance55 = parentAllowance55;
    this.parentAdditionalAllowance55 = parentAdditionalAllowance55;
    this.siblingAllowance = siblingAllowance;
    this.disabledDependentAllowance = disabledDependentAllowance;
  }

  /*
    Calculates MPF deduction
    mpf:     user-input MPF
    returns: calculated MPF deduction
  */
  calculateMpfDeduction(mpf) {
    let mpfDeduction = Math.floor(mpf * this.mpfMaxMultiplier);
    if (mpfDeduction > this.mpfMax) {
      mpfDeduction = this.mpfMax;
    }
    return mpfDeduction;
  }

  /*
    Calculates Dependent Parent and Dependent Grandparent Allowance
    parents: (see calculateTax)
    returns: calculated Dependent Parent and Dependent Grandparent Allowance
  */
  calculateParentAllowance(parents) {
    let totalParentAllowance = 0;
    totalParentAllowance += (parents.livingTogether + parents.nonLivingTogether) * this.parentAllowance;
    totalParentAllowance += parents.livingTogether * this.parentAdditionalAllowance;
    totalParentAllowance += (parents.livingTogether55 + parents.nonLivingTogether55) * this.parentAllowance55;
    totalParentAllowance += parents.livingTogether55 * this.parentAdditionalAllowance55;
    return totalParentAllowance;
  }

  /*
    Calculates Dependent Brother or Dependent Sister Allowance
    siblings: number of dependent brother or sisters
    returns: calculated Dependent Brother or Dependent Sister Allowance
  */
  calculateSiblingAllowance(siblings) {
    let totalSiblingAllowance = this.siblingAllowance * siblings;
    return totalSiblingAllowance;
  }

  /*
    Calculates Disabled Dependant Allowance
    disabledDependents: number of disabled dependants
    returns: calculated Disabled dependant allowance
  */
  calculateDisabledDependentAllowance(disabledDependents) {
    let totaldisabledDependentAllowance = this.disabledDependentAllowance * disabledDependents;
    return totaldisabledDependentAllowance;
  }

  /*
    Calculate tax - the only public interface
    income: income
    mpf: MPF paid by employee
    otherDeductions: all other deductions
    otherAllowances: all other allowances
    parents: {livingTogether:int, nonLivingTogether:int, livingTogether55:int, nonLivingTogether55:int}
      livingTogether: number of living together parents age>65
      nonLivingTogether: number of non-living together parents age>65
      livingTogether55: number of living together parents age 55-64
      nonLivingTogether55: number of non-living together parents age 55-64
    siblings: number of dependent brother or sisters
    disabledDependents: number of disabled dependants
  */
  calculateTax(income, mpf, otherDeductions, otherAllowances, parents, siblings, disabledDependents) {
    // progressive rate: calculate taxable income
    let mpfFinal = this.calculateMpfDeduction(mpf);
    let parentAllowance = this.calculateParentAllowance(parents);
    let siblingAllowance = this.calculateSiblingAllowance(siblings);
    let disabledDependentAllowance = this.calculateDisabledDependentAllowance(disabledDependents);
    let taxableIncome = income - mpfFinal - this.basicAllowance - otherDeductions - otherAllowances -
                    parentAllowance - siblingAllowance - disabledDependentAllowance;
    let taxableIncomeStdRate = income - mpfFinal - otherDeductions;
    if (taxableIncome < 0) {
      taxableIncome = 0;
    }
    if (taxableIncomeStdRate < 0) {
      taxableIncomeStdRate = 0;
    }

    // progressive rate: calculate tax payable based on taxable income
    let stepTotal = 0;
    let progressiveTax = 0;
    let progressiveTaxBreakdown = [];
    for (let i of this.progressiveRate) {
      if (taxableIncome < stepTotal + i.step) {
        let remainder = taxableIncome - stepTotal;
        let stepTax = Math.floor(remainder * i.rate / 100);
        progressiveTaxBreakdown.push({step: remainder, rate: i.rate, tax: stepTax});
        progressiveTax += stepTax;
        break;
      } else {
        stepTotal += i.step;
        let stepTax = i.step * i.rate / 100;
        progressiveTaxBreakdown.push({step: i.step, rate: i.rate, tax: stepTax});
        progressiveTax += stepTax;
      }
    }
    progressiveTax = progressiveTax;

    // standard rate - no allowances
    let stdRateTax = Math.floor(taxableIncomeStdRate * this.stdRate / 100);

    let taxResult = {
      income,
      taxableIncome,
      taxableIncomeStdRate,
      mpf: mpfFinal,
      basicAllowance: this.basicAllowance,
      otherDeductions,
      otherAllowances,
      parentAllowance,
      siblingAllowance,
      disabledDependentAllowance,
      progressiveTaxBreakdown,
      progressiveTax,
      stdRate: this.stdRate,
      stdRateTax,
    };
    if (progressiveTax <= stdRateTax) {
      taxResult.rate = "progressiveTax";
      taxResult.tax = progressiveTax;
    } else {
      taxResult.rate = "stdRateTax";
      taxResult.tax = stdRateTax;
    }
    return taxResult;
  }
}

function taxRebate(tax) {
  let rebateRate = 75;
  let maxRebate = 30000;
  let rebate = Math.ceil(tax * rebateRate / 100);

  if (rebate > maxRebate) {
    rebate = maxRebate;
  }
  return rebate;
}

/*
  income: income
  mpf: MPF paid by employee
  otherDeductions2017: all other deductions applicable to 2017/18
  otherDeductions2018: all other deductions applicable to 2017/18
  otherAllowances2017: all other allowances applicable to 2017/18
  otherAllowances2018: all other allowances applicable to 2017/18
  parents: {livingTogether:int, nonLivingTogether:int, livingTogether55:int, nonLivingTogether55:int}
    livingTogether: number of living together parents age>65
    nonLivingTogether: number of non-living together parents age>65
    livingTogether55: number of living together parents age 55-64
    nonLivingTogether55: number of non-living together parents age 55-64
  siblings: number of dependent brother or sisters
  disabledDependents: number of disabled dependants
  tax2017Provisional: paid 2017 provisional tax
*/
function taxPayable(income, mpf, otherDeductions2017, otherDeductions2018,
                    otherAllowances2017, otherAllowances2018, parents, siblings,
                    disabledDependents, tax2017Provisional) {
  let progressiveRate2017 = [
    {step: 45000, rate: 2},
    {step: 45000, rate: 7},
    {step: 45000, rate: 12},
    {step: Infinity, rate: 17},
  ];
  let progressiveRate2018 = [
    {step: 50000, rate: 2},
    {step: 50000, rate: 6},
    {step: 50000, rate: 10},
    {step: 50000, rate: 14},
    {step: Infinity, rate: 17},
  ];
  let taxRule2017 = new TaxRule(progressiveRate2017, 15,
                          132000, 18000, 1,
                          46000, 46000, 23000, 23000,
                          37500, 75000);
  let taxRule2018 = new TaxRule(progressiveRate2018, 15,
                          132000, 18000, 1,
                          50000, 50000, 25000, 25000,
                          37500, 75000);
  let tax2017 = taxRule2017.calculateTax(income, mpf, otherDeductions2017, otherAllowances2017, parents, siblings, disabledDependents);
  let tax2018Provisional = taxRule2018.calculateTax(income, mpf, otherDeductions2018, otherAllowances2018, parents, siblings, disabledDependents);
  let rebate = taxRebate(tax2017.tax);
  let taxPayable = tax2017.tax - tax2017Provisional - rebate + tax2018Provisional.tax;
  return {tax2017, tax2018Provisional, tax2017Provisional, rebate, taxPayable};
}

module.exports = {TaxRule, taxRebate, taxPayable};
