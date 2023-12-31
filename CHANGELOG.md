# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.6] - 2023-10-15

### Added

* `refreshAccessToken` method on `auth` module.
* testing cases for `refreshAccessToken`

## [0.0.5] - 2023-10-15

### Added

* `getAccessToken` method on `auth` module.
* improve options for classes for better testing and debugging.
* add support for mocking axios methods with lib `axios-mock-adapter`.
* testing for `getAccessToken` method and error handling.


## [0.0.4] - 2023-10-15

### Fixed

* redirectUri are defined in MercadoLibreAPI but throws an error when use getAuthenticationUrl [#8](https://github.com/TheBeSharpsDevs/meli-node-sdk-unnoficial/issues/8)
* tsconfig error when install meli-node-sdk-unnoficial

### Added

* Support for import default MercadoLibreAPI and naming import other modules

## [0.0.3] - 2023-10-14

### Added
* Add Authentication URL retriever with configuration params.
* New CHANGELOG file based https://keepachangelog.com/en/1.0.0/
* Add testing for new features.