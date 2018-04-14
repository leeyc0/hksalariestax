"use strict";

var TaxRuleModule = require("../src/taxrule.js");
var TaxRule = TaxRuleModule["TaxRule"];
var taxRebate = TaxRuleModule["taxRebate"];
var taxPayable = TaxRuleModule["taxPayable"];
var assert = require('assert');

var progressiveRate2017 = [
  {step:45000, rate:2},
  {step:45000, rate:7},
  {step:45000, rate:12},
  {step:Infinity, rate:17}
];
var progressiveRate2018 = [
  {step:50000, rate:2},
  {step:50000, rate:6},
  {step:50000, rate:10},
  {step:50000, rate:14},
  {step:Infinity, rate:17}
];
var taxRule2017 = new TaxRule(progressiveRate2017, 15,
                        132000, 18000, 1,
                        46000, 46000, 23000, 23000,
                        37500, 75000);
var taxRuleDummy = new TaxRule(progressiveRate2018, 15,
                        132000, 18000, 1.5,
                        50000, 42000, 23000, 17000,
                        37500, 75000);
var parents = {
    livingTogether: 1,
    nonLivingTogether: 1,
    livingTogether55: 1,
    nonLivingTogether55: 1
};
var siblings = 2;
var disabledDependants = 2;
                        
describe('calculateMpfDeduction', function() {
  it('should return same amount as input when multiplier=1 and input<=cap', function() {
    assert.equal(taxRule2017.calculateMpfDeduction(15000), 15000);
  });
  it('should return capped amount as input when multiplier=1 and input>cap', function() {
    assert.equal(taxRule2017.calculateMpfDeduction(20000), 18000);
  });
  it('should return input*multiplier when multiplier>1 and input<=cap', function() {
    assert.equal(taxRuleDummy.calculateMpfDeduction(10000), 15000);
  });
  it('should return capped amount as input when multiplier>1 and input*multiplier>cap', function() {
    assert.equal(taxRuleDummy.calculateMpfDeduction(15000), 18000);
  });
});

describe("calculateParentAllowance", function() {
  it("should calculate correct amount for every possible case", function() {
    assert.equal(taxRuleDummy.calculateParentAllowance(parents), 205000);
  });
});

describe("calculateSiblingAllowance", function() {
  it("should calculate correct amount", function() {
    assert.equal(taxRuleDummy.calculateSiblingAllowance(siblings), 75000);
  });
});

describe("calculateDisabledDependentAllowance", function() {
  it("should calculate correct amount", function() {
    assert.equal(taxRuleDummy.calculateDisabledDependentAllowance(disabledDependants), 150000);
  });
});

