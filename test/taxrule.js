"use strict";

import TaxRuleModule from "../src/taxrule.js";
var TaxRule = TaxRuleModule["TaxRule"];
var taxRebate = TaxRuleModule["taxRebate"];
var taxPayable = TaxRuleModule["taxPayable"];
import { equal, deepStrictEqual } from 'assert';

var taxRuleTest = new TaxRule({
  progressiveRate: [
    {step: 45000, rate: 2},
    {step: 45000, rate: 7},
    {step: 45000, rate: 12},
    {step: Infinity, rate: 17},
  ],
  stdRate: [
    {step: 5000000, rate: 15},
    {step: Infinity, rate: 16},
  ],
  basicAllowance: 132000,
  marriedAllowance: 264000,
  mpfMax: 18000,
  mpfMaxMultiplier: 1.0,
  parentAllowance: 46000,
  parentAdditionalAllowance: 46000,
  parentAllowance55: 23000,
  parentAdditionalAllowance55: 23000,
  siblingAllowance: 37500,
  disabledDependentAllowance: 75000,
  childAllowance: 100000,
  singleParentAllowance: 132000,
  newbornChildAdditionalAllowance: 100000,
  personalDisabilityAllowance: 0,
  provisionalYear: false,
});

var taxRuleDummy = new TaxRule({
  progressiveRate: [
    {step:50000, rate:2},
    {step:50000, rate:6},
    {step:50000, rate:10},
    {step:50000, rate:14},
    {step:Infinity, rate:17}
  ],
  stdRate: [
    {step: 5000000, rate: 15},
    {step: Infinity, rate: 16},
  ],
  basicAllowance: 132000,
  marriedAllowance: 264000,
  mpfMax: 18000,
  mpfMaxMultiplier: 1.5,
  parentAllowance: 50000,
  parentAdditionalAllowance: 42000,
  parentAllowance55: 23000,
  parentAdditionalAllowance55: 17000,
  siblingAllowance: 37500,
  disabledDependentAllowance: 75000,
  childAllowance: 100000,
  singleParentAllowance: 132000,
  newbornChildAdditionalAllowance: 110000,
  personalDisabilityAllowance: 15000,
  provisionalYear: true,
});
  
var taxpayerTemplate = {
  name : "dummy",
  martialStatus : 0,
  income : 0,
  mpf : 0,
  otherDeductionsThisYear : 0,
  otherDeductionsNextYear : 0,
  siblings : 0,
  siblings18 : 0,
  disabledSiblings : 0,
  children : 0,
  children18 : 0,
  newbornChildrenThisYear: 0,
  newbornChildrenNextYear: 0,
  otherDisabledDependants : 0,
  provisionalTax : 0,
  disabledPerson : false,
};

var expectedResultTemplate = {
  income: 0,
  taxableIncome: 0,
  taxableIncomeStdRate: 0,
  mpf: 0,
  basicAllowance: 0,
  marriedAllowance: 0,
  personalDisabilityAllowance: 0,
  otherDeductions: 0,
  parentAllowance: 0,
  siblingAllowance: 0,
  childAllowance: 0,
  singleParentAllowance: 0,
  disabledDependentAllowance: 0,
  progressiveTaxBreakdown: [],
  progressiveTax: 0,
  stdRateTaxBreakdown: [],
  stdRateTax: 0,
};

describe('calculateMpfDeduction', function() {
  it('should return same amount as input when multiplier=1 and input<=cap', function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    taxpayer.mpf = 15000;
    equal(taxRuleTest.calculateMpfDeduction(taxpayer), 15000);
  });
  it('should return same amount as input when multiplier=1 and input<=cap (joint assessment)', function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    taxpayer.martialStatus = 1;
    taxpayer.mpf = 30000;
    equal(taxRuleTest.calculateMpfDeduction(taxpayer), 30000);
  });
  it('should return capped amount as input when multiplier=1 and input>cap', function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    taxpayer.mpf = 20000;
    equal(taxRuleTest.calculateMpfDeduction(taxpayer), 18000);
  });
  it('should return capped amount as input when multiplier=1 and input>cap (joint assessment)', function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    taxpayer.martialStatus = 1;
    taxpayer.mpf = 40000;
    equal(taxRuleTest.calculateMpfDeduction(taxpayer), 36000);
  });
  it('should return input*multiplier when multiplier>1 and input<=cap', function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    taxpayer.mpf = 10000;
    equal(taxRuleDummy.calculateMpfDeduction(taxpayer), 15000);
  });
  it('should return capped amount as input when multiplier>1 and input*multiplier>cap', function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
     taxpayer.mpf = 15000;
    equal(taxRuleDummy.calculateMpfDeduction(taxpayer), 18000);
  });
});

