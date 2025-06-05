<?php
/**
 * SQLite Database Setup für Gewerberegister
 * Erstellt die Datenbank und Tabellen automatisch
 */

class GewerberegisterDB {
    private $db;
    private $dbPath;

    public function __construct($dbPath = 'data/gewerberegister.db') {
        $this->dbPath = $dbPath;
        $this->initDatabase();
    }

    private function initDatabase() {
        try {
            // Erstelle data Ordner falls nicht vorhanden
            $dataDir = dirname($this->dbPath);
            if (!is_dir($dataDir)) {
                mkdir($dataDir, 0755, true);
            }

            // Verbindung zur SQLite Datenbank
            $this->db = new PDO('sqlite:' . $this->dbPath);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Erstelle Tabellen falls sie nicht existieren
            $this->createTables();
            
        } catch (PDOException $e) {
            error_log("Database Error: " . $e->getMessage());
            throw new Exception("Datenbankfehler: " . $e->getMessage());
        }
    }

    private function createTables() {
        // Gewerbeakten Tabelle
        $sql = "CREATE TABLE IF NOT EXISTS gewerbeakten (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lizenznummer VARCHAR(50) UNIQUE NOT NULL,
            vermerk TEXT,
            stadt VARCHAR(10) NOT NULL,
            betrieb VARCHAR(100) NOT NULL,
            ausgestellt_am DATE NOT NULL,
            anzahl_lizenzen INTEGER DEFAULT 1,
            sondergenehmigung TEXT,
            sonstiges TEXT,
            erstellt_am DATETIME DEFAULT CURRENT_TIMESTAMP,
            aktualisiert_am DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        $this->db->exec($sql);

        // Mitarbeiter Tabelle
        $sql = "CREATE TABLE IF NOT EXISTS mitarbeiter (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gewerbeakte_id INTEGER NOT NULL,
            rolle VARCHAR(20) NOT NULL, -- 'Inhaber', '1. Stellvertretung', '2. Stellvertretung'
            vorname VARCHAR(50) NOT NULL,
            nachname VARCHAR(50) NOT NULL,
            telegram VARCHAR(50) NOT NULL,
            FOREIGN KEY (gewerbeakte_id) REFERENCES gewerbeakten(id) ON DELETE CASCADE
        )";
        $this->db->exec($sql);

        // Personenprüfungen Tabelle
        $sql = "CREATE TABLE IF NOT EXISTS personenpruefungen (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            person VARCHAR(100) NOT NULL,
            telegram VARCHAR(50) NOT NULL,
            pruefer VARCHAR(100),
            geprueft_am DATE,
            ergebnis VARCHAR(20) NOT NULL, -- 'bestanden', 'nicht-bestanden', 'ausstehend'
            details TEXT,
            erstellt_am DATETIME DEFAULT CURRENT_TIMESTAMP,
            aktualisiert_am DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        $this->db->exec($sql);

        // Anträge Tabelle
        $sql = "CREATE TABLE IF NOT EXISTS antraege (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            typ VARCHAR(30) NOT NULL, -- 'gewerbeantrag', 'gewerbeauslage', 'gewerbekutsche', 'gewerbetelegramm'
            antragsteller VARCHAR(100) NOT NULL,
            gewerbe VARCHAR(100),
            telegram VARCHAR(50) NOT NULL,
            status VARCHAR(20) DEFAULT 'offen', -- 'offen', 'bearbeitet', 'genehmigt', 'abgelehnt'
            daten TEXT, -- JSON für spezifische Daten je Antragstyp
            bearbeiter VARCHAR(100),
            erstellt_am DATETIME DEFAULT CURRENT_TIMESTAMP,
            aktualisiert_am DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        $this->db->exec($sql);

        // Aktivitätslog Tabelle
        $sql = "CREATE TABLE IF NOT EXISTS aktivitaetslog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            aktion VARCHAR(50) NOT NULL,
            tabelle VARCHAR(30) NOT NULL,
            datensatz_id INTEGER NOT NULL,
            benutzer VARCHAR(100),
            beschreibung TEXT,
            zeitstempel DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        $this->db->exec($sql);