describe("calculateTax", function() {
  let expectedResult = {basicAllowance: taxRule2017.basicAllowance};
  it("Tax 2017 taxableIncome = 0", function() {
    expectedResult.income = 20000;
    expectedResult.taxableIncome = 0;
    expectedResult.taxableIncomeStdRate = 0;
    expectedResult.mpf = 12500;
    expectedResult.otherDeductions = 20000;
    expectedResult.otherAllowances = 10000;
    expectedResult.parentAllowance = 207000;
    expectedResult.siblingAllowance = 75000;
    expectedResult.disabledDependentAllowance = 150000;
    expectedResult.progressiveTaxBreakdown = [{step:0, rate:2, tax:0}];
    expectedResult.progressiveTax = 0;
    expectedResult.stdRateTax = 0;
    expectedResult.stdRate = 15;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = expectedResult.progressiveTax;
    let actualResult = taxRule2017.calculateTax(20000,12500,20000,10000,parents,siblings,disabledDependants);
    assert.deepStrictEqual(actualResult, expectedResult);
  });
  
  it("Tax 2017 taxableIncome first 45000", function() {
    expectedResult.income = 613500;
    expectedResult.taxableIncome = 7000;
    expectedResult.taxableIncomeStdRate = 581000;
    expectedResult.progressiveTaxBreakdown = [{step:7000, rate: 2, tax:140}];
    expectedResult.progressiveTax = 140;
    expectedResult.stdRateTax = 87150;
    expectedResult.tax = expectedResult.progressiveTax;
    let actualResult = taxRule2017.calculateTax(613500,12500,20000,10000,parents,siblings,disabledDependants);
    assert.deepStrictEqual(actualResult, expectedResult);
  });
  it("Tax 2017 taxableIncome next 45000", function() {
    expectedResult.income = 651600;
    expectedResult.taxableIncome = 45100;
    expectedResult.taxableIncomeStdRate = 619100;
    expectedResult.progressiveTaxBreakdown = [{step:45000, rate: 2, tax:900},{step:100, rate: 7, tax:7}];
    expectedResult.progressiveTax = 907;
    expectedResult.stdRateTax = 92865;
    expectedResult.tax = expectedResult.progressiveTax;
    let actualResult = taxRule2017.calculateTax(651600,12500,20000,10000,parents,siblings,disabledDependants);
    assert.deepStrictEqual(actualResult, expectedResult);
  });
  it("Tax 2017 taxableIncome next 45000", function() {
    expectedResult.income = 734000;
    expectedResult.taxableIncome = 127500;
    expectedResult.taxableIncomeStdRate = 701500;
    expectedResult.progressiveTaxBreakdown = [{step:45000, rate: 2, tax:900},{step:45000, rate: 7, tax:3150},{step:37500, rate: 12, tax:4500}];
    expectedResult.progressiveTax = 8550;
    expectedResult.stdRateTax = 105225;
    expectedResult.tax = expectedResult.progressiveTax;
    let actualResult = taxRule2017.calculateTax(734000,12500,20000,10000,parents,siblings,disabledDependants);
    assert.deepStrictEqual(actualResult, expectedResult);
  });
  it("Tax 2017 taxableIncome over 135000", function() {
    expectedResult.income = 802734;
    expectedResult.taxableIncome = 196234;
    expectedResult.taxableIncomeStdRate = 770234;
    expectedResult.progressiveTaxBreakdown = [{step:45000, rate: 2, tax:900},{step:45000, rate: 7, tax:3150},{step:45000, rate: 12, tax:5400},{step:61234, rate: 17, tax:10409}];    expectedResult.progressiveTax = 19859;
    expectedResult.stdRateTax = 115535;
    expectedResult.tax = expectedResult.progressiveTax;
    let actualResult = taxRule2017.calculateTax(802734,12500,20000,10000,parents,siblings,disabledDependants);
    assert.deepStrictEqual(actualResult, expectedResult);
  });
  var parentsNull = {
    livingTogether: 0,
    nonLivingTogether: 0,
    livingTogether55: 0,
    nonLivingTogether55: 0
  };
  it("Tax 2017 taxableIncome just below standard rate threshold", function() {
    expectedResult.income = 1790000;
    expectedResult.taxableIncome = 1658000;
    expectedResult.taxableIncomeStdRate = 1790000;
    expectedResult.mpf = 0;
    expectedResult.otherDeductions = 0;
    expectedResult.otherAllowances = 0;
    expectedResult.parentAllowance = 0;
    expectedResult.siblingAllowance = 0;
    expectedResult.disabledDependentAllowance = 0;
    expectedResult.progressiveTaxBreakdown = [{step:45000, rate: 2, tax:900},{step:45000, rate: 7, tax:3150},{step:45000, rate: 12, tax:5400},{step:1523000, rate: 17, tax:258910}];
    expectedResult.progressiveTax = 268360;
    expectedResult.stdRateTax = 268500;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = expectedResult.progressiveTax;
    let actualResult = taxRule2017.calculateTax(1790000,0,0,0,parentsNull,0,0)
    assert.deepStrictEqual(actualResult, expectedResult);
  });
  it("Tax 2017 taxableIncome just above standard rate threshold", function() {
    expectedResult.income = 1800000;
    expectedResult.taxableIncome = 1668000;
    expectedResult.taxableIncomeStdRate = 1800000;
    expectedResult.progressiveTaxBreakdown = [{step:45000, rate: 2, tax:900},{step:45000, rate: 7, tax:3150},{step:45000, rate: 12, tax:5400},{step:1533000, rate: 17, tax:260610}];
    expectedResult.progressiveTax = 270060;
    expectedResult.stdRateTax = 270000;
    expectedResult.rate = "stdRateTax";
    expectedResult.tax = expectedResult.stdRateTax;
    let actualResult = taxRule2017.calculateTax(1800000,0,0,0,parentsNull,0,0)
    assert.deepStrictEqual(actualResult, expectedResult);
  });
});

describe("taxRebate", function() {
  it("rebate pro-rata when amount below cap", function() {
    assert.equal(taxRebate(25000), 18750);
  });
  it("cap when tax rebate amount reaches cap", function() {
    assert.equal(taxRebate(45000), 30000);
  });
});

