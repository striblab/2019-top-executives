/**
 * Transform data from Data UI API
 */

// Dependencies
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

// Export function
module.exports = (data, options) => {
  if (!data || !data.objects) {
    throw new Error(
      'Unable to find data or objects from Executives Data UI API.'
    );
  }

  // Group by officer_id
  let officers = _.groupBy(data.objects, e => {
    return e.officerid.id;
  });

  // Reformat officers
  officers = _.map(officers, o => {
    let officer = _.omit(o[0].officerid, ['coid']);
    officer.company = o[0].officerid.coid;

    // Salaries
    officer.salaries = {};
    _.each(o, s => {
      officer.salaries[s.publishyear] = _.omit(s, ['officerid']);
    });

    return officer;
  });

  // Remove any dropped officers
  officers = _.filter(officers, o => {
    return !o.dropped || o.dropped === 0 || o.dropped === '0';
  });

  // Remove any officers that don't have current year
  officers = _.filter(officers, o => {
    if (!o.salaries[options.publishYear]) {
      return false;
    }

    return true;
  });

  // Look for images
  officers = officers.map(o => {
    let p = path.join(options.headshots, `${o.id}.${options.headshotFormat}`);
    o.hasimage = fs.existsSync(p);
    return o;
  });

  // Sanity check totals
  officers.forEach(o => {
    _.each(o.salaries, s => {
      let calculatedTotal = _.sum(
        _.filter([
          s.salary,
          s.bonus,
          s.nonequityipc,
          s.allothertotal,
          s.stockexpense,
          s.sharesvesting
        ])
      );
      if (calculatedTotal !== s.calculated_total_value) {
        console.warn(
          `[${o.id}] [${s.publishyear}]: Total mismatch | data-ui: ${
            s.calculated_total_value
          } | manual sum: ${s.calculated_total_value}`
        );
      }
    });
  });

  // Pull out female officers
  let femaleOfficers = _.map(
    _.filter(officers, o => o.gender && o.gender.match(/f/i)),
    f => {
      return JSON.parse(JSON.stringify(f));
    }
  );

  // Split into ceo and non-ceo
  let groups = _.groupBy(officers, o => {
    return o.salaries[options.publishYear].ceo &&
      !~[0, '0', null, undefined, ''].indexOf(
        o.salaries[options.publishYear].ceo
      )
      ? 'ceo'
      : 'nonceo';
  });

  // Attach female executives
  groups.female = femaleOfficers;

  // Rank
  _.each(groups, group => {
    [options.publishYear - 1, options.publishYear].forEach(year => {
      let totals = _.sortBy(
        _.uniq(
          _.map(group, o => {
            return o.salaries[year]
              ? o.salaries[year].calculated_total_value
              : -1;
          })
        )
      ).reverse();

      // Match up
      _.map(group, o => {
        if (o.salaries[year]) {
          o.salaries[year].rank =
            totals.indexOf(o.salaries[year].calculated_total_value) + 1;
        }

        return o;
      });

      // Sort by current year rank
      group = _.sortBy(group, o => {
        return o.salaries[year] ? o.salaries[year].rank : 999999999;
      });
    });
  });

  return groups;
};