describe("calculateParentAllowance", function() {
  let parents = [
    {id: 0, age: 0, livingTogether: false, allowance2017: 46000, allowanceDummy: 50000},
    {id: 1, age: 0, livingTogether: true , allowance2017: 92000, allowanceDummy: 92000},
    {id: 2, age: 1, livingTogether: false, allowance2017: 0, allowanceDummy: 23000},
    {id: 3, age: 1, livingTogether: true , allowance2017: 0, allowanceDummy: 40000},
    {id: 4, age: 2, livingTogether: false, allowance2017: 23000, allowanceDummy: 23000},
    {id: 5, age: 2, livingTogether: true , allowance2017: 46000, allowanceDummy: 40000},
    {id: 6, age: 3, livingTogether: false, allowance2017: 23000, allowanceDummy: 50000},
    {id: 7, age: 3, livingTogether: true , allowance2017: 46000, allowanceDummy: 92000},
    {id: 8, age: 4, livingTogether: false, allowance2017: 46000, allowanceDummy: 50000},
    {id: 9, age: 4, livingTogether: true , allowance2017: 92000, allowanceDummy: 92000},
  ];
  
  for (let parentObj of parents) {
    it("should calculate correct amount for case id: "+parentObj.id, function() {
      equal(taxRuleTest.calculateParentAllowance([parentObj]), parentObj.allowance2017, "taxRule2017");
      equal(taxRuleDummy.calculateParentAllowance([parentObj]), parentObj.allowanceDummy, "taxRuleDummy");
    });
  }
});

describe("calculateSiblingAllowance", function() {
  it("should calculate correct amount: last year", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    taxpayer.siblings = 1;
    taxpayer.siblings18 = 2;
    taxpayer.disabledSiblings = 3,
    equal(taxRuleTest.calculateSiblingAllowance(taxpayer), 225000);
  });
  it("should calculate correct amount: next year", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    taxpayer.siblings = 2;
    taxpayer.siblings18 = 2;
    taxpayer.disabledSiblings = 3,
    equal(taxRuleDummy.calculateSiblingAllowance(taxpayer), 187500);
  });
});

describe("calculateChildAllowanceAndSingleParentAllowance", function() {
  it("should calculate correct amount: previous year", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    taxpayer.children = 2;
    taxpayer.newbornChildrenThisYear = 1;
    taxpayer.newbornChildrenNextYear = 3;
    taxpayer.children18 = 1;
    deepStrictEqual(taxRuleTest.calculateChildAllowanceAndSingleParentAllowance(taxpayer), {childAllowance: 500000, singleParentAllowance: 0}); 
  });
  it("should calculate correct amount: next year", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    taxpayer.children = 2;
    taxpayer.newbornChildrenThisYear = 1;
    taxpayer.newbornChildrenNextYear = 3;
    taxpayer.children18 = 1;
    deepStrictEqual(taxRuleDummy.calculateChildAllowanceAndSingleParentAllowance(taxpayer), {childAllowance: 930000, singleParentAllowance: 0}); 
  });
  it("should cap maximum children = 9: newbornChild > 9", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    taxpayer.children = 1;
    taxpayer.newbornChildrenNextYear = 10;
    deepStrictEqual(taxRuleDummy.calculateChildAllowanceAndSingleParentAllowance(taxpayer), {childAllowance: 1890000, singleParentAllowance: 0}); 
  });
  it("should cap maximum children = 9: newbornChild <= 9", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    taxpayer.children = 5;
    taxpayer.newbornChildrenNextYear = 6;
    deepStrictEqual(taxRuleDummy.calculateChildAllowanceAndSingleParentAllowance(taxpayer), {childAllowance: 1560000, singleParentAllowance: 0}); 
  });
  it("test single parent allowance: single parent both year", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    taxpayer.martialStatus = 3;
    taxpayer.children = 1;
    taxpayer.newbornChildrenThisYear = 0;
    taxpayer.newbornChildrenNextYear = 0;
    taxpayer.children18 = 0;
    deepStrictEqual(taxRuleTest.calculateChildAllowanceAndSingleParentAllowance(taxpayer), {childAllowance: 100000, singleParentAllowance: 132000}, "previous year");
    deepStrictEqual(taxRuleDummy.calculateChildAllowanceAndSingleParentAllowance(taxpayer), {childAllowance: 100000, singleParentAllowance: 132000}, "next year");
  });
  it("test single parent allowance: single parent next year only", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    taxpayer.martialStatus = 2;
    taxpayer.children = 1;
    taxpayer.newbornChildrenThisYear = 0;
    taxpayer.newbornChildrenNextYear = 0;
    taxpayer.children18 = 0;
    deepStrictEqual(taxRuleTest.calculateChildAllowanceAndSingleParentAllowance(taxpayer), {childAllowance: 100000, singleParentAllowance: 0}, "previous year");
    deepStrictEqual(taxRuleDummy.calculateChildAllowanceAndSingleParentAllowance(taxpayer), {childAllowance: 100000, singleParentAllowance: 132000}, "next year");
  });
});

