/**
 * Main JS file for project.
 */

/**
 * Define globals that are added through the js.globals in
 * the config.json file, here, mostly so linting won't get triggered
 * and its a good queue of what is available:
 */

/* global $ */

/**
 * Adding dependencies
 * ---------------------------------
 * Import local ES6 or CommonJS modules like this:
 * import utilsFn from './shared/utils.js';
 *
 * Or import libraries installed with npm like this:
 * import module from 'module';
 */

// Dependencies
import utils from './shared/utils.js';

// DOM loaded
utils.documentReady(() => {
  // Mark page with note about development or staging
  utils.environmentNoting();

  // Use jQuery because its on the page and we are lazy, and laoding in the data
  // is a bit expensive.

  // Mark as is-interactive
  $('.top-executives').addClass('is-interactive');

  // Filter category buttons
  $('#filter-category button').on('click', e => {
    e.preventDefault();
    let $this = $(e.currentTarget);

    // Class
    $('#filter-category button').removeClass('active');
    $this.addClass('active');

    filterExecutives();
  });

  // Show list types
  $('#show-list-type button').on('click', e => {
    e.preventDefault();
    let $this = $(e.currentTarget);

    // Class
    $('#show-list-type button').removeClass('active');
    $this.addClass('active');

    filterExecutives();
  });

  // Filter
  function filterExecutives() {
    // Get current filters
    let categoryFilter = $('#filter-category button.active').data('value');
    let listFilter = $('#show-list-type button.active').data('value');

    // Remove mark
    $('.executive').removeClass('filtered');

    // Filter category first
    if (categoryFilter) {
      $(`.executive:not([data-category="${categoryFilter}"])`).addClass(
        'filtered'
      );
    }

    // Remove titles
    $('.sub-list-title').addClass('filtered');

    // Filter list
    if (listFilter === 'top-female') {
      $('.female-executive-title').removeClass('filtered');
      $('.executive:not(.executive-female)').addClass('filtered');
    }
    else if (listFilter === 'top-non-ceo') {
      $('.non-ceo-title').removeClass('filtered');
      $('.executive:not(.executive-non-ceo)').addClass('filtered');
    }
    else {
      $('.ceo-title').removeClass('filtered');
      $('.executive:not(.executive-ceo)').addClass('filtered');
    }

    // Hide filtered
    $('.executive.filtered,.sub-list-title.filtered').slideUp('fast');
    $('.executive:not(.filtered),.sub-list-title:not(.filtered)').slideDown(
      'fast'
    );
  }
});

/**
 * Adding Svelte templates in the client
 * ---------------------------------
 * We can bring in the same Svelte templates that we use
 * to render the HTML into the client for interactivity.  The key
 * part is that we need to have similar data.
 *
 * First, import the template.  This is the main one, and will
 * include any other templates used in the project.
 *
 *   `import Content from '../templates/_index-content.svelte.html';`
 *
 * Get the data parts that are needed.  There are two ways to do this.
 * If you are using the buildData function to get data, then add make
 * sure the config for your data has a `local: "content.json"` property
 *
 *  1. For smaller datasets, just import them like other files.
 *     `import content from '../assets/data/content.json';`
 *  2. For larger data points, utilize window.fetch.
 *     `let content = await (await window.fetch('../assets/data/content.json')).json();`
 *
 * Once you have your data, use it like a Svelte component:
 *
 * utils.documentReady(() => {
 *   const app = new Content({
 *     target: document.querySelector('.article-lcd-body-content'),
 *     hydrate: true,
 *     data: {
 *       content
 *     }
 *   });
 * });
 */

// Common code to get svelte template loaded on the client and hack-ishly
// handle sharing
//
// import Content from '../templates/_index-content.svelte.html';
//
// utils.documentReady(() => {
//   // Deal with share place holder (remove the elements, then re-attach
//   // them in the app component)
//   const attachShare = utils.detachAndAttachElement('.share-placeholder');
//
//   // Main component
//   const app = new Content({
//     target: document.querySelector('.article-lcd-body-content'),
//     hydrate: true,
//     data: {
//       attachShare
//     }
//   });
// });
