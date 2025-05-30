name: 🔄 Pull Request - 🇩🇪
description: Contribute changes to the RDR2RP Business License Generator
title: "[PR]: "
labels: ["needs-review"]
body:
  - type: markdown
    attributes:
      value: |
        Vielen Dank für deinen Beitrag zum RDR2RP Business License Generator!
        
        Bitte fülle das Formular vollständig aus, damit wir deinen Pull Request effizient reviewen können.

  - type: checkboxes
    id: terms
    attributes:
      label: Vor dem Einreichen
      description: Bitte bestätige folgende Punkte
      options:
        - label: Ich habe die neueste Version der main branch gemerged
          required: true
        - label: Ich habe meine Änderungen lokal getestet
          required: true
        - label: Ich habe die bestehenden Funktionen nicht beeinträchtigt
          required: true
        - label: Mein Code folgt den bestehenden Konventionen
          required: true

  - type: textarea
    id: description
    attributes:
      label: Beschreibung der Änderungen
      description: Was wurde geändert und warum?
      placeholder: |
        Beispiel: Verbesserte Validierung für URL-Eingaben im Gewerbeakten-Generator.
        Behebt Issue #123 - URLs werden jetzt korrekt validiert und Benutzer erhalten
        besseres Feedback bei ungültigen Eingaben.
    validations:
      required: true

  - type: dropdown
    id: change-type
    attributes:
      label: Art der Änderung
      description: Welche Art von Änderung ist das?
      options:
        - Bug Fix (behebt ein Problem)
        - New Feature (fügt neue Funktionalität hinzu)
        - Enhancement (verbessert bestehende Funktionalität)
        - UI/UX Improvement (Design/Benutzerfreundlichkeit)
        - Performance Optimization (Geschwindigkeitsverbesserung)
        - Code Refactoring (Code-Struktur ohne Funktionsänderung)
        - Documentation (README, Kommentare, etc.)
        - Build/CI (GitHub Actions, Build-Prozess)
        - Security (Sicherheitsverbesserung)
    validations:
      required: true

  - type: dropdown
    id: affected-components
    attributes:
      label: Betroffene Komponenten
      description: Welche Teile der Anwendung sind betroffen?
      options:
        - Gewerbeakten-Generator
        - Personenprüfungs-System
        - Antrags-Bearbeitung
        - Import-Funktionalität
        - Navigation/Layout
        - Globale Komponenten (utils.js, CSS)
        - Documentation
        - Build/Deployment
      multiple: true
    validations:
      required: true

  - type: checkboxes
    id: testing
    attributes:
      label: Testing Checklist
      description: Welche Tests wurden durchgeführt?
      options:
        - label: Alle Generatoren funktionieren korrekt
          required: false
        - label: Import-Funktionalität getestet
          required: false
        - label: Copy-to-Clipboard funktioniert
          required: false
        - label: Responsive Design auf mobilen Geräten geprüft
          required: false
        - label: Cross-Browser Kompatibilität getestet (Chrome, Firefox, Safari)
          required: false
        - label: Form-Validierung funktioniert ordnungsgemäß
          required: false
        - label: Alle Links und Navigation funktionieren
          required: false

  - type: checkboxes
    id: rdr2rp-compliance
    attributes:
      label: RDR2RP-Spezifische Überprüfung
      description: RDR2RP-Authentizität und Funktionalität
      options:
        - label: Discord-Formatierung bleibt erhalten
          required: false
        - label: Datumsformat (1899) ist korrekt
          required: false
        - label: Stadt-Betrieb-Zuordnungen sind akkurat
          required: false
        - label: Lizenznummer-Format ist korrekt
          required: false
        - label: Westliche Terminologie und Stil beibehalten
          required: false

  - type: textarea
    id: breaking-changes
    attributes:
      label: Breaking Changes
      description: Gibt es Änderungen, die bestehende Funktionalität beeinträchtigen?
      placeholder: |
        Wenn ja, beschreibe:
        - Was sich ändert
        - Wie es Benutzer betrifft  
        - Migration/Workaround-Schritte
        
        Wenn nein, schreibe "Keine Breaking Changes"

  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots/Videos (optional)
      description: Visuelle Änderungen oder neue Features
      placeholder: |
        Füge Screenshots oder GIFs hinzu um visuelle Änderungen zu zeigen.
        Du kannst Bilder einfach per Drag & Drop hier einfügen.

  - type: textarea
    id: additional-context
    attributes:
      label: Zusätzlicher Kontext
      description: Weitere relevante Informationen
      placeholder: |
        - Verwandte Issues
        - Design-Entscheidungen
        - Bekannte Limitationen
        - Zukünftige Verbesserungen

  - type: dropdown
    id: urgency
    attributes:
      label: Dringlichkeit
      description: Wie dringend ist dieser Pull Request?
      options:
        - Low (kann warten)
        - Medium (sollte zeitnah gemerged werden)
        - High (wichtige Verbesserung)
        - Critical (behebt kritischen Bug)
    validations:
      required: true

  - type: markdown
    attributes:
      value: |
        ---
        
        **🎯 Review Guidelines:**
        - Code wird auf Funktionalität, Stil und RDR2RP-Kompatibilität geprüft
        - Alle Tests müssen erfolgreich sein
        - Breaking Changes erfordern zusätzliche Dokumentation
        
        **🤝 Vielen Dank für deinen Beitrag zur RDR2RP-Community!**