describe("calculateDisabledDependentAllowance", function() {
  let taxpayer = Object.assign({}, taxpayerTemplate);
  taxpayer.otherDisabledDependants = 1;
  let parents = [
    {age: 0, livingTogether: false},
    {age: 0, livingTogether: true},
    {age: 1, livingTogether: false},
    {age: 1, livingTogether: true},
    {age: 2, livingTogether: false},
    {age: 2, livingTogether: true},
    {age: 3, livingTogether: false},
    {age: 3, livingTogether: true},
    {age: 4, livingTogether: false},
    {age: 4, livingTogether: true},
  ];
  it("should calculate correct amount", function() {
    equal(taxRuleDummy.calculateDisabledDependentAllowance(taxpayer, parents), 225000);
  });
});

describe("calculateTax", function() {
  it("Tax 2017 test basic allowance", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 132100;
    expectedResult.income = 132100;
    expectedResult.taxableIncome = 100;
    expectedResult.taxableIncomeStdRate =  132100;
    expectedResult.basicAllowance = 132000;
    expectedResult.progressiveTaxBreakdown = [{step: 100, rate: 2, tax: 2}];
    expectedResult.progressiveTax = 2;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 132100,
        tax: 19815
      }
    ];
    expectedResult.stdRateTax = 19815;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = 2;
    deepStrictEqual(taxRuleTest.calculateTax(taxpayer, []), expectedResult);
  });
  
  it("Tax 2017 test married allowance", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 264200;
    taxpayer.martialStatus = 1;
    expectedResult.income = 264200;
    expectedResult.taxableIncome = 200;
    expectedResult.taxableIncomeStdRate =  264200;
    expectedResult.marriedAllowance = 264000;
    expectedResult.progressiveTaxBreakdown = [{step: 200, rate: 2, tax: 4}];
    expectedResult.progressiveTax = 4;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 264200,
        tax: 39630
      }
    ];
    expectedResult.stdRateTax = 39630;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = 4;
    deepStrictEqual(taxRuleTest.calculateTax(taxpayer, []), expectedResult);
  });
  
  it("Tax 2017 test single parent - no allowance, also tests child allowance", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 132300;
    taxpayer.martialStatus = 2;
    expectedResult.income = 132300;
    expectedResult.taxableIncome = 300;
    expectedResult.taxableIncomeStdRate =  132300;
    expectedResult.basicAllowance = 132000;
    expectedResult.progressiveTaxBreakdown = [{step: 300, rate: 2, tax: 6}];
    expectedResult.progressiveTax = 6;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 132300,
        tax: 19845
      }
    ];
    expectedResult.stdRateTax = 19845;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = 6;
    deepStrictEqual(taxRuleTest.calculateTax(taxpayer, []), expectedResult);
  });
  
  it("test single parent - allowance next year", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 364400;
    taxpayer.martialStatus = 2;
    taxpayer.children = 1;
    expectedResult.income = 364400;
    expectedResult.taxableIncome = 132400;
    expectedResult.taxableIncomeStdRate =  364400;
    expectedResult.basicAllowance = 132000;
    expectedResult.childAllowance = 100000;
    expectedResult.progressiveTaxBreakdown = [
      {step: 45000, rate: 2, tax: 900},
      {step: 45000, rate: 7, tax: 3150},
      {step: 42400, rate: 12, tax: 5088},
    ];
    expectedResult.progressiveTax = 9138;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 364400,
        tax: 54660
      }
    ];
    expectedResult.stdRateTax = 54660;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = 9138;
    deepStrictEqual(taxRuleTest.calculateTax(taxpayer, []), expectedResult, "last year");
    
    expectedResult.taxableIncome = 400;
    expectedResult.singleParentAllowance = 132000;
    expectedResult.progressiveTaxBreakdown = [{step: 400, rate: 2, tax: 8}];
    expectedResult.progressiveTax = 8;
    expectedResult.tax = 8;
    deepStrictEqual(taxRuleDummy.calculateTax(taxpayer, []), expectedResult, "next year");
  });
  
  it("test single parent - allowance both year", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 364500;
    taxpayer.martialStatus = 3;
    taxpayer.children = 1;
    expectedResult.income = 364500;
    expectedResult.taxableIncome = 500;
    expectedResult.taxableIncomeStdRate =  364500;
    expectedResult.basicAllowance = 132000;
    expectedResult.singleParentAllowance = 132000;
    expectedResult.childAllowance = 100000;
    expectedResult.progressiveTaxBreakdown = [{step: 500, rate: 2, tax: 10}];
    expectedResult.progressiveTax = 10;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 364500,
        tax: 54675
      }
    ];
    expectedResult.stdRateTax = 54675;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = 10;
    deepStrictEqual(taxRuleTest.calculateTax(taxpayer, []), expectedResult, "last year");
    deepStrictEqual(taxRuleDummy.calculateTax(taxpayer, []), expectedResult, "next year");
  });
  
  it("Tax Dummy test personal disability allowance", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 147600;
    taxpayer.disabledPerson = true;
    expectedResult.income = 147600;
    expectedResult.taxableIncome = 600;
    expectedResult.taxableIncomeStdRate =  147600;
    expectedResult.basicAllowance = 132000;
    expectedResult.personalDisabilityAllowance = 15000;
    expectedResult.progressiveTaxBreakdown = [{step: 600, rate: 2, tax: 12}];
    expectedResult.progressiveTax = 12;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 147600,
        tax: 22140
      }
    ];
    expectedResult.stdRateTax = 22140;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = 12;
    deepStrictEqual(taxRuleDummy.calculateTax(taxpayer, []), expectedResult);
  });
  
  it("test parent allowance", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let parents = [
      {age: 0, livingTogether: false},
      {age: 0, livingTogether: true},
      {age: 1, livingTogether: false},
      {age: 1, livingTogether: true},
      {age: 2, livingTogether: false},
      {age: 2, livingTogether: true},
      {age: 3, livingTogether: false},
      {age: 3, livingTogether: true},
      {age: 4, livingTogether: false},
      {age: 4, livingTogether: true},
    ];
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 834100;
    expectedResult.income = 834100;
    expectedResult.taxableIncome = 138100;
    expectedResult.taxableIncomeStdRate =  834100;
    expectedResult.basicAllowance = 132000;
    expectedResult.parentAllowance = 414000;
    expectedResult.disabledDependentAllowance = 150000;
    expectedResult.progressiveTaxBreakdown = [
      {step: 45000, rate: 2, tax: 900},
      {step: 45000, rate: 7, tax: 3150},
      {step: 45000, rate: 12, tax: 5400},
      {step: 3100, rate: 17, tax: 527},
    ];
    expectedResult.progressiveTax = 9977;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 834100,
        tax: 125115
      }
    ];
    expectedResult.stdRateTax = 125115;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = 9977;
    deepStrictEqual(taxRuleTest.calculateTax(taxpayer, parents), expectedResult, "last year");
    
    expectedResult.taxableIncome = 100;
    expectedResult.parentAllowance = 552000;
    expectedResult.progressiveTaxBreakdown = [{step: 100, rate: 2, tax: 2}];
    expectedResult.progressiveTax = 2;
    expectedResult.tax = 2;
    deepStrictEqual(taxRuleDummy.calculateTax(taxpayer, parents), expectedResult, "next year");
  });
  
  it("test dependent brother or sister allowance", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 357200;
    taxpayer.siblings = 2;
    taxpayer.siblings18 = 1;
    taxpayer.disabledSiblings = 1;
    expectedResult.income = 357200;
    expectedResult.taxableIncome = 200;
    expectedResult.taxableIncomeStdRate =  357200;
    expectedResult.basicAllowance = 132000;
    expectedResult.disabledDependentAllowance = 75000;
    expectedResult.siblingAllowance = 150000;
    expectedResult.progressiveTaxBreakdown = [{step: 200, rate: 2, tax: 4}];
    expectedResult.progressiveTax = 4;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 357200,
        tax: 53580
      }
    ];
    expectedResult.stdRateTax = 53580;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = 4;
    deepStrictEqual(taxRuleTest.calculateTax(taxpayer, []), expectedResult, "last year");
    expectedResult.taxableIncome = 37700;
    expectedResult.siblingAllowance = 112500;
    expectedResult.progressiveTaxBreakdown = [{step: 37700, rate: 2, tax: 754}];
    expectedResult.progressiveTax = 754;
    expectedResult.tax = 754;
    deepStrictEqual(taxRuleDummy.calculateTax(taxpayer, []), expectedResult, "next year");
  });
  
  it("Tax 2017 test disabled dependent allowance", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 282700;
    taxpayer.otherDisabledDependants = 2;
    expectedResult.income = 282700;
    expectedResult.taxableIncome = 700;
    expectedResult.taxableIncomeStdRate =  282700;
    expectedResult.basicAllowance = 132000;
    expectedResult.disabledDependentAllowance = 150000;
    expectedResult.progressiveTaxBreakdown = [{step: 700, rate: 2, tax: 14}];
    expectedResult.progressiveTax = 14;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 282700,
        tax: 42405
      }
    ];
    expectedResult.stdRateTax = 42405;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = 14;
    deepStrictEqual(taxRuleTest.calculateTax(taxpayer, []), expectedResult);
  });
  
  it("test MPF deduction", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 132500;
    taxpayer.mpf = 200;
    expectedResult.income = 132500;
    expectedResult.taxableIncome = 300;
    expectedResult.taxableIncomeStdRate =  132300;
    expectedResult.mpf = 200;
    expectedResult.basicAllowance = 132000;
    expectedResult.progressiveTaxBreakdown = [{step: 300, rate: 2, tax: 6}];
    expectedResult.progressiveTax = 6;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 132300,
        tax: 19845
      }
    ];
    expectedResult.stdRateTax = 19845;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = 6;
    deepStrictEqual(taxRuleTest.calculateTax(taxpayer, []), expectedResult, "last year");
    expectedResult.mpf = 300;
    expectedResult.taxableIncome = 200;
    expectedResult.taxableIncomeStdRate =  132200;
    expectedResult.progressiveTaxBreakdown = [{step: 200, rate: 2, tax: 4}];
    expectedResult.progressiveTax = 4;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 132200,
        tax: 19830
      }
    ];
    expectedResult.stdRateTax = 19830;
    expectedResult.tax = 4;
    deepStrictEqual(taxRuleDummy.calculateTax(taxpayer, []), expectedResult, "next year");
  });
  
  it("test other deductions", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 132500;
    taxpayer.otherDeductionsThisYear = 400;
    taxpayer.otherDeductionsNextYear = 100;
    expectedResult.income = 132500;
    expectedResult.otherDeductions = 400;
    expectedResult.taxableIncome = 100;
    expectedResult.taxableIncomeStdRate =  132100;
    expectedResult.basicAllowance = 132000;
    expectedResult.progressiveTaxBreakdown = [{step: 100, rate: 2, tax: 2}];
    expectedResult.progressiveTax = 2;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 132100,
        tax: 19815
      }
    ];
    expectedResult.stdRateTax = 19815;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = 2;
    deepStrictEqual(taxRuleTest.calculateTax(taxpayer, []), expectedResult, "last year");
    expectedResult.otherDeductions = 100;
    expectedResult.taxableIncome = 400;
    expectedResult.taxableIncomeStdRate =  132400;
    expectedResult.progressiveTaxBreakdown = [{step: 400, rate: 2, tax: 8}];
    expectedResult.progressiveTax = 8;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 132400,
        tax: 19860
      }
    ];
    expectedResult.stdRateTax = 19860;
    expectedResult.tax = 8;
    deepStrictEqual(taxRuleDummy.calculateTax(taxpayer, []), expectedResult, "next year");
  });
  
  it("Tax 2017 taxableIncome = 0", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 20000;
    taxpayer.mpf = 15000;
    taxpayer.otherDeductionsThisYear = 20000;
    expectedResult.income = 20000;
    expectedResult.taxableIncome = 0;
    expectedResult.taxableIncomeStdRate = 0;
    expectedResult.mpf = 15000;
    expectedResult.otherDeductions = 20000;
    expectedResult.basicAllowance = 132000;
    expectedResult.progressiveTaxBreakdown = [{step:0, rate:2, tax:0}];
    expectedResult.progressiveTax = 0;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 0,
        tax: 0
      }
    ];
    expectedResult.stdRateTax = 0;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = expectedResult.progressiveTax;
    let actualResult = taxRuleTest.calculateTax(taxpayer,[]);
    deepStrictEqual(actualResult, expectedResult);
  });
  
  it("Tax 2017 taxableIncome first 45000", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 133000;
    expectedResult.income = 133000;
    expectedResult.taxableIncome = 1000;
    expectedResult.taxableIncomeStdRate = 133000;
    expectedResult.basicAllowance = 132000;
    expectedResult.progressiveTaxBreakdown = [{step:1000, rate: 2, tax:20}];
    expectedResult.progressiveTax = 20;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 133000,
        tax: 19950
      }
    ];
    expectedResult.stdRateTax = 19950;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = expectedResult.progressiveTax;
    let actualResult = taxRuleTest.calculateTax(taxpayer,[]);
    deepStrictEqual(actualResult, expectedResult);
  });
  
  it("Tax 2017 taxableIncome 45000-90000", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 182000;
    expectedResult.income = 182000;
    expectedResult.taxableIncome = 50000;
    expectedResult.taxableIncomeStdRate = 182000;
    expectedResult.basicAllowance = 132000;
    expectedResult.progressiveTaxBreakdown = [
      {step:45000, rate: 2, tax:900},
      {step:5000, rate: 7, tax:350},
    ];
    expectedResult.progressiveTax = 1250;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 182000,
        tax: 27300
      }
    ];
    expectedResult.stdRateTax = 27300;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = expectedResult.progressiveTax;
    let actualResult = taxRuleTest.calculateTax(taxpayer,[]);
    deepStrictEqual(actualResult, expectedResult);
  });
  
  it("Tax 2017 taxableIncome 90000-135000", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 232000;
    expectedResult.income = 232000;
    expectedResult.taxableIncome = 100000;
    expectedResult.taxableIncomeStdRate = 232000;
    expectedResult.basicAllowance = 132000;
    expectedResult.progressiveTaxBreakdown = [
      {step:45000, rate: 2, tax:900},
      {step:45000, rate: 7, tax:3150},
      {step:10000, rate: 12, tax:1200},
    ];
    expectedResult.progressiveTax = 5250;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 232000,
        tax: 34800
      }
    ];
    expectedResult.stdRateTax = 34800;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = expectedResult.progressiveTax;
    let actualResult = taxRuleTest.calculateTax(taxpayer,[]);
    deepStrictEqual(actualResult, expectedResult);
  });
  
  it("Tax 2017 taxableIncome >135000", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 407000;
    expectedResult.income = 407000;
    expectedResult.taxableIncome = 275000;
    expectedResult.taxableIncomeStdRate = 407000;
    expectedResult.basicAllowance = 132000;
    expectedResult.progressiveTaxBreakdown = [
      {step:45000, rate: 2, tax:900},
      {step:45000, rate: 7, tax:3150},
      {step:45000, rate: 12, tax:5400},
      {step:140000, rate: 17, tax:23800},
    ];
    expectedResult.progressiveTax = 33250;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 407000,
        tax: 61050
      }
    ];
    expectedResult.stdRateTax = 61050;
    expectedResult.rate = "progressiveTax";
    expectedResult.tax = expectedResult.progressiveTax;
    let actualResult = taxRuleTest.calculateTax(taxpayer,[]);
    deepStrictEqual(actualResult, expectedResult);
  });
  
  it("Tax 2017 standard rate 15%", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 1800000;
    expectedResult.income = 1800000;
    expectedResult.taxableIncome = 1668000;
    expectedResult.taxableIncomeStdRate = 1800000;
    expectedResult.basicAllowance = 132000;
    expectedResult.progressiveTaxBreakdown = [
      {step:45000, rate: 2, tax:900},
      {step:45000, rate: 7, tax:3150},
      {step:45000, rate: 12, tax:5400},
      {step:1533000, rate: 17, tax:260610},
    ];
    expectedResult.progressiveTax = 270060;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 1800000,
        tax: 270000
      }
    ];
    expectedResult.stdRateTax = 270000;
    expectedResult.rate = "stdRateTax";
    expectedResult.tax = expectedResult.stdRateTax;
    let actualResult = taxRuleTest.calculateTax(taxpayer,[]);
    deepStrictEqual(actualResult, expectedResult);
  });

  it("Tax 2017 standard rate 16%", function() {
    let taxpayer = Object.assign({}, taxpayerTemplate);
    let expectedResult = Object.assign({}, expectedResultTemplate);
    taxpayer.income = 5100000;
    expectedResult.income = 5100000;
    expectedResult.taxableIncome = 4968000;
    expectedResult.taxableIncomeStdRate = 5100000;
    expectedResult.basicAllowance = 132000;
    expectedResult.progressiveTaxBreakdown = [
      {step:45000, rate: 2, tax:900},
      {step:45000, rate: 7, tax:3150},
      {step:45000, rate: 12, tax:5400},
      {step:4833000, rate: 17, tax:821610},
    ];
    expectedResult.progressiveTax = 831060;
    expectedResult.stdRateTaxBreakdown = [
      {
        rate: 15,
        step: 5000000,
        tax: 750000
      },
      {
        rate: 16,
        step: 100000,
        tax: 16000
      }
    ];
    expectedResult.stdRateTax = 766000;
    expectedResult.rate = "stdRateTax";
    expectedResult.tax = expectedResult.stdRateTax;
    let actualResult = taxRuleTest.calculateTax(taxpayer,[]);
    deepStrictEqual(actualResult, expectedResult);
  });
});

