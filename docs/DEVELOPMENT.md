# Development Guide

## Ordnerstruktur

### CSS-Organisation
- `assets/css/global/` - Globale Styles für alle Seiten
- `assets/css/pages/` - Page-spezifische Styles

### JavaScript-Organisation  
- `assets/js/global/` - Gemeinsame Funktionen und Utils
- `assets/js/pages/` - Page-spezifische Logik

## Entwicklung

1. **Neue Seite hinzufügen:**
   - HTML-Datei im Root erstellen
   - CSS in `assets/css/pages/` hinzufügen
   - JS in `assets/js/pages/` hinzufügen

2. **Globale Funktionen:**
   - In `assets/js/global/utils.js` hinzufügen
   - Alle Seiten können diese nutzen

3. **Styles:**
   - Globale Styles in entsprechende Datei
   - Page-spezifische Styles separat halten
