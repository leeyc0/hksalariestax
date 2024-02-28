'use strict'

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
    childAllowance:              Child Allowance
    newbornChildExtraAllowance:  Newborn Child Extra Allowance
    provisionalYear:             Provision tax year
  */
  constructor ({
    progressiveRate, stdRate,
    basicAllowance, marriedAllowance,
    mpfMax, mpfMaxMultiplier,
    parentAllowance, parentAdditionalAllowance,
    parentAllowance55, parentAdditionalAllowance55,
    siblingAllowance, disabledDependentAllowance,
    childAllowance, newbornChildAdditionalAllowance,
    singleParentAllowance, personalDisabilityAllowance,
    provisionalYear
  }) {
    this.progressiveRate = progressiveRate
    this.stdRate = stdRate
    this.basicAllowance = basicAllowance
    this.marriedAllowance = marriedAllowance
    this.mpfMax = mpfMax
    this.mpfMaxMultiplier = mpfMaxMultiplier
    this.parentAllowance = parentAllowance
    this.parentAdditionalAllowance = parentAdditionalAllowance
    this.parentAllowance55 = parentAllowance55
    this.parentAdditionalAllowance55 = parentAdditionalAllowance55
    this.siblingAllowance = siblingAllowance
    this.disabledDependentAllowance = disabledDependentAllowance
    this.childAllowance = childAllowance
    this.newbornChildAdditionalAllowance = newbornChildAdditionalAllowance
    this.singleParentAllowance = singleParentAllowance
    this.personalDisabilityAllowance = personalDisabilityAllowance
    this.provisionalYear = provisionalYear
  }

  /*
    Calculates MPF deduction
    taxpayer: TaxPayer object
    returns: calculated MPF deduction
  */
  calculateMpfDeduction (taxpayer) {
    let mpfDeduction = Math.floor(taxpayer.mpf * this.mpfMaxMultiplier)
    if (mpfDeduction > this.mpfMax) {
      mpfDeduction = this.mpfMax
    }
    return mpfDeduction
  }

  /*
    Calculates Dependent Parent and Dependent Grandparent Allowance
    parents: (see calculateTax)
    returns: calculated Dependent Parent and Dependent Grandparent Allowance
  */
  calculateParentAllowance (parents) {
    let totalParentAllowance = 0
    const parentCount = {
      livingTogether: 0,
      nonLivingTogether: 0,
      livingTogether55: 0,
      nonLivingTogether55: 0
    }

    // count total parents, need to distinglish between two tax years
    if (this.provisionalYear) {
      parents.reduce(
        function (parentCountAccu, parentObj) {
          switch (parentObj.age) {
            case 0:
            case 3:
            case 4:
              if (parentObj.livingTogether) {
                parentCountAccu.livingTogether++
              } else {
                parentCountAccu.nonLivingTogether++
              }
              break
            case 1:
            case 2:
              if (parentObj.livingTogether) {
                parentCountAccu.livingTogether55++
              } else {
                parentCountAccu.nonLivingTogether55++
              }
              break
          }
          return parentCountAccu
        }
        , parentCount)
    } else {
      parents.reduce(
        function (parentCountAccu, parentObj) {
          switch (parentObj.age) {
            case 0:
            case 4:
              if (parentObj.livingTogether) {
                parentCountAccu.livingTogether++
              } else {
                parentCountAccu.nonLivingTogether++
              }
              break
            case 2:
            case 3:
              if (parentObj.livingTogether) {
                parentCountAccu.livingTogether55++
              } else {
                parentCountAccu.nonLivingTogether55++
              }
              break
          }
          return parentCountAccu
        }
        , parentCount)
    }
    totalParentAllowance += (parentCount.livingTogether + parentCount.nonLivingTogether) * this.parentAllowance
    totalParentAllowance += parentCount.livingTogether * this.parentAdditionalAllowance
    totalParentAllowance += (parentCount.livingTogether55 + parentCount.nonLivingTogether55) * this.parentAllowance55
    totalParentAllowance += parentCount.livingTogether55 * this.parentAdditionalAllowance55
    return totalParentAllowance
  }

  /*
    Calculates Dependent Brother or Dependent Sister Allowance
    taxpayer: TaxPayer object
    returns: calculated Dependent Brother or Dependent Sister Allowance
  */
  calculateSiblingAllowance (taxpayer) {
    let siblings = 0
    if (this.provisionalYear) {
      siblings = taxpayer.siblings + taxpayer.disabledSiblings
    } else {
      siblings = taxpayer.siblings + taxpayer.disabledSiblings + taxpayer.siblings18
    }
    return this.siblingAllowance * siblings
  }

  /*
    Calculates Disabled Dependant Allowance
    taxpayer: TaxPayer object
    parents: (see calculateTax)
    returns: calculated Disabled dependant allowance
  */
  calculateDisabledDependentAllowance (taxpayer, parents) {
    let disabledDependents = taxpayer.disabledSiblings + taxpayer.otherDisabledDependants
    disabledDependents += parents.reduce(
      function (count, parentObj) {
        if (parentObj.age === 0) {
          count++
          return count
        } else {
          return count
        }
      },
      0)
    return this.disabledDependentAllowance * disabledDependents
  }

  /*
    Calculates Child Allowance and Single Parent Allowance
    taxpayer: TaxPayer object
    returns: calculated Child allowance and Single Parent Allowance
  */
  calculateChildAllowanceAndSingleParentAllowance (taxpayer) {
    let children = 0
    let newbornChildren = 0
    if (this.provisionalYear) {
      /* newbornChildrenNextYear:
         children born from the start of provisionalYear until the time of tax reporting */
      children = taxpayer.children + taxpayer.newbornChildrenThisYear + taxpayer.newbornChildrenNextYear
      newbornChildren = taxpayer.newbornChildrenNextYear
    } else {
      children = taxpayer.children + taxpayer.children18 + taxpayer.newbornChildrenThisYear
      newbornChildren = taxpayer.newbornChildrenThisYear
    }

    // tax rule states that maximum of 9 children can be claimed
    if (newbornChildren > 9) {
      newbornChildren = 9
    }
    if (children > 9) {
      children = 9
    }

    const childAllowance = this.childAllowance * children +
                         this.newbornChildAdditionalAllowance * newbornChildren

    let singleParentAllowance = 0

    if (childAllowance > 0) {
      if (this.provisionalYear) {
        if (taxpayer.martialStatus === 2 || taxpayer.martialStatus === 3) {
          singleParentAllowance = this.singleParentAllowance
        }
      } else {
        if (taxpayer.martialStatus === 3) {
          singleParentAllowance = this.singleParentAllowance
        }
      }
    }

    return { childAllowance, singleParentAllowance }
  }

  /*
    Calculate tax - the only public interface
    taxpayer: TaxPayer object
    parents: see taxPayable
  */
  calculateTax (taxpayer, parents) {
    const otherDeductions = this.provisionalYear ? taxpayer.otherDeductionsNextYear
      : taxpayer.otherDeductionsThisYear

    // progressive rate: calculate taxable income
    const mpfFinal = this.calculateMpfDeduction(taxpayer)
    const basicAllowance = taxpayer.martialStatus !== 1 ? this.basicAllowance : 0
    const marriedAllowance = taxpayer.martialStatus === 1 ? this.marriedAllowance : 0
    const personalDisabilityAllowance = taxpayer.disabledPerson ? this.personalDisabilityAllowance : 0
    const parentAllowance = this.calculateParentAllowance(parents)
    const siblingAllowance = this.calculateSiblingAllowance(taxpayer)
    const { childAllowance, singleParentAllowance } = this.calculateChildAllowanceAndSingleParentAllowance(taxpayer)
    const disabledDependentAllowance = this.calculateDisabledDependentAllowance(taxpayer, parents)
    let taxableIncome = taxpayer.income - mpfFinal - otherDeductions -
                        basicAllowance - marriedAllowance - personalDisabilityAllowance -
                        parentAllowance - siblingAllowance - disabledDependentAllowance -
                        childAllowance - singleParentAllowance
    let taxableIncomeStdRate = taxpayer.income - mpfFinal - otherDeductions
    if (taxableIncome < 0) {
      taxableIncome = 0
    }
    if (taxableIncomeStdRate < 0) {
      taxableIncomeStdRate = 0
    }

    // progressive rate: calculate tax payable based on taxable income
    let stepTotal = 0
    let progressiveTax = 0
    const progressiveTaxBreakdown = []
    for (const i of this.progressiveRate) {
      if (taxableIncome < stepTotal + i.step) {
        const remainder = taxableIncome - stepTotal
        const stepTax = Math.floor(remainder * i.rate / 100)
        progressiveTaxBreakdown.push({ step: remainder, rate: i.rate, tax: stepTax })
        progressiveTax += stepTax
        break
      } else {
        stepTotal += i.step
        const stepTax = i.step * i.rate / 100
        progressiveTaxBreakdown.push({ step: i.step, rate: i.rate, tax: stepTax })
        progressiveTax += stepTax
      }
    }

    // standard rate - no allowances
    const stdRateTax = Math.floor(taxableIncomeStdRate * this.stdRate / 100)

    const taxResult = {
      income: taxpayer.income,
      taxableIncome,
      taxableIncomeStdRate,
      mpf: mpfFinal,
      basicAllowance,
      marriedAllowance,
      personalDisabilityAllowance,
      otherDeductions,
      parentAllowance,
      siblingAllowance,
      childAllowance,
      singleParentAllowance,
      disabledDependentAllowance,
      progressiveTaxBreakdown,
      progressiveTax,
      stdRate: this.stdRate,
      stdRateTax
    }
    if (progressiveTax <= stdRateTax) {
      taxResult.rate = 'progressiveTax'
      taxResult.tax = progressiveTax
    } else {
      taxResult.rate = 'stdRateTax'
      taxResult.tax = stdRateTax
    }
    return taxResult
  }
}

