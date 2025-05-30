# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-05-30

### Added

#### Gewerbeakten-Generator
- Complete business license generation system with automatic license number creation
- Dynamic city-business selection covering all 9 RDR2RP cities and 50+ businesses
- Employee management system supporting owner and up to 2 deputies
- Automatic license count calculation based on staff numbers
- URL validation for business application links
- Support for special permits and additional notes
- Tab-based form organization for better user experience

#### Personenprüfungs-System  
- Complete person verification documentation system
- Three result types: Passed, Failed, Pending
- Detailed evaluation system with free-text comments
- Automatic date formatting in RDR2RP-compliant format (year 1899)
- Examiner tracking and contact information management

#### Antrags-Bearbeitung
- Multi-type application processing system
- Gewerbeantrag: Full business concept applications with detailed descriptions
- Gewerbeauslage: Special display permit applications  
- Gewerbekutsche: Carriage transport licenses with size selection
- Gewerbetelegramm: Business telegram number allocation with fee tracking
- Automatic approval number generation for carriage permits
- Mutual exclusive payment status checkboxes for telegram applications

#### Import/Export System
- Intelligent Discord import functionality with automatic document type detection
- Multi-format parsing supporting all document types
- Robust error handling for invalid imports
- Automatic date override to current date while preserving other data
- Smart field mapping and validation
- Collapsible import sections for clean user interface

#### User Interface
- Responsive design optimized for desktop and mobile devices
- Modular 2-column grid layout for generator pages
- Real-time preview of generated Discord output
- One-click clipboard copying functionality
- Intelligent popup system for user feedback and status updates
- Professional navigation bar with active state indicators
- Consistent theming with RDR2RP-appropriate color scheme

#### Technical Infrastructure
- Modular JavaScript architecture with separate files for each functionality
- CSS Grid-based responsive layout system
- Global utility functions for reusable logic
- Automatic GitHub Pages deployment via GitHub Actions
- Structured asset organization in public directory
- Font Awesome integration for icons
- Google Fonts integration for typography

#### Location Support
- Annesburg: Mining Company, Saloon
- Armadillo: Bestatter, Brauerei, Büchsenmacher, Farm, Gestüt, Jagdbund, Pizzeria, Saloon, Tierarzt
- Blackwater: Büchsenmacher, Farm, Metzger, Saloon, Schmied, Tabakhändler  
- Colter: Büchsenmacher, Saloon, Schmied
- Rhodes: Farm, Jagdbund, Schmied
- Strawberry: Bäckerei, Brauerei, Gestüt, Holzfäller
- Saint Denis: Bestatter, Bäckerei, Büchsenmacher, Gestüt, Gärtnerei, Jagdbund, Kutschenbauer, Saloon, Tabakhändler, Theater, Train Company, Zeitung
- Tumbleweed: Mining Company
- Valentine: Brauerei, Büchsenmacher, Farm, Gestüt, Schneider, Tierarzt

#### System Features
- License number system with format `[CITY]-[BUSINESS-PREFIX]-[DDMMYYYY]-[RANDOM]`
- Discord-optimized formatting with automatic code block syntax
- RDR2RP timeline consistency with all dates set to year 1899
- Client-side only processing for data privacy
- Comprehensive form validation with real-time feedback
- Error highlighting with visual indicators
- Graceful fallback handling for edge cases

#### Documentation
- Complete README with installation and usage instructions
- Inline code documentation for all JavaScript functions  
- Structured changelog following Keep a Changelog format
- Development guidelines for contributors
- Technical architecture documentation


[0.1.0]: https://github.com/PaulLukasHuber/rdr2rp-business-license/releases/tag/v0.1.0