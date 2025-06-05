// ===================================
// UNIFIED REGISTER SCRIPT v2.0
// Kombination aus Register-Funktionalität und Detail-View
// EINE Datei für alles - keine Konflikte mehr!
// ===================================

class UnifiedRegisterPage {
    constructor() {
        this.version = "2.0-unified";
        this.apiBasePath = "./api.php";
        console.log(`📋 UnifiedRegisterPage v${this.version} initialized`);
        
        this.currentPage = 1;
        this.isLoading = false;
        this.searchTimeout = null;
        this.currentDetailAkte = null;
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupPage());
        } else {
            this.setupPage();
        }
    }

    setupPage() {
        if (!this.isRegisterPage()) {
            console.log("❌ Not on register page, skipping setup");
            return;
        }

        console.log("🎯 Setting up unified register page");
        
        // Register-Funktionalität
        this.loadGewerbeakten();
        this.loadStatistiken();
        this.setupSearch();
        
        // Detail-View-Funktionalität
        this.setupDetailView();
        
        // Globale Funktionen verfügbar machen
        this.setupGlobalFunctions();
        
        console.log("✅ Unified register page setup complete");
    }

    isRegisterPage() {
        return window.location.pathname.includes('register.html') || 
               document.getElementById('register-content') !== null ||
               document.querySelector('.register-container') !== null;
    }

    // ===================================
    // REGISTER-FUNKTIONALITÄT
    // ===================================

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) {
            console.warn("⚠️ Search input not found");
            return;
        }

        searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                if (e.target.value.length >= 2) {
                    this.searchGewerbeakten(e.target.value);
                } else if (e.target.value.length === 0) {
                    this.loadGewerbeakten();
                }
            }, 300);
        });
        
        console.log("🔍 Search functionality setup complete");
    }

    async loadGewerbeakten(page = 1) {
        if (this.isLoading) {
            console.log("⏳ Already loading, skipping request");
            return;
        }
        
        this.isLoading = true;
        this.currentPage = page;
        
        this.showLoading();
        
        try {
            const url = `${this.apiBasePath}/gewerbeakten?page=${page}&limit=20`;
            console.log("📡 Loading Gewerbeakten from:", url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log("📊 Gewerbeakten response:", data);
            
            if (data.success) {
                this.displayGewerbeakten(data.data);
                this.updatePagination(data.pagination);
            } else {
                this.showError('Fehler beim Laden der Gewerbeakten: ' + data.error);
            }
        } catch (error) {
            console.error('❌ Load error:', error);
            this.showError('Verbindungsfehler beim Laden der Daten: ' + error.message);
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    async searchGewerbeakten(searchTerm) {
        if (this.isLoading) {
            console.log("⏳ Already loading, skipping search");
            return;
        }
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            const url = `${this.apiBasePath}/search?q=${encodeURIComponent(searchTerm)}`;
            console.log("🔍 Searching:", url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log("🔍 Search response:", data);
            
            if (data.success) {
                this.displayGewerbeakten(data.data);
                this.hidePagination();
            } else {
                this.showError('Suchfehler: ' + data.error);
            }
        } catch (error) {
            console.error('❌ Search error:', error);
            this.showError('Fehler bei der Suche: ' + error.message);
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    async loadStatistiken() {
        try {
            const url = `${this.apiBasePath}/statistiken`;
            console.log("📊 Loading Statistics from:", url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log("📊 Statistics response:", data);
            
            if (data.success) {
                this.updateStatistiken(data.data);
            } else {
                console.warn("📊 Stats load failed:", data.error);
            }
        } catch (error) {
            console.error('📊 Stats error:', error);
        }
    }

    displayGewerbeakten(akten) {
        const container = document.getElementById('register-content');
        if (!container) {
            console.error("❌ Register content container not found");
            return;
        }
        
        if (!akten || akten.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa fa-search"></i>
                    <h3>Keine Gewerbeakten gefunden</h3>
                    <p>Es wurden keine Gewerbeakten gefunden, die Ihren Suchkriterien entsprechen.</p>
                    <a href="gewerbeakte_generator.html" class="btn" style="margin-top: 1rem;">
                        <i class="fa fa-plus"></i> Erste Akte erstellen
                    </a>
                </div>
            `;
            console.log("📋 Displayed empty state");
            return;
        }
        
        const rows = akten.map(akte => `
            <div class="table-row">
                <div class="lizenznummer">${this.escapeHtml(akte.lizenznummer || '')}</div>
                <div>${this.escapeHtml(akte.stadt || '')}</div>
                <div>${this.escapeHtml(akte.betrieb || '')}</div>
                <div class="mitarbeiter-info">${this.formatMitarbeiterListe(akte.mitarbeiter_liste)}</div>
                <div>${this.formatDate(akte.erstellt_am)}</div>
                <div class="actions">
                    <button class="btn btn-small btn-info" onclick="unifiedRegister.viewAkte(${akte.id})">
                        <i class="fa fa-eye"></i> Details
                    </button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = rows;
        console.log(`📋 Displayed ${akten.length} Gewerbeakten`);
    }

    updateStatistiken(stats) {
        const updateStat = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value || 0;
            }
        };

        updateStat('total-akten', stats.gewerbeakten_total);
        updateStat('new-this-week', stats.neue_diese_woche);
        updateStat('total-cities', stats.nach_stadt ? stats.nach_stadt.length : 0);
        updateStat('total-businesses', stats.top_betriebe ? stats.top_betriebe.length : 0);
        
        console.log("📊 Statistics updated:", stats);
    }

    updatePagination(pagination) {
        if (!pagination) {
            console.warn("⚠️ No pagination data received");
            return;
        }
        
        const paginationEl = document.getElementById('pagination');
        const pageInfo = document.getElementById('page-info');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (pageInfo) pageInfo.textContent = `Seite ${pagination.page}`;
        if (prevBtn) prevBtn.disabled = pagination.page <= 1;
        if (paginationEl) paginationEl.style.display = 'block';
        
        console.log("📄 Pagination updated:", pagination);
    }

    changePage(direction) {
        const newPage = this.currentPage + direction;
        if (newPage >= 1) {
            console.log(`📄 Changing to page ${newPage}`);
            this.loadGewerbeakten(newPage);
        }
    }

    // ===================================
    // DETAIL-VIEW-FUNKTIONALITÄT
    // ===================================

    setupDetailView() {
        // Keyboard Event Handler für Modal
        document.addEventListener('keydown', (event) => {
            const modal = document.getElementById('detail-modal-overlay');
            if (modal && modal.classList.contains('show')) {
                if (event.key === 'Escape') {
                    this.closeDetailModal();
                } else if (event.key === 'p' && (event.ctrlKey || event.metaKey)) {
                    event.preventDefault();
                    this.printDetailView();
                } else if (event.key === 'c' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
                    event.preventDefault();
                    this.copyDetailToClipboard();
                }
            }
        });

        console.log("👁️ Detail view setup complete");
    }

    async viewAkte(akteId) {
        console.log(`👁️ Opening detail view for Akte ID: ${akteId}`);
        
        // Modal anzeigen
        const modal = document.getElementById('detail-modal-overlay');
        if (!modal) {
            console.error("❌ Detail modal not found in DOM");
            if (typeof Toast !== 'undefined') {
                Toast.error('Fehler', 'Detail-Modal nicht gefunden. Bitte laden Sie die Seite neu.');
            }
            return;
        }
        
        modal.classList.add('show');
        this.showDetailLoading();
        
        try {
            const response = await fetch(`${this.apiBasePath}/gewerbeakten/${akteId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.success && result.data) {
                this.currentDetailAkte = result.data;
                this.displayDetailView(result.data);
            } else {
                throw new Error(result.error || 'Unbekannter Fehler beim Laden der Details');
            }
            
        } catch (error) {
            console.error('❌ Error loading detail view:', error);
            this.showDetailError(error.message);
        }
    }

    showDetailLoading() {
        const loading = document.getElementById('detail-loading');
        const content = document.getElementById('detail-content');
        const error = document.getElementById('detail-error');
        
        if (loading) loading.style.display = 'block';
        if (content) content.style.display = 'none';
        if (error) error.style.display = 'none';
        
        const title = document.getElementById('detail-modal-title');
        if (title) title.textContent = 'Lade Gewerbeakte...';
    }

    showDetailError(errorMessage) {
        const loading = document.getElementById('detail-loading');
        const content = document.getElementById('detail-content');
        const error = document.getElementById('detail-error');
        const errorMsg = document.getElementById('detail-error-message');
        
        if (loading) loading.style.display = 'none';
        if (content) content.style.display = 'none';
        if (error) error.style.display = 'block';
        if (errorMsg) errorMsg.textContent = errorMessage;
        
        const title = document.getElementById('detail-modal-title');
        if (title) title.textContent = 'Fehler beim Laden';
    }

    displayDetailView(akte) {
        console.log('📄 Displaying detail view for:', akte);
        
        const loading = document.getElementById('detail-loading');
        const content = document.getElementById('detail-content');
        const error = document.getElementById('detail-error');
        
        if (loading) loading.style.display = 'none';
        if (content) content.style.display = 'block';
        if (error) error.style.display = 'none';
        
        const title = document.getElementById('detail-modal-title');
        if (title) title.textContent = `Gewerbeakte: ${akte.lizenznummer}`;
        
        // Grundinformationen füllen
        this.setDetailValue('detail-lizenznummer', akte.lizenznummer);
        this.setDetailValue('detail-stadt', akte.stadt);
        this.setDetailValue('detail-betrieb', akte.betrieb);
        this.setDetailValue('detail-datum', this.formatDate(akte.ausgestellt_am));
        this.setDetailValue('detail-anzahl', akte.anzahl_lizenzen);
        this.setDetailValue('detail-erstellt', this.formatDateTime(akte.erstellt_am));
        
        // Mitarbeiter anzeigen
        this.displayMitarbeiter(akte.mitarbeiter || []);
        
        // Optionale Felder anzeigen/verstecken
        this.handleOptionalField('detail-vermerk-section', 'detail-vermerk-link', 'detail-vermerk-text', akte.vermerk);
        this.handleOptionalField('detail-sonder-section', 'detail-sondergenehmigung', null, akte.sondergenehmigung);
        this.handleOptionalField('detail-sonstiges-section', 'detail-sonstiges', null, akte.sonstiges);
        
        console.log('✅ Detail view displayed successfully');
    }

    setDetailValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value || '-';
        }
    }

    handleOptionalField(sectionId, contentId, linkTextId, value) {
        const section = document.getElementById(sectionId);
        const content = document.getElementById(contentId);
        
        if (!section || !content) return;
        
        if (value && value.trim() && value !== '---') {
            section.style.display = 'block';
            
            if (sectionId === 'detail-vermerk-section' && value.startsWith('http')) {
                content.href = value;
                if (linkTextId) {
                    const linkText = document.getElementById(linkTextId);
                    if (linkText) linkText.textContent = 'Gewerbeantrag öffnen';
                }
            } else {
                content.textContent = value;
            }
        } else {
            section.style.display = 'none';
        }
    }

    displayMitarbeiter(mitarbeiter) {
        const container = document.getElementById('detail-mitarbeiter');
        if (!container) return;
        
        if (!mitarbeiter || mitarbeiter.length === 0) {
            container.innerHTML = `
                <div class="detail-text-content">
                    <p>Keine Mitarbeiter-Daten verfügbar</p>
                </div>
            `;
            return;
        }
        
        const mitarbeiterCards = mitarbeiter.map(person => {
            const iconClass = person.rolle === 'Inhaber' ? 'fa-crown' : 'fa-user-tie';
            
            return `
                <div class="detail-mitarbeiter-card">
                    <div class="detail-mitarbeiter-icon">
                        <i class="fa ${iconClass}"></i>
                    </div>
                    <div class="detail-mitarbeiter-info">
                        <div class="detail-mitarbeiter-name">${this.escapeHtml(person.vorname)} ${this.escapeHtml(person.nachname)}</div>
                        <div class="detail-mitarbeiter-rolle">${this.escapeHtml(person.rolle)}</div>
                    </div>
                    <div class="detail-mitarbeiter-telegram">${this.escapeHtml(person.telegram)}</div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = mitarbeiterCards;
        
        console.log(`👥 Displayed ${mitarbeiter.length} Mitarbeiter in detail view`);
    }

    closeDetailModal() {
        const modal = document.getElementById('detail-modal-overlay');
        if (modal) {
            modal.classList.remove('show');
            this.currentDetailAkte = null;
            console.log('❌ Detail modal closed');
        }
    }

    printDetailView() {
        if (!this.currentDetailAkte) {
            console.warn('⚠️ No current akte to print');
            return;
        }
        
        console.log('🖨️ Printing detail view');
        window.print();
    }

    async copyDetailToClipboard() {
        if (!this.currentDetailAkte) {
            console.warn('⚠️ No current akte to copy');
            return;
        }
        
        console.log('📋 Copying detail view to clipboard');
        
        const text = this.formatAkteForClipboard(this.currentDetailAkte);
        
        try {
            await navigator.clipboard.writeText(text);
            
            if (typeof Toast !== 'undefined') {
                Toast.success('✅ Kopiert!', 'Gewerbeakte-Details wurden in die Zwischenablage kopiert.');
            } else {
                alert('Details wurden in die Zwischenablage kopiert!');
            }
            
        } catch (error) {
            console.error('❌ Copy failed:', error);
            
            if (typeof Toast !== 'undefined') {
                Toast.error('❌ Kopieren fehlgeschlagen', 'Die Details konnten nicht kopiert werden.');
            } else {
                alert('Kopieren fehlgeschlagen!');
            }
        }
    }

    formatAkteForClipboard(akte) {
        let text = `=== GEWERBEAKTE DETAILS ===\n\n`;
        
        text += `Lizenznummer: ${akte.lizenznummer}\n`;
        text += `Stadt: ${akte.stadt}\n`;
        text += `Betrieb: ${akte.betrieb}\n`;
        text += `Ausgestellt am: ${this.formatDate(akte.ausgestellt_am)}\n`;
        text += `Anzahl Lizenzen: ${akte.anzahl_lizenzen}\n`;
        text += `Erstellt am: ${this.formatDateTime(akte.erstellt_am)}\n\n`;
        
        if (akte.mitarbeiter && akte.mitarbeiter.length > 0) {
            text += `=== MITARBEITER ===\n`;
            akte.mitarbeiter.forEach(person => {
                text += `${person.rolle}: ${person.vorname} ${person.nachname} (${person.telegram})\n`;
            });
            text += `\n`;
        }
        
        if (akte.vermerk && akte.vermerk !== '---') {
            text += `=== VERMERK ===\n${akte.vermerk}\n\n`;
        }
        
        if (akte.sondergenehmigung && akte.sondergenehmigung !== '---') {
            text += `=== SONDERGENEHMIGUNG ===\n${akte.sondergenehmigung}\n\n`;
        }
        
        if (akte.sonstiges && akte.sonstiges !== '---') {
            text += `=== SONSTIGES ===\n${akte.sonstiges}\n\n`;
        }
        
        return text;
    }

    // ===================================
    // UTILITY FUNCTIONS
    // ===================================

    formatMitarbeiterListe(mitarbeiterListe) {
        if (!mitarbeiterListe) return '-';
        
        try {
            const mitarbeiter = mitarbeiterListe.split('\n');
            const inhaber = mitarbeiter.find(m => m.includes('Inhaber:'));
            
            if (inhaber) {
                const name = inhaber.replace('Inhaber: ', '').split(' (')[0];
                const stellvertreterCount = mitarbeiter.length - 1;
                
                if (stellvertreterCount > 0) {
                    return `${this.escapeHtml(name)} (+${stellvertreterCount} Stellv.)`;
                }
                return this.escapeHtml(name);
            }
            
            return this.escapeHtml(mitarbeiterListe.substring(0, 30) + '...');
        } catch (e) {
            console.warn("⚠️ Error formatting Mitarbeiter liste:", e);
            return this.escapeHtml(mitarbeiterListe.substring(0, 30) + '...');
        }
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('de-DE');
        } catch (e) {
            return dateString;
        }
    }

    formatDateTime(dateString) {
        if (!dateString) return '-';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleString('de-DE');
        } catch (e) {
            return dateString;
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // UI State Management
    showLoading() {
        const loadingEl = document.getElementById('loading-state');
        if (loadingEl) {
            loadingEl.style.display = 'block';
            console.log("⏳ Loading state shown");
        }
    }

    hideLoading() {
        const loadingEl = document.getElementById('loading-state');
        if (loadingEl) {
            loadingEl.style.display = 'none';
            console.log("✅ Loading state hidden");
        }
    }

    hidePagination() {
        const paginationEl = document.getElementById('pagination');
        if (paginationEl) {
            paginationEl.style.display = 'none';
            console.log("📄 Pagination hidden");
        }
    }

    showError(message) {
        console.error("❌ Error:", message);
        
        if (typeof Toast !== 'undefined') {
            Toast.error('Fehler', message);
        } else {
            alert('Fehler: ' + message);
        }
    }

    setupGlobalFunctions() {
        // Globale Funktionen für onclick-Handler verfügbar machen
        window.loadGewerbeakten = (page) => this.loadGewerbeakten(page);
        window.changePage = (direction) => this.changePage(direction);
        window.viewAkte = (id) => this.viewAkte(id);
        window.closeDetailModal = () => this.closeDetailModal();
        window.printDetailView = () => this.printDetailView();
        window.copyDetailToClipboard = () => this.copyDetailToClipboard();
        
        console.log("🌐 Global functions registered");
    }
}

// === AUTO-INITIALIZATION ===

if (typeof window !== 'undefined') {
    window.UnifiedRegisterPage = UnifiedRegisterPage;
    
    // Global instance erstellen (nur auf Register-Seite)
    const shouldInit = window.location.pathname.includes('register.html') || 
                      document.getElementById('register-content') !== null ||
                      document.querySelector('.register-container') !== null;
    
    if (shouldInit) {
        window.unifiedRegister = new UnifiedRegisterPage();
        console.log('📋 UnifiedRegisterPage instance created');
    } else {
        console.log('📋 Unified register script loaded but not initialized (wrong page)');
    }
}

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UnifiedRegisterPage };
}