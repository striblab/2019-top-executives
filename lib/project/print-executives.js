/**
 * Turned transformed executive data into CSVs
 */

// Dependencies
const _ = require('lodash');
const csv = require('d3-dsv').dsvFormat(',');

// Function to transform
module.exports = (data, options) => {
  let printables = {};

  // Other output
  _.each(data, (list, listId) => {
    printables[listId] = outputPrint(list, options, listId === 'ceo' ? 50 : 10);
  });

  return printables;
};
// Output print file, csv
function outputPrint(ceos, options = {}, limit = 50) {
  let output = ceos.map(o => {
    let c = o.company;
    let s = o.salaries[options.publishYear];
    let sPast = o.salaries[options.publishYear - 1];

    return {
      rank: s.rank,
      name: `${
        o.salut && !o.salut.match(/(mr|ms|mrs)/i) ? o.salut + ' ' : ''
      }${_.filter([o.first, o.middle, o.last]).join(' ')}${
        o.lineage ? ', ' + o.lineage : ''
      }`,
      title: s.title,
      company: c.name,
      stock: c.stocksymbol,
      category: c.category,
      description: c.shortdesc,
      total_pay: s.calculated_total_value,
      [`total_pay_${options.publishYear - 1}`]: sPast
        ? sPast.calculated_total_value
        : undefined,
      percent_change: sPast
        ? Math.round(
          ((s.calculated_total_value - sPast.calculated_total_value) /
              sPast.calculated_total_value) *
              100 *
              100
        ) / 100
        : undefined,
      salary: s.salary,
      bonus: _.sum(_.filter([s.bonus, s.nonequityipc])) || 0,
      misc: s.allothertotal,
      stock_expense: s.stockexpense,
      shares_vesting: s.sharesvesting,
      combined_stock_awards:
        _.sum(_.filter([s.stockexpense, s.sharesvesting])) || 0,
      one_year_return: s.stockchange,
      ceo_pay_ratio: s.ceopayratio,
      median_employee_pay: s.medianemployeepay,
      footnotes: s.footnotes
    };
  });

  // Sort
  output = _.sortBy(output, 'rank');

  // Top 50
  output = _.take(output, limit);

  return csv.format(output);
}