describe("taxPayable both year", function() {
  it("progressive rate both year", function() {
    let expectedResult = {
      tax2017: {
        income: 824000,
        taxableIncome: 229000,
        taxableIncomeStdRate: 803000,
        mpf: 1000,
        otherDeductions: 20000,
        basicAllowance: 132000,
        otherAllowances: 10000,
        parentAllowance: 207000,
        siblingAllowance: 75000,
        disabledDependentAllowance: 150000,
        progressiveTaxBreakdown: [{"step":45000,"rate":2,"tax":900},{"step":45000,"rate":7,"tax":3150},{"step":45000,"rate":12,"tax":5400},{"step":94000,"rate":17,"tax":15980}],
        progressiveTax: 25430,
        stdRateTax: 120450,
        stdRate: 15,
        rate: 'progressiveTax',
        tax: 25430
      },
      tax2018Provisional: {
        income: 824000,
        taxableIncome: 201000,
        taxableIncomeStdRate: 798000,
        mpf: 1000,
        otherDeductions: 25000,
        basicAllowance: 132000,
        otherAllowances: 15000,
        parentAllowance: 225000,
        siblingAllowance: 75000,
        disabledDependentAllowance: 150000,
        progressiveTaxBreakdown: [{"step":50000,"rate":2,"tax":1000},{"step":50000,"rate":6,"tax":3000},{"step":50000,"rate":10,"tax":5000},{"step":50000,"rate":14,"tax":7000},{"step":1000,"rate":17,"tax":170}],
        progressiveTax: 16170,
        stdRateTax: 119700,
        stdRate: 15,
        rate: 'progressiveTax',
        tax: 16170
      },
      tax2017Provisional: 500,
      rebate: 19073,
      taxPayable: 22027
    };
    let actualResult = taxPayable(824000,1000,20000,25000,10000,15000,parents,siblings,disabledDependants,500);
    assert.deepStrictEqual(actualResult, expectedResult);
  });
  it("standard rate 2017 progressive rate 2018", function() {
    let expectedResult = {
      tax2017: {
        income: 5620000,
        taxableIncome: 5025000,
        taxableIncomeStdRate: 5599000,
        mpf: 1000,
        otherDeductions: 20000,
        basicAllowance: 132000,
        otherAllowances: 10000,
        parentAllowance: 207000,
        siblingAllowance: 75000,
        disabledDependentAllowance: 150000,
        progressiveTaxBreakdown: [{"step":45000,"rate":2,"tax":900},{"step":45000,"rate":7,"tax":3150},{"step":45000,"rate":12,"tax":5400},{"step":4890000,"rate":17,"tax":831300}],
        progressiveTax: 840750,
        stdRateTax: 839850,
        stdRate: 15,
        rate: 'stdRateTax',
        tax: 839850
      },
      tax2018Provisional: {
        income: 5620000,
        taxableIncome: 4997000,
        taxableIncomeStdRate: 5594000,
        mpf: 1000,
        otherDeductions: 25000,
        basicAllowance: 132000,
        otherAllowances: 15000,
        parentAllowance: 225000,
        siblingAllowance: 75000,
        disabledDependentAllowance: 150000,
        progressiveTaxBreakdown: [{"step":50000,"rate":2,"tax":1000},{"step":50000,"rate":6,"tax":3000},{"step":50000,"rate":10,"tax":5000},{"step":50000,"rate":14,"tax":7000},{"step":4797000,"rate":17,"tax":815490}],
        progressiveTax: 831490,
        stdRateTax: 839100,
        stdRate: 15,
        rate: 'progressiveTax',
        tax: 831490
      },
      tax2017Provisional: 500,
      rebate: 30000,
      taxPayable: 1640840
    };
    let actualResult = taxPayable(5620000,1000,20000,25000,10000,15000,parents,siblings,disabledDependants,500);
    assert.deepStrictEqual(actualResult, expectedResult);
  });
  it("standard rate both year", function() {
    let expectedResult = {
      tax2017: {
        income: 6100000,
        taxableIncome: 5505000,
        taxableIncomeStdRate: 6079000,
        mpf: 1000,
        otherDeductions: 20000,
        basicAllowance: 132000,
        otherAllowances: 10000,
        parentAllowance: 207000,
        siblingAllowance: 75000,
        disabledDependentAllowance: 150000,
        progressiveTaxBreakdown: [{"step":45000,"rate":2,"tax":900},{"step":45000,"rate":7,"tax":3150},{"step":45000,"rate":12,"tax":5400},{"step":5370000,"rate":17,"tax":912900}],
        progressiveTax: 922350,
        stdRateTax: 911850,
        stdRate: 15,
        rate: 'stdRateTax',
        tax: 911850
      },
      tax2018Provisional: {
        income: 6100000,
        taxableIncome: 5477000,
        taxableIncomeStdRate: 6074000,
        mpf: 1000,
        otherDeductions: 25000,
        basicAllowance: 132000,
        otherAllowances: 15000,
        parentAllowance: 225000,
        siblingAllowance: 75000,
        disabledDependentAllowance: 150000,
        progressiveTaxBreakdown: [{"step":50000,"rate":2,"tax":1000},{"step":50000,"rate":6,"tax":3000},{"step":50000,"rate":10,"tax":5000},{"step":50000,"rate":14,"tax":7000},{"step":5277000,"rate":17,"tax":897090}],
        progressiveTax: 913090,
        stdRateTax: 911100,
        stdRate: 15,
        rate: 'stdRateTax',
        tax: 911100
      },
      tax2017Provisional: 500,
      rebate: 30000,
      taxPayable: 1792450
    };
    let actualResult = taxPayable(6100000,1000,20000,25000,10000,15000,parents,siblings,disabledDependants,500)
    assert.deepStrictEqual(actualResult, expectedResult);
  });
});