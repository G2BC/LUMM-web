# Changelog

## [1.20.2](https://github.com/G2BC/LUMM-web/compare/v1.20.1...v1.20.2) (2026-04-06)


### Bug Fixes

* update country flag assets for Borneo and Taiwan ([38837d3](https://github.com/G2BC/LUMM-web/commit/38837d3167a5f65c5331beda3399a45a10a70633))

## [1.20.1](https://github.com/G2BC/LUMM-web/compare/v1.20.0...v1.20.1) (2026-04-06)


### Bug Fixes

* update country flag assets and adjust image class names ([08a2e7e](https://github.com/G2BC/LUMM-web/commit/08a2e7eb3ae4cfaa26b57ea0378403df57190cec))

## [1.20.0](https://github.com/G2BC/LUMM-web/compare/v1.19.2...v1.20.0) (2026-04-06)


### Features

* add country type support and related assets ([65c8ed0](https://github.com/G2BC/LUMM-web/commit/65c8ed08bdb49ad8461e3449cac9d7c10e298624))
* enhance taxonomy card with lineage and type country details ([31b52e6](https://github.com/G2BC/LUMM-web/commit/31b52e657f7585c71122d11b66edfb19a8991d58))


### Bug Fixes

* update localization for type specimen country descriptions ([f0d82c1](https://github.com/G2BC/LUMM-web/commit/f0d82c150997a1cb629d36e122c4f66d94c16dd0))

## [1.19.2](https://github.com/G2BC/LUMM-web/compare/v1.19.1...v1.19.2) (2026-04-02)


### Bug Fixes

* delay form render until reset to fix Radix Select display ([7156401](https://github.com/G2BC/LUMM-web/commit/71564010d00c2564e9491df77ca1a1a5076fabd9))

## [1.19.1](https://github.com/G2BC/LUMM-web/compare/v1.19.0...v1.19.1) (2026-04-01)


### Bug Fixes

* update lock ([8cc9ba9](https://github.com/G2BC/LUMM-web/commit/8cc9ba92b08f0003c708a18f2df9451020837673))

## [1.19.0](https://github.com/G2BC/LUMM-web/compare/v1.18.3...v1.19.0) (2026-03-31)


### Features

* migrate API layer to TanStack Query and standardize error handling ([6fe8ae0](https://github.com/G2BC/LUMM-web/commit/6fe8ae00088c75c898d096597e49767db44bbbf2))

## [1.18.3](https://github.com/G2BC/LUMM-web/compare/v1.18.2...v1.18.3) (2026-03-31)


### Bug Fixes

* pre-populate combobox knownOptions from species API data ([376268b](https://github.com/G2BC/LUMM-web/commit/376268ba7d2cdfa9a341847074d407fea2cc1b4b))

## [1.18.2](https://github.com/G2BC/LUMM-web/compare/v1.18.1...v1.18.2) (2026-03-31)


### Bug Fixes

* update size label to "Medium size (cm)" in English and Portuguese locale files ([1fe998c](https://github.com/G2BC/LUMM-web/commit/1fe998cc0d8dfab1f6a5a2ffa8851663a16457e0))

## [1.18.1](https://github.com/G2BC/LUMM-web/compare/v1.18.0...v1.18.1) (2026-03-31)


### Bug Fixes

* improve layout for nearby trees information in FindingTipsCard component based on text length ([373a59c](https://github.com/G2BC/LUMM-web/commit/373a59c4fdb32d6d7893336c97e5c3a6fef9018b))

## [1.18.0](https://github.com/G2BC/LUMM-web/compare/v1.17.1...v1.18.0) (2026-03-29)


### Features

* add species deletion functionality and enhance species creation and editing forms with inaturalist_taxon_id support ([53cfc5f](https://github.com/G2BC/LUMM-web/commit/53cfc5fb6527e72fcdfa237ad0d873065a4c99ed))
* implement infinite scroll and improve loading logic on explore page ([63f112a](https://github.com/G2BC/LUMM-web/commit/63f112a9ec6c21c9654ec25e20935537915ff20b))

## [1.17.1](https://github.com/G2BC/LUMM-web/compare/v1.17.0...v1.17.1) (2026-03-29)


### Bug Fixes

* enhance explore page responsiveness and update per-page logic in useExplorePage hook ([e9d16b9](https://github.com/G2BC/LUMM-web/commit/e9d16b91f1a0511dba2832e39f11819409c3eb98))

## [1.17.0](https://github.com/G2BC/LUMM-web/compare/v1.16.0...v1.17.0) (2026-03-28)


### Features

* add toggle group component and enhance species visibility management in forms ([eceee90](https://github.com/G2BC/LUMM-web/commit/eceee90112e9e8d7d5e97f7507677389c60a0fe1))
* implement species creation functionality with form validation and localization updates ([bcaee97](https://github.com/G2BC/LUMM-web/commit/bcaee9717d32fd50dd872eb39574b431167ec4f0))

## [1.16.0](https://github.com/G2BC/LUMM-web/compare/v1.15.1...v1.16.0) (2026-03-24)


### Features

* add collaborators page and enhance localization for contributors ([#56](https://github.com/G2BC/LUMM-web/issues/56)) ([2c92891](https://github.com/G2BC/LUMM-web/commit/2c92891da4d76b46037d7b3f051d10a1ef8c0c38))

## [1.15.1](https://github.com/G2BC/LUMM-web/compare/v1.15.0...v1.15.1) (2026-03-22)


### Bug Fixes

* restore MycoBank type label in localization files for consistency ([fa33065](https://github.com/G2BC/LUMM-web/commit/fa330659f46997fa8a031d6278f03660a0a81e76))
* update MycoBank links and labels in localization files for improved clarity ([f4e0931](https://github.com/G2BC/LUMM-web/commit/f4e093124f7196957e9fd973fec79f9ef98cb0d8))

## [1.15.0](https://github.com/G2BC/LUMM-web/compare/v1.14.0...v1.15.0) (2026-03-19)


### Features

* add species update request functionality and enhance UI with dynamic labels and user role checks ([d233c6e](https://github.com/G2BC/LUMM-web/commit/d233c6ef51a9da32e6e06034c8de8da0f4261655))

## [1.14.0](https://github.com/G2BC/LUMM-web/compare/v1.13.2...v1.14.0) (2026-03-19)


### Features

* add optional iucn_redlist property to ISpecie interface ([d5af4b3](https://github.com/G2BC/LUMM-web/commit/d5af4b3c9b1a5c091ea3cb75cf50e4af36e030df))
* add species edit page routes to the router ([339a5d1](https://github.com/G2BC/LUMM-web/commit/339a5d19291a3302ab570daf16436c3aedb82d32))
* add variant prop to DomainComboboxAsync for light and dark themes ([436062e](https://github.com/G2BC/LUMM-web/commit/436062e5f5987e9b1538582c0cb7be09f5c556e0))
* create species combobox async ([cbb181f](https://github.com/G2BC/LUMM-web/commit/cbb181f60da2dc9f74d5772f872adaf30eca6176))
* enhance header and footer components with dynamic navigation buttons based on user authentication state ([d46f332](https://github.com/G2BC/LUMM-web/commit/d46f33232611082cd5dd72df587539c2fc283160))
* implement species edit functionality with form validation and API integration ([2c6f6ce](https://github.com/G2BC/LUMM-web/commit/2c6f6cef7e99c1d010875a50ff0edd06bff827d5))
* refactor user role management with new role types and update UI components ([9181173](https://github.com/G2BC/LUMM-web/commit/918117371f4f9b5511a6651aa3e59e86fb0d657b))


### Bug Fixes

* remove duplicated mycobank link ([f20867e](https://github.com/G2BC/LUMM-web/commit/f20867e4e10cdafe81fc03cf602ac4681686cffc))
* update back navigation link to include query parameters ([77b274d](https://github.com/G2BC/LUMM-web/commit/77b274dd0302557c0ce44800920f40fccf2a14ae))

## [1.13.2](https://github.com/G2BC/LUMM-web/compare/v1.13.1...v1.13.2) (2026-03-15)


### Bug Fixes

* enhance slide and species page layout with responsive width adjustments ([bbfa9d5](https://github.com/G2BC/LUMM-web/commit/bbfa9d5b2df04b85a595c71fc0fc5c1007236680))

## [1.13.1](https://github.com/G2BC/LUMM-web/compare/v1.13.0...v1.13.1) (2026-03-15)


### Bug Fixes

* update photo attribution and rights holder labels in English and Portuguese locales ([1703cd2](https://github.com/G2BC/LUMM-web/commit/1703cd2187b3d5033fec1fa05cb57d54a864de66))

## [1.13.0](https://github.com/G2BC/LUMM-web/compare/v1.12.0...v1.13.0) (2026-03-15)


### Features

* add 'lumm' property to species photo requests and update UI components ([0f6a505](https://github.com/G2BC/LUMM-web/commit/0f6a5055a6a79d1cff8ef7cc7c41136ad1c8d6ea))

## [1.12.0](https://github.com/G2BC/LUMM-web/compare/v1.11.0...v1.12.0) (2026-03-15)


### Features

* add route-aware theme color component ([8c2304c](https://github.com/G2BC/LUMM-web/commit/8c2304c3a03d0654c3498208912a8f1a2c2b3478))
* add SpeciesActionsMenu component to species management page ([46fcd87](https://github.com/G2BC/LUMM-web/commit/46fcd87adf4e0d8d9f58449cda4acab356799cf4))
* implement species photo management functionality ([cb8a91f](https://github.com/G2BC/LUMM-web/commit/cb8a91f028bd0793bee5a9a8e80367d31022b47e))


### Bug Fixes

* update DropdownMenu to disable modal in user actions menu ([522e686](https://github.com/G2BC/LUMM-web/commit/522e686b934b9e6fbf510f67a23beec5b7186f05))

## [1.11.0](https://github.com/G2BC/LUMM-web/compare/v1.10.0...v1.11.0) (2026-03-15)


### Features

* add species management page and update navigation ([09b96e7](https://github.com/G2BC/LUMM-web/commit/09b96e7a4e117ec1b61760136f938806d9154651))

## [1.10.0](https://github.com/G2BC/LUMM-web/compare/v1.9.0...v1.10.0) (2026-03-15)


### Features

* add animations to hero section for enhanced visual appeal ([c6ec38e](https://github.com/G2BC/LUMM-web/commit/c6ec38ec1212a52fb531b3de05bf1d294b0b2154))

## [1.9.0](https://github.com/G2BC/LUMM-web/compare/v1.8.5...v1.9.0) (2026-03-15)


### Features

* improve header navigation with active link detection and path normalization ([a6c970d](https://github.com/G2BC/LUMM-web/commit/a6c970de670a10095cfaeaf0ce382c8a44a87ef1))
