#!/usr/bin/env python3
"""
Migration Script für RDR2RP Gewerbeakten Generator
Strukturiert die Dateien in eine saubere Ordnerstruktur um.
"""

import os
import shutil
import json
from pathlib import Path

def create_directory_structure():
    """Erstellt die neue Ordnerstruktur"""
    directories = [
        'public/assets/css/global',
        'public/assets/css/pages', 
        'public/assets/js/global',
        'public/assets/js/pages/gewerbeakte',
        'public/assets/js/pages/personenpruefung',
        'public/assets/js/pages/antrag',
        'public/assets/img/icons',
        'src/templates',
        'src/styles', 
        'src/scripts',
        'docs',
        'tools'
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✅ Erstellt: {directory}")

def migrate_css_files():
    """Migriert und reorganisiert CSS-Dateien"""
    
    # Globale CSS-Dateien mapping (jetzt in public/)
    global_css_mapping = {
        'assets/css/global/navbar.css': 'public/assets/css/global/layout.css',
        'assets/css/global/footer.css': 'public/assets/css/global/layout.css',  # merge
        'assets/css/global/bg_animation.css': 'public/assets/css/global/animations.css',
        'assets/css/global/form_style.css': 'public/assets/css/global/components.css',
        'assets/css/global/popup.css': 'public/assets/css/global/components.css',  # merge
        'assets/css/global/preview.css': 'public/assets/css/global/components.css',  # merge
        'assets/css/global/main_content.css': 'public/assets/css/global/layout.css',  # merge
        'assets/css/global/scrollbar.css': 'public/assets/css/global/base.css',
        'assets/css/global/import_section.css': 'public/assets/css/global/components.css'  # merge
    }
    
    # Page-spezifische CSS-Dateien (jetzt in public/)
    page_css_mapping = {
        'assets/css/index/index_stylesheet.css': 'public/assets/css/pages/home.css',
        'assets/css/gewerbeakte_generator/ga_stylesheet.css': 'public/assets/css/pages/gewerbeakte.css',
        'assets/css/personenpruefung_generator/pp_stylesheet.css': 'public/assets/css/pages/personenpruefung.css',
        'assets/css/antrag_generator/antrag_stylesheet.css': 'public/assets/css/pages/antrag.css'
    }
    
    print("\n📁 Migriere CSS-Dateien...")
    
    # Global CSS
    for old_path, new_path in global_css_mapping.items():
        if os.path.exists(old_path):
            # Für merge-Fälle: Inhalte anhängen
            if os.path.exists(new_path):
                with open(old_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                with open(new_path, 'a', encoding='utf-8') as f:
                    f.write(f"\n\n/* === From {old_path} === */\n")
                    f.write(content)
                print(f"📝 Merged: {old_path} -> {new_path}")
            else:
                shutil.copy2(old_path, new_path)
                print(f"📁 Moved: {old_path} -> {new_path}")
    
    # Page CSS
    for old_path, new_path in page_css_mapping.items():
        if os.path.exists(old_path):
            shutil.copy2(old_path, new_path)
            print(f"📁 Moved: {old_path} -> {new_path}")

def migrate_js_files():
    """Migriert und reorganisiert JavaScript-Dateien"""
    
    # JavaScript-Dateien mapping (jetzt in public/)
    js_mapping = {
        'assets/js/index/script.js': 'public/assets/js/pages/home.js',
        'assets/js/gewerbeakte_generator/script.js': 'public/assets/js/pages/gewerbeakte/main.js',
        'assets/js/gewerbeakte_generator/import_script.js': 'public/assets/js/pages/gewerbeakte/import.js',
        'assets/js/personenpruefung_generator/script.js': 'public/assets/js/pages/personenpruefung/main.js',
        'assets/js/personenpruefung_generator/import_script.js': 'public/assets/js/pages/personenpruefung/import.js',
        'assets/js/antrag_generator/script.js': 'public/assets/js/pages/antrag/main.js',
        'assets/js/antrag_generator/import_script.js': 'public/assets/js/pages/antrag/import.js'
    }
    
    print("\n📁 Migriere JavaScript-Dateien...")
    
    for old_path, new_path in js_mapping.items():
        if os.path.exists(old_path):
            shutil.copy2(old_path, new_path)
            print(f"📁 Moved: {old_path} -> {new_path}")

def create_global_js_modules():
    """Erstellt globale JavaScript-Module"""
    
    # Utils.js - Gemeinsame Hilfsfunktionen
    utils_content = '''/**
 * Global Utility Functions
 * Gemeinsame Hilfsfunktionen für alle Seiten
 */

// Format date function
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
}

// Generate random string
function generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Set current date with year 1899
function setCurrentDate1899(inputId) {
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentDay = String(today.getDate()).padStart(2, '0');
    
    document.getElementById(inputId).value = `1899-${currentMonth}-${currentDay}`;
}

// Copy to clipboard with feedback
async function copyToClipboard(text, button = null) {
    try {
        await navigator.clipboard.writeText(text);
        
        if (button) {
            const originalText = button.textContent;
            button.textContent = '✅ Kopiert!';
            button.style.background = 'linear-gradient(135deg, #35A2A2 0%, #6F3E96 100%)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = 'linear-gradient(135deg, #F4C066 0%, #D99C45 100%)';
            }, 2000);
        }
        
        return true;
    } catch (error) {
        console.error('Copy failed:', error);
        return false;
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        generateRandomString,
        setCurrentDate1899,
        copyToClipboard
    };
}
'''
    
    with open('public/assets/js/global/utils.js', 'w', encoding='utf-8') as f:
        f.write(utils_content)
    
    print("✅ Erstellt: public/assets/js/global/utils.js")

def migrate_html_files():
    """Verschiebt HTML-Dateien in den public/ Ordner"""
    
    html_files = [
        'index.html',
        'gewerbeakte_generator.html', 
        'personenpruefung_generator.html',
        'antrag_generator.html'
    ]
    
    print("\n📄 Migriere HTML-Dateien...")
    
    for html_file in html_files:
        if os.path.exists(html_file):
            shutil.copy2(html_file, f'public/{html_file}')
            print(f"📁 Moved: {html_file} -> public/{html_file}")

def migrate_assets():
    """Migriert andere Assets (Bilder, etc.)"""
    
    print("\n🖼️ Migriere andere Assets...")
    
    # Favicon und Bilder
    if os.path.exists('assets/img'):
        if os.path.exists('public/assets/img'):
            shutil.rmtree('public/assets/img')
        shutil.copytree('assets/img', 'public/assets/img')
        print("📁 Moved: assets/img -> public/assets/img")

def update_html_files():
    """Aktualisiert HTML-Dateien mit neuen Asset-Pfaden"""
    
    html_files = [
        'public/index.html',
        'public/gewerbeakte_generator.html',
        'public/personenpruefung_generator.html',
        'public/antrag_generator.html'
    ]
    
    print("\n📝 Aktualisiere HTML-Asset-Pfade...")
    
    for html_file in html_files:
        if os.path.exists(html_file):
            # Lese HTML-Datei
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Ersetze alte Pfade - da wir jetzt im public/ Ordner sind, bleiben die Pfade gleich
            # Nur ein Kommentar hinzufügen
            if '<!-- MIGRATED TO PUBLIC FOLDER -->' not in content:
                content = content.replace('<head>', '<head>\n    <!-- MIGRATED TO PUBLIC FOLDER -->')
                
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Updated: {html_file}")

def create_build_script():
    """Erstellt ein Build-Script für zukünftige Entwicklung"""
    
    build_script = '''#!/usr/bin/env python3
"""
Build Script für RDR2RP Gewerbeakten Generator
Kompiliert Assets und bereitet für Deployment vor.
"""

import os
import shutil
from pathlib import Path

def build():
    """Baut die Website für Production"""
    print("🏗️ Building RDR2RP Gewerbeakten Generator...")
    
    # Hier könnten zukünftig Build-Schritte hinzugefügt werden:
    # - SCSS zu CSS kompilieren
    # - JavaScript minifizieren
    # - Bilder optimieren
    # - etc.
    
    print("✅ Build completed!")
    print("📁 Deploy-ready files are in: ./public/")

if __name__ == "__main__":
    build()
'''
    
    with open('tools/build.py', 'w', encoding='utf-8') as f:
        f.write(build_script)
    
    # Make executable
    os.chmod('tools/build.py', 0o755)
    
    print("✅ Erstellt: tools/build.py")

def create_documentation():
    """Erstellt Dokumentationsdateien"""
    
    changelog_content = '''# Changelog

## Version 2.0.0 - Restructure
- ♻️ Komplette Umstrukturierung der Dateien
- 📁 Bessere Ordnerorganisation
- 🚀 Verbesserte Performance durch modulare Assets
- 🛠️ Einfachere Wartung und Entwicklung

## Version 1.5.1 - Previous
- Siehe vorherige README für Details
'''
    
    development_content = '''# Development Guide

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
'''
    
    with open('docs/CHANGELOG.md', 'w', encoding='utf-8') as f:
        f.write(changelog_content)
    
    with open('docs/DEVELOPMENT.md', 'w', encoding='utf-8') as f:
        f.write(development_content)
    
    print("✅ Erstellt: docs/CHANGELOG.md")
    print("✅ Erstellt: docs/DEVELOPMENT.md")

def create_backup():
    """Erstellt ein Backup der aktuellen Struktur"""
    if os.path.exists('backup'):
        shutil.rmtree('backup')
    
    os.makedirs('backup', exist_ok=True)
    
    # Copy assets
    if os.path.exists('assets'):
        shutil.copytree('assets', 'backup/assets')
    
    # Copy HTML files
    html_files = ['index.html', 'gewerbeakte_generator.html', 'personenpruefung_generator.html', 'antrag_generator.html']
    for file in html_files:
        if os.path.exists(file):
            shutil.copy2(file, f'backup/{file}')
    
    # Copy other important files
    for file in ['README.md', 'LICENSE']:
        if os.path.exists(file):
            shutil.copy2(file, f'backup/{file}')
    
    # Copy .github directory
    if os.path.exists('.github'):
        shutil.copytree('.github', 'backup/.github')
    
    print("💾 Backup erstellt in ./backup/")

def main():
    print("🚀 RDR2RP Gewerbeakten Generator - Migration")
    print("=" * 50)
    
    # Bestätigung
    response = input("Möchten Sie die Migration starten? (y/n): ")
    if response.lower() != 'y':
        print("❌ Migration abgebrochen")
        return
    
    try:
        # 1. Backup
        print("\n1. Erstelle Backup...")
        create_backup()
        
        # 2. Neue Struktur
        print("\n2. Erstelle neue Ordnerstruktur...")
        create_directory_structure()
        
        # 3. CSS Migration
        migrate_css_files()
        
        # 4. JS Migration
        migrate_js_files()
        
        # 5. HTML Migration
        print("\n📄 Migriere HTML-Dateien...")
        migrate_html_files()
        
        # 6. Asset Migration
        migrate_assets()
        
        # 7. Globale Module
        print("\n📦 Erstelle globale Module...")
        create_global_js_modules()
        
        # 8. HTML Updates
        update_html_files()
        
        # 9. Build Script
        print("\n🛠️ Erstelle Build-Tools...")
        create_build_script()
        
        # 10. Dokumentation
        print("\n📖 Erstelle Dokumentation...")
        create_documentation()
        
        print("\n✅ Migration abgeschlossen!")
        print("\n📁 Neue Struktur:")
        print("   public/          - Website-Dateien (wird deployed)")
        print("   src/             - Source-Code für Entwicklung")
        print("   tools/           - Build-Scripts und Tools") 
        print("   docs/            - Dokumentation")
        print("\nNächste Schritte:")
        print("1. GitHub Workflow wurde angepasst (deployed aus public/)")
        print("2. Testen: Öffne public/index.html im Browser")
        print("3. Doppelten Code aus CSS-Dateien entfernen")
        print("4. Alte Ordner löschen wenn alles funktioniert")
        print("5. Repository pushen für automatisches Deployment")
        
    except Exception as e:
        print(f"❌ Fehler bei Migration: {e}")
        print("💾 Backup ist verfügbar in ./backup/")

if __name__ == "__main__":
    main()