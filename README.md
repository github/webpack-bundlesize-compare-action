# Webpack bundlesize compare action

An action that compares 2 webpack compilation stats files, and comments on the PR with a description of the difference

## How to use it

In your application, ensure you output the stats.json, from `BundleAnalyzerPlugin'

```js
// webpack.config.js
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

module.exports = {
  plugins: [
  ...plugins,
     new BundleAnalyzerPlugin({
      // generate the stats.json file
      generateStatsFile: true,
    })
  ]
}
```

```yaml
# .github/workflows/bundlesize-compare.yml

on:
  # this action will error unless run in a pr context
  pull_request:
  pull_request_target:

jobs:

  # Build current and upload stats.json
  build-head:
    name: 'Build head'
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v2
        with:
          ref: ${{github.event.pull_request.head.ref}}
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload stats.json
        uses: actions/upload-artifact@v1
        with:
          name: head-stats
          path: ./dist/stats.json
          
  # Build base for comparison and upload stats.json
  build-base:
    name: 'Build base'
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v2
        with:
          ref: ${{ github.base_ref }}
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload stats.json
        uses: actions/upload-artifact@v1
        with:
          name: base-stats
          path: ./dist/stats.json

  # Checkout the action repo, download artifacts, and run the action
  # against the stats.json files
  compare:
    name: 'Compare base & head bundle sizes'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    needs: [build-base, build-head]
    steps:
      - name: Install Node.js 16.x
        uses: actions/setup-node@v1
        with:
          node-version: 16.x
          registry-url: https://npm.pkg.github.com/
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/checkout@v2

      - name: Download base artifact
        uses: actions/download-artifact@v1
        with:
          name: base-stats

      - name: Download head artifact
        uses: actions/download-artifact@v1
        with:
          name: head-stats

      # Checkout the action repository - since it's a private repo
      # we can't just use it directly
      - uses: actions/checkout@v2
        with:
          repository: github/webpack-bundlesize-compare-action
          token: ${{ secrets.A_TOKEN_THAT_CAN_READ_REPO_FOR_THE_ACTION_REPO }}
          path: .github/actions/webpack-bundlesize-compare-action
          ref: v1

      - name: Bundlesize compare
        uses: ./.github/actions/webpack-bundlesize-compare-action
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          current-stats-json-path: ./head-stats/stats.json
          base-stats-json-path: ./base-stats/stats.json
```

## Options

name | description | required | type 
--- | --- | --- | ---
current-stats-json-path | The path to the current stats.json file | true | string
base-stats-json-path | The path to the base stats.json file | true | string
github-token | The Github token | true | string
title | An optional addition to the title, which also helps key comments, useful if running more than 1 copy of this action | false | string

## Example PR Comment

<img width="630" alt="Screen Shot 2022-01-09 at 2 23 21 PM" src="https://user-images.githubusercontent.com/8616962/148697506-9a73d769-e1ca-4fc0-b189-c5f30c24fd6b.png">
