# Changelog

All notable changes to textlens are documented here.

## [1.0.7] - 2026-03-07

### Added
- `npm fund` support with Stripe and GitHub Sponsors links
- Sponsor badge in README
- Free vs Pro comparison table in README

### Fixed
- FUNDING.yml links now point to correct Stripe payment URL

## [1.0.6] - 2026-03-06

### Added
- ProseScore web tool reference in README

## [1.0.5] - 2026-03-06

### Improved
- README documentation with more detailed API examples
- Better keyword descriptions in package.json for npm search

## [1.0.4] - 2026-03-05

### Added
- Hero banner image in README
- Additional badges (TypeScript, zero dependencies, sponsor)

## [1.0.3] - 2026-03-05

### Added
- CLI `--all` flag to show all analysis sections
- `--seo` flag accepts optional target keyword

## [1.0.2] - 2026-03-05

### Fixed
- CLI argument parsing edge cases

## [1.0.1] - 2026-03-04

### Fixed
- ESM/CJS dual export configuration

## [1.0.0] - 2026-03-04

### Added
- Text statistics (words, sentences, paragraphs, syllables, averages)
- 8 readability formulas: Flesch Reading Ease, Flesch-Kincaid Grade, Coleman-Liau, ARI, Gunning Fog, SMOG, Dale-Chall, Linsear Write
- Consensus grade (weighted average across all formulas)
- Reading time estimation with configurable WPM and image count
- TF-IDF keyword extraction
- Keyword density analysis (unigrams, bigrams, trigrams)
- AFINN-165 sentiment analysis
- SEO content scoring with suggestions
- Extractive summarization
- CLI tool with pretty, JSON, and minimal output formats
- Full TypeScript types
- Dual ESM/CJS builds
- Zero runtime dependencies
