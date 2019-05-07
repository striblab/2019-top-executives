/**
 * Air Supply config file
 * https://www.npmjs.com/package/air-supply
 *
 * Air Supply gathers data from sources that are used in
 * the build process.
 */

// Depdencies
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const { argv } = require('yargs');
const transformExecutives = require('./lib/project/transform-executives.js');
const printExecutives = require('./lib/project/print-executives.js');

// Year of publishing
const publishYear = 2019;

// Export
module.exports = {
  // Default cache
  ttl: 1000 * 60 * 60 * 24,
  // Cache path
  cachePath: '.cache-air-supply',
  // Allow --no-cache to turn off caching
  noCache: argv.cache === false,
  // Datasets
  packages: {
    // Pull in config
    config: 'config.json',
    // Pull in content data
    content: 'content.json',
    argv: {
      source: argv,
      type: 'data'
    },
    publishYear: {
      source: publishYear,
      type: 'data'
    },
    executives: {
      // This is an expensive call
      ttl: 1000 * 60 * 60 * 24 * 3,
      parsers: 'json',
      source: `${
        process.env.DATA_UI_LOCATION
      }/api/v01/officer_salary/?publishyear__in=${publishYear},${publishYear -
        1}&limit=0&username=${process.env.DATA_UI_USERNAME}&api_key=${
        process.env.DATA_UI_API_KEY
      }`,
      transform: d => {
        let transformed = transformExecutives(d, {
          publishYear,
          headshotFormat: 'jpg',
          headshots: path.join(__dirname, 'assets', 'images', 'headshots')
        });

        // Want to write out for the application/client and a CSV version for print,
        // but the `output` option doesn't make that easy so we do it here
        fs.mkdirpSync('scratch');
        _.each(
          printExecutives(transformed, {
            publishYear
          }),
          (csv, id) => {
            fs.writeFileSync(`scratch/executives-${id}.csv`, csv);
          }
        );

        return transformed;
      },
      output: 'assets/data/executives.json'
    }

    // Example external data source
    // external: {
    //   source: 'http://example.com/sample.json',
    //   // parsers use the source to determine how to parse
    //   // unless explicitly set
    //   parsers: 'json',
    //   transform: (data) => {
    //     return processProcess(data);
    //   }
    // }

    // Example Google sheet (with headers)
    // Need to have GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CONSUMER_SECRET set (in the .env file)
    // googleSheet: {
    //   source: '1by2j2MNyhKlAgULgysi413jptqitxWvCYZYgl-M1Ezo',
    //   type: 'google-sheet'
    // },

    // Or just use the CSV publish-to-web
    // googleSheetCSV: {
    //   source: 'https://google.com/doc/xxxxx/csv',
    //   parsers: 'csv'
    // },
  }
};
