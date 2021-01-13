## [v0.7.0] - 2021-01-13

[Release notes](https://github.com/BetaHuhn/ackee-report/releases/tag/v0.7.0) · [Compare](https://github.com/BetaHuhn/ackee-report/compare/v0.6.4...v0.7.0) · [Tag](https://github.com/BetaHuhn/ackee-report/tree/v0.7.0) · Archive ([zip](https://github.com/BetaHuhn/ackee-report/archive/v0.7.0.zip) · [tar.gz](https://github.com/BetaHuhn/ackee-report/archive/v0.7.0.tar.gz))

### New features

- [`b5ecb58`](https://github.com/BetaHuhn/ackee-report/commit/b5ecb58)  Add support for env variables as config

### Dependency updates

- [`37b9be3`](https://github.com/BetaHuhn/ackee-report/commit/37b9be3)  Bump ejs-serve from 1.0.4 to 1.0.5 (#23)
(Issues: [`#23`](https://github.com/BetaHuhn/ackee-report/issues/23))

## [v0.6.4] - 2021-01-05

### Changed

- update dependencies

## [v0.6.3] - 2020-12-19

### Changed

- update dependencies

## [v0.6.2] - 2020-11-22

### Changed

- pages and referrers are now links in the email and rss feed
- press enter to skip optional config options

## [v0.6.1] - 2020-11-21

### Fixed

- list domains command didn't work after v0.6.0

## [v0.6.0] - 2020-11-21

### Added

- rss command to generate report as xml file/rss feed ([#7](https://github.com/BetaHuhn/ackee-report/issues/7))
- --range option to specify data range (day/week/month/six_months)
- --limit option which limits the number of list items (referrers, pages, etc.)

### Changed

- views count is now based on range option
- changed wording of email title/preview text
- refactoring
- update dependencies

## [v0.5.0] - 2020-11-01

### Added

- you can now use a permanent access token instead of your username and password to autenticate with the Ackee API

### Changed

- include data of last 30 days instead of last 7 days
- better error handling
- refactor config validation

## [v0.4.1] - 2020-10-31

### Added

- logo to readme
- template:dev command to serve template when developing
- sample report data for development
- description and example call to help output

## [v0.4.0] - 2020-10-28

### Added

- ackee email style
- option to change email style

### Changed

- separate email and json service into different commands

## [v0.3.1] - 2020-10-28

### Added

- keywords to package.json

### Changed

- change readme order and examples

### Removed

- start and dev commands from package.json

## [v0.3.0] - 2020-10-26

### Added

- include all data available through API in report

### Changed

- use ejs to render email html
- structure of data returned in report

## [v0.2.2] - 2020-10-26

### Fixed

- correctly calculate average duration of all domains

## [v0.2.1] - 2020-10-26

### Added

- use `-d all` to generate a report for all domains

## [v.2.0] - 2020-10-26

First release
