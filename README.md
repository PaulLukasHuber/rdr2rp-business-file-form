# 📜 RDR2RP Gewerbeakten Generator

![Version](https://img.shields.io/badge/Version-1.2.0-gold)
![License](https://img.shields.io/badge/Lizenz-MIT-blue)

Ein interaktives Webformular zur einfachen Erstellung von formatierten Gewerbeakten für einen Red Dead Redemption 2 Roleplay-Discord-Server.


## 📋 Übersicht

Der RDR2RP Gewerbeakten Generator ist ein benutzerfreundliches Tool, das speziell für die Verwaltung von Gewerbeakten im RDR2RP-Universum entwickelt wurde. Das Tool ermöglicht die strukturierte Erfassung aller relevanten Informationen und generiert automatisch eine formatierte Discord-Nachricht, die direkt in den entsprechenden Discord-Kanal kopiert werden kann.

### 🌟 Hauptfunktionen

- **Stadtauswahl**: Unterstützung für alle Städte der RDR2RP-Welt (Annesburg, Armadillo, Blackwater, etc.)
- **Dynamische Betriebsauswahl**: Automatische Anzeige der verfügbaren Betriebe je nach ausgewählter Stadt
- **Mitarbeiterverwaltung**: Einfache Verwaltung von Inhabern und bis zu zwei Stellvertretungen
- **Datumswahl**: Spezifische Datumsauswahl im Jahr 1899 (RDR2-Zeitlinie)
- **Vorschau**: Echtzeit-Vorschau der generierten Discord-Nachricht
- **Kopieren mit einem Klick**: Schnelles Kopieren des formatierten Textes in die Zwischenablage
- **Responsive Design**: Optimiert für Desktop und Mobile Geräte

## 💻 Verwendung

### Online Version

Die einfachste Möglichkeit, den Generator zu nutzen, ist die [Online-Version](https://PaulLukasHuber.github.io/rdr2rp-business-file-form/):

1. Öffne die Webseite in deinem Browser
2. Fülle alle erforderlichen Felder aus:
   - Vermerk (Discord-Link zum Gewerbeantrag)
   - Stadt und Betrieb
   - Ausstellungsdatum
   - Mitarbeiterinformationen (Inhaber ist Pflichtfeld)
3. Klicke auf "Discord Vorlage generieren"
4. Kopiere den generierten Text mit dem "In Zwischenablage kopieren"-Button
5. Füge den Text im entsprechenden Discord-Kanal ein

### Lokale Verwendung

Falls du den Generator lokal nutzen möchtest:

```bash
# Repository klonen
git clone https://github.com/PaulLukasHuber/rdr2rp-business-license.git

# In den Projektordner wechseln
cd rdr2rp-business-license

# index.html im Browser öffnen
# Unter Windows:
start index.html
# Unter macOS:
open index.html
# Unter Linux:
xdg-open index.html
```

## 🛠️ Technische Details

Der Generator ist als reine Frontend-Anwendung implementiert und benötigt keinen Server. Die folgenden Technologien kommen zum Einsatz:

- **HTML5**: Struktur und Semantik
- **CSS3**: Styling mit Custom Properties für einheitliches Theming
- **JavaScript (ES6+)**: Modulares Design mit separaten Dateien für:
  - `main.js`: Hauptanwendungslogik
  - `employees.js`: Mitarbeiterverwaltung
  - `validation.js`: Formularvalidierung
  - `utils.js`: Hilfsfunktionen

Die Architektur folgt einem modularen Ansatz, der die Wartbarkeit und Erweiterbarkeit der App sicherstellt.

## 🔍 Funktionsdetails

### Städte und Betriebe

Der Generator unterstützt die folgenden Städte mit ihren spezifischen Betrieben:

- **AB - Annesburg**: Mining Company, Saloon, ...
- **AD - Armadillo**: Bestatter, Bäckerei, Brauerei, ...
- **BW - Blackwater**: Metzger, Büchsenmacher, Tabakhändler, ...
- **CO - Colter**: Schmied, Saloon, ...
- **RH - Rhodes**: Jagdbund, Schmied, Farm, ...
- **SB - Strawberry**: Bäckerei, Brauerei, Gestüt, ...
- **SD - Saint Denis**: Jagdbund, Bäckerei, Bestatter, ...
- **TW - Tumbleweed**: Mining Company, ...
- **VA - Valentine**: Farm, Brauerei, Saloon, ...

### Lizenznummern-System

Jede generierte Lizenz erhält automatisch eine eindeutige Kennung nach dem Format `[STADT-KÜRZEL] - [ZUFALLSSTRING]` (z.B. `VA - a7Bd9xYz`).

## 📝 Entwicklung

### Projektstruktur

```
rdr2rp-business-license/
├── index.html              # Hauptdatei mit HTML-Struktur
├── assets/
│   ├── css/
│   │   ├── styles.css      # Hauptstylesheets
│   │   └── validation.css  # Validierungs-spezifische Styles
│   └── js/
│       ├── main.js         # Hauptanwendungslogik
│       ├── employees.js    # Mitarbeiterverwaltung
│       ├── validation.js   # Formularvalidierung
│       └── utils.js        # Hilfsfunktionen
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages Deployment
```

### Beitragen

Du möchtest zum Projekt beitragen? Großartig! Hier sind die Schritte:

1. Forke das Repository auf GitHub
2. Erstelle einen Feature-Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Pushe den Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 🎮 Kompatibilität

Der Generator ist optimiert für moderne Browser:

- Chrome/Edge (neueste Version)
- Firefox (neueste Version)
- Safari (neueste Version)
- Opera (neueste Version)

Das responsive Design sorgt für eine optimale Darstellung auf Desktop-Computern, Tablets und Smartphones.

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz - siehe die [LICENSE](LICENSE) Datei für Details.


---

⭐ Entwickelt mit ❤️ für die RDR2RP-Community ⭐