function taxRebate (tax) {
  const rebateRate = 100
  const maxRebate = 3000
  let rebate = Math.ceil(tax * rebateRate / 100)

  if (rebate > maxRebate) {
    rebate = maxRebate
  }
  return rebate
}

/*
  taxpayer: TaxPayer object
  income: income
  parents: array of {age:int(0-4), livingTogether:boolean}, see objects.js function Parent for attr definition
*/
function taxPayable (taxpayer, parents) {
  const taxRule2023 = new TaxRule({
    progressiveRate: [
      { step: 50000, rate: 2 },
      { step: 50000, rate: 6 },
      { step: 50000, rate: 10 },
      { step: 50000, rate: 14 },
      { step: Infinity, rate: 17 }
    ],
    stdRate: 15,
    basicAllowance: 132000,
    marriedAllowance: 264000,
    mpfMax: 18000,
    mpfMaxMultiplier: 1.0,
    parentAllowance: 50000,
    parentAdditionalAllowance: 50000,
    parentAllowance55: 25000,
    parentAdditionalAllowance55: 25000,
    siblingAllowance: 37500,
    disabledDependentAllowance: 75000,
    childAllowance: 130000,
    singleParentAllowance: 132000,
    newbornChildAdditionalAllowance: 130000,
    personalDisabilityAllowance: 75000,
    provisionalYear: false
  })

  const taxRule2024 = new TaxRule({
    progressiveRate: [
      { step: 50000, rate: 2 },
      { step: 50000, rate: 6 },
      { step: 50000, rate: 10 },
      { step: 50000, rate: 14 },
      { step: Infinity, rate: 17 }
    ],
    stdRate: 15,
    basicAllowance: 132000,
    marriedAllowance: 264000,
    mpfMax: 18000,
    mpfMaxMultiplier: 1.0,
    parentAllowance: 50000,
    parentAdditionalAllowance: 50000,
    parentAllowance55: 25000,
    parentAdditionalAllowance55: 25000,
    siblingAllowance: 37500,
    disabledDependentAllowance: 75000,
    childAllowance: 130000,
    singleParentAllowance: 132000,
    newbornChildAdditionalAllowance: 130000,
    personalDisabilityAllowance: 75000,
    provisionalYear: true
  })

  const taxThisYear = taxRule2023.calculateTax(taxpayer, parents)
  const taxNextYearProvisional = taxRule2024.calculateTax(taxpayer, parents)
  const rebate = taxRebate(taxThisYear.tax)
  const taxThisYearFinal = taxThisYear.tax - taxpayer.provisionalTax - rebate
  const taxPayable = taxThisYear.tax - taxpayer.provisionalTax - rebate + taxNextYearProvisional.tax
  return { taxThisYear, taxThisYearFinal, taxNextYearProvisional, taxThisYearProvisional: taxpayer.provisionalTax, rebate, taxPayable }
}

/* eslint-disable-next-line no-undef */
module.exports = { TaxRule, taxRebate, taxPayable }
