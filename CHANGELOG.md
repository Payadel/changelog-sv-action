# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.4](https://github.com/Payadel/changelog-sv-action/compare/v0.0.3...v0.0.4) (2023-04-28)


### Features

* add `ignoreLessVersionError` ([7727b10](https://github.com/Payadel/changelog-sv-action/commit/7727b10d0bfadd8f9649563f8bc2d3685934d822))
* raise error if input version be less than previous version ([fc1167b](https://github.com/Payadel/changelog-sv-action/commit/fc1167b8baf6e06db9a6528c23bdfd62cdca5d12))


### Refactors

* add configs.ts ([3bec34f](https://github.com/Payadel/changelog-sv-action/commit/3bec34f86e14f5344fb494f47675b872bcfaad8f))


### Tests

* add test for readChangelogSection ([3c9b83b](https://github.com/Payadel/changelog-sv-action/commit/3c9b83b5c859ccc2c3061f2663ae9b559dcd0f1a))
* add tests for outputs.ts ([2653602](https://github.com/Payadel/changelog-sv-action/commit/265360253086714fff74a74b7a79175f984ac5a9))


### Fixes

* checkout all files except CHANGELOG.md ([9147f95](https://github.com/Payadel/changelog-sv-action/commit/9147f951029a200ee6e31624e54b7c44ee65950c))
* fix `readChangelogSection` ([8024443](https://github.com/Payadel/changelog-sv-action/commit/80244436f943a38427ee749ec6f22b7a060446e1))
* fix bugs ([c5718a4](https://github.com/Payadel/changelog-sv-action/commit/c5718a4c86852195116e42bdf6df4a17e0ba06a5))
* only the text of the latest changelog is displayed ([a55320f](https://github.com/Payadel/changelog-sv-action/commit/a55320fbd1a191f2c38a8b0c276933b4d450eb11))
* update same and less version error messages ([2687165](https://github.com/Payadel/changelog-sv-action/commit/26871650012378b3620da96aa46feffd58c7c9bb))


### Development: CI/CD, Build, etc

* remove excess step in changelog.yaml ([543f0fa](https://github.com/Payadel/changelog-sv-action/commit/543f0faa6d3a8d20da64a1652396f005d144a4fe))
* update actions ([7a074e9](https://github.com/Payadel/changelog-sv-action/commit/7a074e91b4b500233f9e9e7c68e29c8295769600))
* update build-test.yml ([d61ad3b](https://github.com/Payadel/changelog-sv-action/commit/d61ad3bc0475c1ff253819f3465094cf1256e530))

### [0.0.3](https://github.com/Payadel/changelog-sv-action/compare/v0.0.2...v0.0.3) (2023-04-27)


### Features

* add `ignore-same-version-error` input to ignore same version error ([22898f7](https://github.com/Payadel/changelog-sv-action/commit/22898f7a4466db581497f8d832ebcbae47a53b6c))


### Development: CI/CD, Build, etc

* **deps:** bump Payadel/release-sv-action from 0.2.1 to 0.2.2 ([8f84614](https://github.com/Payadel/changelog-sv-action/commit/8f846147fab9213cff470114c234ce814206c204))


### Refactors

* changelog_fileName ([ad8c5f1](https://github.com/Payadel/changelog-sv-action/commit/ad8c5f1b6afb44354e5b2dc7880fb4283dd2556b))


### Fixes

* fix `execCommand` and add test case ([2251b1f](https://github.com/Payadel/changelog-sv-action/commit/2251b1f5b0fea160f13ee11bc76a1012ac116b2d))
* improve `readFile` & add tests ([0420535](https://github.com/Payadel/changelog-sv-action/commit/04205359d830340b2a168318bb2b0217239ed628))
* improve `readVersion` & add tests ([f9fe6db](https://github.com/Payadel/changelog-sv-action/commit/f9fe6dbf182713a4e3bc9d56e42f28b453befa13))
* improve get inputs ([0c36e1f](https://github.com/Payadel/changelog-sv-action/commit/0c36e1f9b3963a614fb01fa8cea151e76919bf05))
* raise error if input version equal to previous version ([27e03e3](https://github.com/Payadel/changelog-sv-action/commit/27e03e39e218cc408d8fc7d73a992ebfe0a2f8b5))
* refactor & improve main codes ([49dde67](https://github.com/Payadel/changelog-sv-action/commit/49dde67110ec7e23cd183e9f116ae8241718e440))
* update version regex ([782a20c](https://github.com/Payadel/changelog-sv-action/commit/782a20ca3f3f16c5ff4d11231d0dbf2d629ff323))


### Tests

* fix inputs.test.ts ([f1b1566](https://github.com/Payadel/changelog-sv-action/commit/f1b15663a7469162e79745b4e03a1acb15b1f150))
* update jest.config.js ([b2a3316](https://github.com/Payadel/changelog-sv-action/commit/b2a33165f09ed166a51cbdff138950fe58b78c07))

### 0.0.1 (2023-03-17)

### Features

* add base
  codes ([e20fe7c](https://github.com/Payadel/changelog-sv-action/commit/e20fe7c4a10eb59f821a4b83155b8702970fe871))
* try install the standard-version package in the first
  script ([9c931a8](https://github.com/Payadel/changelog-sv-action/commit/9c931a8a98ddc9d8e9653426074347f06ad7624c))

### Documents

* add Payadel readme
  template ([8b9a806](https://github.com/Payadel/changelog-sv-action/commit/8b9a806273d73b3aa90859cd42f7029d174a1474))