        // Indizes für bessere Performance
        $this->db->exec("CREATE INDEX IF NOT EXISTS idx_lizenznummer ON gewerbeakten(lizenznummer)");
        $this->db->exec("CREATE INDEX IF NOT EXISTS idx_stadt_betrieb ON gewerbeakten(stadt, betrieb)");
        $this->db->exec("CREATE INDEX IF NOT EXISTS idx_mitarbeiter_akte ON mitarbeiter(gewerbeakte_id)");
        $this->db->exec("CREATE INDEX IF NOT EXISTS idx_antraege_typ_status ON antraege(typ, status)");
    }

    public function getConnection() {
        return $this->db;
    }

    // === GEWERBEAKTEN FUNKTIONEN ===

    public function createGewerbeakte($data) {
        try {
            $this->db->beginTransaction();

            // Gewerbeakte einfügen
            $sql = "INSERT INTO gewerbeakten 
                    (lizenznummer, vermerk, stadt, betrieb, ausgestellt_am, anzahl_lizenzen, sondergenehmigung, sonstiges) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                $data['lizenznummer'],
                $data['vermerk'],
                $data['stadt'],
                $data['betrieb'],
                $data['ausgestellt_am'],
                $data['anzahl_lizenzen'],
                $data['sondergenehmigung'],
                $data['sonstiges']
            ]);

            $gewerbeakteId = $this->db->lastInsertId();

            // Mitarbeiter einfügen
            foreach ($data['mitarbeiter'] as $mitarbeiter) {
                $this->addMitarbeiter($gewerbeakteId, $mitarbeiter);
            }

            // Log erstellen
            $this->logActivity('CREATE', 'gewerbeakten', $gewerbeakteId, 
                              null, "Neue Gewerbeakte erstellt: {$data['lizenznummer']}");

            $this->db->commit();
            return $gewerbeakteId;

        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function getAllGewerbeakten($limit = 100, $offset = 0) {
        $sql = "SELECT g.*, 
                       GROUP_CONCAT(
                           m.rolle || ': ' || m.vorname || ' ' || m.nachname || ' (' || m.telegram || ')',
                           '\n'
                       ) as mitarbeiter_liste
                FROM gewerbeakten g
                LEFT JOIN mitarbeiter m ON g.id = m.gewerbeakte_id
                GROUP BY g.id
                ORDER BY g.erstellt_am DESC
                LIMIT ? OFFSET ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$limit, $offset]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getGewerbeakteById($id) {
        $sql = "SELECT * FROM gewerbeakten WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $akte = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($akte) {
            $akte['mitarbeiter'] = $this->getMitarbeiterByAkteId($id);
        }

        return $akte;
    }

    public function searchGewerbeakten($searchTerm) {
        $sql = "SELECT g.*, 
                       GROUP_CONCAT(
                           m.rolle || ': ' || m.vorname || ' ' || m.nachname || ' (' || m.telegram || ')',
                           '\n'
                       ) as mitarbeiter_liste
                FROM gewerbeakten g
                LEFT JOIN mitarbeiter m ON g.id = m.gewerbeakte_id
                WHERE g.lizenznummer LIKE ? 
                   OR g.betrieb LIKE ? 
                   OR g.stadt LIKE ?
                   OR m.vorname LIKE ?
                   OR m.nachname LIKE ?
                GROUP BY g.id
                ORDER BY g.erstellt_am DESC";
        
        $searchPattern = '%' . $searchTerm . '%';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$searchPattern, $searchPattern, $searchPattern, $searchPattern, $searchPattern]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // === MITARBEITER FUNKTIONEN ===

    private function addMitarbeiter($gewerbeakteId, $mitarbeiter) {
        $sql = "INSERT INTO mitarbeiter (gewerbeakte_id, rolle, vorname, nachname, telegram) 
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            $gewerbeakteId,
            $mitarbeiter['rolle'],
            $mitarbeiter['vorname'],
            $mitarbeiter['nachname'],
            $mitarbeiter['telegram']
        ]);
    }

    private function getMitarbeiterByAkteId($gewerbeakteId) {
        $sql = "SELECT * FROM mitarbeiter WHERE gewerbeakte_id = ? ORDER BY 
                CASE rolle 
                    WHEN 'Inhaber' THEN 1 
                    WHEN '1. Stellvertretung' THEN 2 
                    WHEN '2. Stellvertretung' THEN 3 
                    ELSE 4 
                END";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$gewerbeakteId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // === STATISTIKEN ===

    public function getStatistiken() {
        $stats = [];

        // Anzahl Gewerbeakten
        $sql = "SELECT COUNT(*) as anzahl FROM gewerbeakten";
        $stats['gewerbeakten_total'] = $this->db->query($sql)->fetchColumn();

        // Akten nach Stadt
        $sql = "SELECT stadt, COUNT(*) as anzahl FROM gewerbeakten GROUP BY stadt ORDER BY anzahl DESC";
        $stats['nach_stadt'] = $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);

        // Akten nach Betrieb
        $sql = "SELECT betrieb, COUNT(*) as anzahl FROM gewerbeakten GROUP BY betrieb ORDER BY anzahl DESC LIMIT 10";
        $stats['top_betriebe'] = $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);

        // Neue Akten diese Woche
        $sql = "SELECT COUNT(*) as anzahl FROM gewerbeakten WHERE erstellt_am >= date('now', '-7 days')";
        $stats['neue_diese_woche'] = $this->db->query($sql)->fetchColumn();

        return $stats;
    }

    // === LOGGING ===

    private function logActivity($aktion, $tabelle, $datensatzId, $benutzer = null, $beschreibung = '') {
        $sql = "INSERT INTO aktivitaetslog (aktion, tabelle, datensatz_id, benutzer, beschreibung) 
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$aktion, $tabelle, $datensatzId, $benutzer, $beschreibung]);
    }

    public function getRecentActivity($limit = 20) {
        $sql = "SELECT * FROM aktivitaetslog ORDER BY zeitstempel DESC LIMIT ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$limit]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // === BACKUP & MAINTENANCE ===

    public function createBackup($backupPath = null) {
        if (!$backupPath) {
            $backupPath = 'backups/gewerberegister_' . date('Y-m-d_H-i-s') . '.db';
        }

        $backupDir = dirname($backupPath);
        if (!is_dir($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        return copy($this->dbPath, $backupPath);
    }

    public function getDatabaseSize() {
        return filesize($this->dbPath);
    }

    public function vacuum() {
        return $this->db->exec("VACUUM");
    }
}
?>