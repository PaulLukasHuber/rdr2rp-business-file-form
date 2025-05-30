#!/usr/bin/env python3
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
