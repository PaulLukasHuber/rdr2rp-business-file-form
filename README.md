# 📜 RDR2RP Gewerbeakten Generator

![Version](https://img.shields.io/badge/Version-0.1.2-gold)
![License](https://img.shields.io/badge/Lizenz-MIT-blue)

**Languages / Sprachen:** [🇩🇪 Deutsch](#deutsch) | [🇬🇧 English](#english)

---

## Deutsch

Ein interaktives Webformular-System zur einfachen Erstellung von formatierten Gewerbeakten, Personenprüfungsakten und Anträgen für einen Red Dead Redemption 2 Roleplay-Discord-Server.

### 📋 Übersicht

Der RDR2RP Gewerbeakten Generator ist ein umfassendes Tool, das speziell für die Verwaltung von Gewerbeakten, Personenprüfungen und Anträgen im RDR2RP-Universum entwickelt wurde. Das System ermöglicht die strukturierte Erfassung aller relevanten Informationen und generiert automatisch formatierte Discord-Nachrichten, die direkt in den entsprechenden Discord-Kanal kopiert werden können.

### 🌟 Hauptfunktionen

- **Gewerbeakten-Generator**: Vollständige Erstellung mit automatischer Lizenznummer-Generierung
- **Personenprüfungs-System**: Dokumentation von Prüfungen mit Ergebnisbewertung  
- **Antrags-Bearbeitung**: Verarbeitung von Gewerbekonzepten, Kutschen-Genehmigungen und mehr
- **Import-Funktionalität**: Bearbeitung bestehender Akten durch Discord-Import
- **Dynamische Stadt-Betrieb-Auswahl**: Automatische Anzeige der verfügbaren Betriebe je nach Stadt
- **Mitarbeiterverwaltung**: Einfache Verwaltung von Inhabern und bis zu zwei Stellvertretungen
- **Datumswahl**: Spezifische Datumsauswahl im Jahr 1899 (RDR2-Zeitlinie)
- **Vorschau**: Echtzeit-Vorschau der generierten Discord-Nachricht
- **Kopieren mit einem Klick**: Schnelles Kopieren des formatierten Textes in die Zwischenablage
- **Responsive Design**: Optimiert für Desktop und Mobile Geräte

### 💻 Verwendung

#### Online Version

Die einfachste Möglichkeit, den Generator zu nutzen, ist die [Online-Version](https://PaulLukasHuber.github.io/rdr2rp-business-file-form/):

1. Öffne die Webseite in deinem Browser
2. Wähle den gewünschten Generator (Gewerbeakte, Personenprüfung oder Antrag)
3. Fülle alle erforderlichen Felder aus
4. Klicke auf "Discord Vorlage generieren"
5. Kopiere den generierten Text mit dem "In Zwischenablage kopieren"-Button
6. Füge den Text im entsprechenden Discord-Kanal ein

#### Lokale Verwendung

Falls du den Generator lokal nutzen möchtest:

```bash
# Repository klonen
git clone https://github.com/PaulLukasHuber/rdr2rp-business-license.git

# In den Projektordner wechseln
cd rdr2rp-business-license

# public/index.html im Browser öffnen
# Unter Windows:
start public/index.html
# Unter macOS:
open public/index.html
# Unter Linux:
xdg-open public/index.html
```

### 🔍 Funktionsdetails

#### Gewerbeakten-Generator

- **Automatische Lizenznummer-Generierung**: Format `[STADT-KÜRZEL]-[BETRIEB-PREFIX]-[DATUM]-[ZUFALLSSTRING]`
- **Mitarbeiterverwaltung**: Inhaber (Pflichtfeld) + bis zu 2 Stellvertreter
- **URL-Validierung**: Automatische Prüfung der Gewerbeantrag-Links
- **Sondergenehmigungen**: Freitext für spezielle Genehmigungen

#### Personenprüfungs-System

- **Drei Ergebnistypen**: Bestanden ✅, Nicht bestanden ❌, Ausstehend ⏳
- **Detaillierte Bewertungen**: Ausführliche Anmerkungen zum Prüfungsverlauf
- **Automatische Datumsformatierung**: RDR2RP-konformes Datumsformat

#### Antrags-Bearbeitung

Unterstützte Antragstypen:
- **Gewerbeantrag**: Vollständige Gewerbekonzepte mit detaillierter Beschreibung
- **Gewerbeauslage**: Spezielle Auslagen-Genehmigungen
- **Gewerbekutsche**: Kutschentransport-Lizenzen mit Größenauswahl (Klein/Groß)
- **Gewerbetelegramm**: Telegrammnummer-Vergabe mit Gebührenverfolgung

### 🏘️ Städte und Betriebe

Der Generator unterstützt die folgenden Städte mit ihren spezifischen Betrieben:

- **AB - Annesburg**: Mining Company, Saloon
- **AD - Armadillo**: Bestatter, Brauerei, Büchsenmacher, Farm, Gestüt, Jagdbund, Pizzeria (Event Gewerbe), Saloon, Tierarzt
- **BW - Blackwater**: Büchsenmacher, Farm, Metzger, Saloon, Schmied, Tabakhändler
- **CO - Colter**: Büchsenmacher, Saloon, Schmied
- **RH - Rhodes**: Farm, Jagdbund, Schmied
- **SB - Strawberry**: Bäckerei, Brauerei, Gestüt, Holzfäller
- **SD - Saint Denis**: Bestatter, Bäckerei, Büchsenmacher, Gestüt, Gärtnerei, Jagdbund, Kutschenbauer, Saloon, Tabakhändler, Theater, Train Company, Zeitung
- **TW - Tumbleweed**: Mining Company
- **VA - Valentine**: Brauerei, Büchsenmacher, Farm, Gestüt, Schneider, Tierarzt

### 🛠️ Technische Details

Der Generator ist als reine Frontend-Anwendung implementiert und benötigt keinen Server. Die folgenden Technologien kommen zum Einsatz:

- **HTML5**: Struktur und Semantik
- **CSS3**: Styling mit Custom Properties für einheitliches Theming
- **JavaScript (ES6+)**: Modulares Design mit separaten Dateien für jede Funktionalität
- **Font Awesome**: Icons und visuelle Elemente
- **Google Fonts**: Roboto-Schriftart für bessere Lesbarkeit

### 📝 Entwicklung

#### Projektstruktur

```
rdr2rp-business-license/
├── public/                 # Produktive Website-Dateien
│   ├── assets/
│   │   ├── css/
│   │   │   ├── global/    # Globale Stylesheets
│   │   │   └── pages/     # Seitenspezifische Styles
│   │   ├── js/
│   │   │   ├── global/    # Gemeinsame JavaScript-Module
│   │   │   └── pages/     # Seitenspezifische Logik
│   │   └── img/           # Bilder und Icons
│   └── *.html             # HTML-Seiten
├── tools/                 # Build-Scripts und Tools
├── docs/                  # Dokumentation
└── .github/               # GitHub Actions Workflows
```

#### Beitragen

Du möchtest zum Projekt beitragen? Großartig! Hier sind die Schritte:

1. Forke das Repository auf GitHub
2. Erstelle einen Feature-Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Pushe den Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

### 🎮 Kompatibilität

Der Generator ist optimiert für moderne Browser:

- Chrome/Edge (neueste Version)
- Firefox (neueste Version)
- Safari (neueste Version)
- Opera (neueste Version)

Das responsive Design sorgt für eine optimale Darstellung auf Desktop-Computern, Tablets und Smartphones.

### 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz - siehe die [LICENSE](LICENSE) Datei für Details.

---

## English

An interactive web form system for easy creation of formatted business licenses, person verification records, and applications for a Red Dead Redemption 2 Roleplay Discord server.

### 📋 Overview

The RDR2RP Business License Generator is a comprehensive tool specifically developed for managing business licenses, person verifications, and applications in the RDR2RP universe. The system enables structured capture of all relevant information and automatically generates formatted Discord messages that can be directly copied to the appropriate Discord channel.

### 🌟 Main Features

- **Business License Generator**: Complete creation with automatic license number generation
- **Person Verification System**: Documentation of examinations with result evaluation
- **Application Processing**: Processing of business concepts, carriage permits, and more
- **Import Functionality**: Edit existing records through Discord import
- **Dynamic City-Business Selection**: Automatic display of available businesses per city
- **Employee Management**: Easy management of owners and up to two deputies
- **Date Selection**: Specific date selection in the year 1899 (RDR2 timeline)
- **Preview**: Real-time preview of the generated Discord message
- **One-Click Copy**: Quick copying of formatted text to clipboard
- **Responsive Design**: Optimized for desktop and mobile devices

### 💻 Usage

#### Online Version

The easiest way to use the generator is the [Online Version](https://PaulLukasHuber.github.io/rdr2rp-business-file-form/):

1. Open the website in your browser
2. Select the desired generator (Business License, Person Verification, or Application)
3. Fill out all required fields
4. Click "Generate Discord Template"
5. Copy the generated text with the "Copy to Clipboard" button
6. Paste the text in the appropriate Discord channel

#### Local Usage

If you want to use the generator locally:

```bash
# Clone repository
git clone https://github.com/PaulLukasHuber/rdr2rp-business-license.git

# Change to project directory
cd rdr2rp-business-license

# Open public/index.html in browser
# On Windows:
start public/index.html
# On macOS:
open public/index.html
# On Linux:
xdg-open public/index.html
```

### 🔍 Feature Details

#### Business License Generator

- **Automatic License Number Generation**: Format `[CITY-CODE]-[BUSINESS-PREFIX]-[DATE]-[RANDOM-STRING]`
- **Employee Management**: Owner (required) + up to 2 deputies
- **URL Validation**: Automatic verification of business application links
- **Special Permits**: Free text for special permissions

#### Person Verification System

- **Three Result Types**: Passed ✅, Failed ❌, Pending ⏳
- **Detailed Evaluations**: Comprehensive notes on examination progress
- **Automatic Date Formatting**: RDR2RP-compliant date format

#### Application Processing

Supported application types:
- **Business Application**: Complete business concepts with detailed description
- **Business Display**: Special display permits
- **Business Carriage**: Carriage transport licenses with size selection (Small/Large)
- **Business Telegram**: Telegram number allocation with fee tracking

### 🏘️ Cities and Businesses

The generator supports the following cities with their specific businesses:

- **AB - Annesburg**: Mining Company, Saloon
- **AD - Armadillo**: Bestatter, Brauerei, Büchsenmacher, Farm, Gestüt, Jagdbund, Pizzeria (Event Business), Saloon, Tierarzt
- **BW - Blackwater**: Büchsenmacher, Farm, Metzger, Saloon, Schmied, Tabakhändler
- **CO - Colter**: Büchsenmacher, Saloon, Schmied
- **RH - Rhodes**: Farm, Jagdbund, Schmied
- **SB - Strawberry**: Bäckerei, Brauerei, Gestüt, Holzfäller
- **SD - Saint Denis**: Bestatter, Bäckerei, Büchsenmacher, Gestüt, Gärtnerei, Jagdbund, Kutschenbauer, Saloon, Tabakhändler, Theater, Train Company, Zeitung
- **TW - Tumbleweed**: Mining Company
- **VA - Valentine**: Brauerei, Büchsenmacher, Farm, Gestüt, Schneider, Tierarzt

### 🛠️ Technical Details

The generator is implemented as a pure frontend application and requires no server. The following technologies are used:

- **HTML5**: Structure and semantics
- **CSS3**: Styling with Custom Properties for consistent theming
- **JavaScript (ES6+)**: Modular design with separate files for each functionality
- **Font Awesome**: Icons and visual elements
- **Google Fonts**: Roboto font for better readability

### 📝 Development

#### Project Structure

```
rdr2rp-business-license/
├── public/                 # Production website files
│   ├── assets/
│   │   ├── css/
│   │   │   ├── global/    # Global stylesheets
│   │   │   └── pages/     # Page-specific styles
│   │   ├── js/
│   │   │   ├── global/    # Shared JavaScript modules
│   │   │   └── pages/     # Page-specific logic
│   │   └── img/           # Images and icons
│   └── *.html             # HTML pages
├── tools/                 # Build scripts and tools
├── docs/                  # Documentation
└── .github/               # GitHub Actions workflows
```

#### Contributing

Want to contribute to the project? Great! Here are the steps:

1. Fork the repository on GitHub
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 🎮 Compatibility

The generator is optimized for modern browsers:

- Chrome/Edge (latest version)
- Firefox (latest version)
- Safari (latest version)
- Opera (latest version)

The responsive design ensures optimal display on desktop computers, tablets, and smartphones.

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

⭐ Developed with ❤️ for the RDR2RP Community ⭐