describe("taxRebate", function() {
  it("rebate pro-rata when amount below cap", function() {
    equal(taxRebate(1000), 1000);
  });
  it("cap when tax rebate amount reaches cap", function() {
    equal(taxRebate(45000), 1500);
  });
});




describe("taxPayable both year", function() {
  let parents = [
    {age: 2, livingTogether: false},
    {age: 2, livingTogether: true},
    {age: 4, livingTogether: false},
    {age: 4, livingTogether: true},
  ];
  
  let taxpayer = {
    name : "dummy",
    martialStatus : 0,
    income : 824000,
    mpf : 1000,
    otherDeductionsThisYear : 20000,
    otherDeductionsNextYear : 25000,
    siblings : 1,
    siblings18 : 0,
    disabledSiblings : 1,
    children : 0,
    children18 : 0,
    newbornChildrenThisYear: 0,
    newbornChildrenNextYear: 0,
    otherDisabledDependants : 1,
    provisionalTax : 500,
    disabledPerson : false,
  };
  
  it("progressive rate both year", function() {
    let expectedResult = {
      taxThisYear: {
        income: 824000,
        taxableIncome: 221000,
        taxableIncomeStdRate: 803000,
        mpf: 1000,
        otherDeductions: 20000,
        basicAllowance: 132000,
        marriedAllowance: 0,
        parentAllowance: 225000,
        siblingAllowance: 75000,
        disabledDependentAllowance: 150000,
        childAllowance: 0,
        singleParentAllowance: 0,
        personalDisabilityAllowance: 0,
        progressiveTaxBreakdown: [
          {"step":50000,"rate":2,"tax":1000},
          {"step":50000,"rate":6,"tax":3000},
          {"step":50000,"rate":10,"tax":5000},
          {"step":50000,"rate":14,"tax":7000},
          {"step":21000,"rate":17,"tax":3570}
        ],
        progressiveTax: 19570,
        stdRateTaxBreakdown: [
          {
            rate: 15,
            step: 803000,
            tax: 120450
          }
        ],
        stdRateTax: 120450,
        rate: 'progressiveTax',
        tax: 19570
      },
      taxNextYearProvisional: {
        income: 824000,
        taxableIncome: 216000,
        taxableIncomeStdRate: 798000,
        mpf: 1000,
        otherDeductions: 25000,
        basicAllowance: 132000,
        marriedAllowance: 0,
        parentAllowance: 225000,
        siblingAllowance: 75000,
        disabledDependentAllowance: 150000,
        childAllowance: 0,
        singleParentAllowance: 0,
        personalDisabilityAllowance: 0,
        progressiveTaxBreakdown: [
          {"step":50000,"rate":2,"tax":1000},
          {"step":50000,"rate":6,"tax":3000},
          {"step":50000,"rate":10,"tax":5000},
          {"step":50000,"rate":14,"tax":7000},
          {"step":16000,"rate":17,"tax":2720}
        ],
        progressiveTax: 18720,
        stdRateTaxBreakdown: [
          {
            rate: 15,
            step: 798000,
            tax: 119700
          }
        ],
        stdRateTax: 119700,
        rate: 'progressiveTax',
        tax: 18720
      },
      taxThisYearFinal: 17570,
      taxThisYearProvisional: 500,
      rebate: 1500,
      taxPayable: 36290,
    };
    let actualResult = taxPayable(taxpayer,parents);
    deepStrictEqual(actualResult, expectedResult);
  });
  
  it("standard rate both year", function() {
    taxpayer.income = 7100000;
    let expectedResult = {
      taxThisYear: {
        income: 7100000,
        taxableIncome: 6497000,
        taxableIncomeStdRate: 7079000,
        mpf: 1000,
        otherDeductions: 20000,
        basicAllowance: 132000,
        marriedAllowance: 0,
        parentAllowance: 225000,
        siblingAllowance: 75000,
        disabledDependentAllowance: 150000,
        personalDisabilityAllowance: 0,
        childAllowance: 0,
        singleParentAllowance: 0,
        progressiveTaxBreakdown: [
          {"step":50000,"rate":2,"tax":1000},
          {"step":50000,"rate":6,"tax":3000},
          {"step":50000,"rate":10,"tax":5000},
          {"step":50000,"rate":14,"tax":7000},
          {"step":6297000,"rate":17,"tax":1070490}
        ],
        progressiveTax: 1086490,
        stdRateTaxBreakdown: [
          {
            rate: 15,
            step: 5000000,
            tax: 750000
          },
          {
            rate: 16,
            step: 2079000,
            tax: 332640
          }
        ],
        stdRateTax: 1082640,
        rate: 'stdRateTax',
        tax: 1082640
      },
      taxNextYearProvisional: {
        income: 7100000,
        taxableIncome: 6492000,
        taxableIncomeStdRate: 7074000,
        mpf: 1000,
        otherDeductions: 25000,
        basicAllowance: 132000,
        marriedAllowance: 0,
        parentAllowance: 225000,
        siblingAllowance: 75000,
        disabledDependentAllowance: 150000,
        personalDisabilityAllowance: 0,
        childAllowance: 0,
        singleParentAllowance: 0,
        progressiveTaxBreakdown: [
          {"step":50000,"rate":2,"tax":1000},
          {"step":50000,"rate":6,"tax":3000},
          {"step":50000,"rate":10,"tax":5000},
          {"step":50000,"rate":14,"tax":7000},
          {"step":6292000,"rate":17,"tax":1069640}
        ],
        progressiveTax: 1085640,
        stdRateTaxBreakdown: [
          {
            rate: 15,
            step: 5000000,
            tax: 750000
          },
          {
            rate: 16,
            step: 2074000,
            tax: 331840
          }
        ],
        stdRateTax: 1081840,
        rate: 'stdRateTax',
        tax: 1081840
      },
      taxThisYearFinal: 1080640,
      taxThisYearProvisional: 500,
      rebate: 1500,
      taxPayable: 2162480
    };
    let actualResult = taxPayable(taxpayer,parents)
    deepStrictEqual(actualResult, expectedResult);
  });
});