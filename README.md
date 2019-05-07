# 2019 Top Executives

2019 list of MN top executives 

## Data

_<Describe data and where it comes from.>_

Utilizes [Air Supply](https://zzolo.org/air-supply/) to pull in data that is available in the templating.


## Development

* Markup: In `templates/` directory, specifically `templates/_index-content.svelte.html`
    * Utilizes [Svelte v2](https://v2.svelte.dev/) and pulls data from the `air-supply.config.js` file.
* Styles: [SASS](https://sass-lang.com/) styles in `styles/` directory, specifically start with `styles/shared/project.scss`.
* JS (client): Client-side JS is in `app/` directory, specifically in `app/index.js`.
    * See comments in `app/index.js` to pull in the Svelte templates for client-side interaction.
* Static assets: For things like images, anything in the `assets/` directory will get copied over to the build.

More details: [docs/development.md](./docs/development.md).

## Publishing

The `gulp deploy` command will clear out the build, re-build the project, and publish it up to `static.startribune.com`.  Use `gulp deploy --production` to put in a production spot.  Use `gulp publish:open` to open the publish URL in a browser.

If using CMS integration, run the `gulp cms:lcd --get=content` command to get the values to go into the LCD.

More details: [docs/publishing.md](./docs/publishing.md).

## CMS integration

Make sure you have an article in [news-platform](https://github.com/MinneapolisStarTribune/news-platform/) that is using the `shared/generic-interactive-v01.twig` tempalate.  Then put that article ID and LCD ID into the appropriate slots in `config.json`.

More details: [docs/cms.md](./docs/cms.md).

### Files and directories

See [docs/development.md](./docs/files-directories.md).

### Managing multiple pages

See [docs/pages.md](./docs/pages.md).

### Testing

See [docs/testing.md](./docs/testing.md).

### Code styles

See [docs/code-styles-linting.md](./docs/code-styles-linting.md).

## License

Code is licensed under the MIT license included here. Content (such as images, video, audio, copy) can only be reused with express permission by Star Tribune.

## Generated

Generated by [Star Tribune StribLab generator](https://github.com/striblab/generator-striblab) on 2019-05-07T18:18:33.639Z.
