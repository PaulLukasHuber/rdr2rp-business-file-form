<?php
/**
 * API Endpoints für das Gewerberegister
 * Stellt REST-ähnliche Endpunkte für CRUD-Operationen bereit
 * Version 1.1 - Mit Detail-View Support
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'database.php';

class GewerberegisterAPI {
    private $db;

    public function __construct() {
        try {
            $this->db = new GewerberegisterDB();
        } catch (Exception $e) {
            $this->sendError(500, 'Datenbankfehler: ' . $e->getMessage());
            exit;
        }
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', trim($path, '/'));
        
        // Entferne 'api.php' falls im Pfad enthalten
        $apiIndex = array_search('api.php', $pathParts);
        if ($apiIndex !== false) {
            $pathParts = array_slice($pathParts, $apiIndex + 1);
        }
        
        // Bestimme Endpoint und ID
        $endpoint = $pathParts[0] ?? '';
        $id = $pathParts[1] ?? null;

        try {
            switch ($endpoint) {
                case 'gewerbeakten':
                    $this->handleGewerbeakten($method, $id);
                    break;
                
                case 'search':
                    $this->handleSearch($method);
                    break;
                
                case 'statistiken':
                    $this->handleStatistiken($method);
                    break;
                
                case 'activity':
                    $this->handleActivity($method);
                    break;

                case 'save-akte':
                    $this->handleSaveAkte($method);
                    break;
                
                default:
                    $this->sendError(404, 'Endpoint nicht gefunden');
            }
        } catch (Exception $e) {
            error_log("API Error: " . $e->getMessage());
            $this->sendError(500, 'Serverfehler: ' . $e->getMessage());
        }
    }

    // === GEWERBEAKTEN ENDPOINTS ===

    private function handleGewerbeakten($method, $id = null) {
        switch ($method) {
            case 'GET':
                if ($id) {
                    $this->getGewerbeakte($id);
                } else {
                    $this->getAllGewerbeakten();
                }
                break;
            
            case 'POST':
                $this->createGewerbeakte();
                break;
            
            default:
                $this->sendError(405, 'Methode nicht erlaubt');
        }
    }

    private function getAllGewerbeakten() {
        $page = intval($_GET['page'] ?? 1);
        $limit = intval($_GET['limit'] ?? 50);
        $offset = ($page - 1) * $limit;

        $akten = $this->db->getAllGewerbeakten($limit, $offset);
        
        $this->sendSuccess([
            'data' => $akten,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'offset' => $offset
            ]
        ]);
    }

    private function getGewerbeakte($id) {
        // Validierung der ID
        if (!is_numeric($id) || $id <= 0) {
            $this->sendError(400, 'Ungültige Akte-ID');
            return;
        }

        try {
            // Hole Gewerbeakte mit Mitarbeiter-Details
            $akte = $this->getGewerbeakteWithDetails($id);
            
            if (!$akte) {
                $this->sendError(404, 'Gewerbeakte nicht gefunden');
                return;
            }
            
            $this->sendSuccess(['data' => $akte]);
            
        } catch (Exception $e) {
            error_log("Error getting Gewerbeakte ID $id: " . $e->getMessage());
            $this->sendError(500, 'Fehler beim Laden der Gewerbeakte: ' . $e->getMessage());
        }
    }

    private function getGewerbeakteWithDetails($id) {
        $db = $this->db->getConnection();
        
        // Hole Gewerbeakte-Grunddaten
        $sql = "SELECT * FROM gewerbeakten WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);
        $akte = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$akte) {
            return null;
        }
        
        // Hole Mitarbeiter-Details
        $sql = "SELECT * FROM mitarbeiter 
                WHERE gewerbeakte_id = ? 
                ORDER BY 
                    CASE rolle 
                        WHEN 'Inhaber' THEN 1 
                        WHEN '1. Stellvertretung' THEN 2 
                        WHEN '2. Stellvertretung' THEN 3 
                        ELSE 4 
                    END";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);
        $mitarbeiter = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Füge Mitarbeiter zur Akte hinzu
        $akte['mitarbeiter'] = $mitarbeiter;
        
        return $akte;
    }

    private function createGewerbeakte() {
        $input = $this->getJsonInput();
        
        if (!$input) {
            $this->sendError(400, 'Ungültige JSON-Daten');
            return;
        }

        // Validierung
        $required = ['lizenznummer', 'stadt', 'betrieb', 'ausgestellt_am', 'mitarbeiter'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                $this->sendError(400, "Feld '$field' ist erforderlich");
                return;
            }
        }

        // Prüfen ob Lizenznummer bereits existiert
        if ($this->lizenznummerExists($input['lizenznummer'])) {
            $this->sendError(409, 'Lizenznummer bereits vorhanden');
            return;
        }

        try {
            $id = $this->db->createGewerbeakte($input);
            $this->sendSuccess([
                'message' => 'Gewerbeakte erfolgreich erstellt',
                'id' => $id
            ], 201);
        } catch (Exception $e) {
            $this->sendError(500, 'Fehler beim Erstellen der Gewerbeakte: ' . $e->getMessage());
        }
    }

    // === SAVE AKTE ENDPOINT (für JavaScript Integration) ===

    private function handleSaveAkte($method) {
        if ($method !== 'POST') {
            $this->sendError(405, 'Nur POST erlaubt');
            return;
        }

        $input = $this->getJsonInput();
        
        if (!$input) {
            $this->sendError(400, 'Ungültige JSON-Daten');
            return;
        }

        // Daten aus dem Frontend-Format konvertieren
        $gewerbeakteData = $this->convertFrontendData($input);
        
        if (!$gewerbeakteData) {
            $this->sendError(400, 'Ungültige Aktendaten');
            return;
        }

        try {
            $id = $this->db->createGewerbeakte($gewerbeakteData);
            $this->sendSuccess([
                'message' => 'Gewerbeakte erfolgreich im Register gespeichert',
                'id' => $id,
                'lizenznummer' => $gewerbeakteData['lizenznummer']
            ], 201);
        } catch (Exception $e) {
            if (strpos($e->getMessage(), 'UNIQUE constraint failed') !== false) {
                $this->sendError(409, 'Diese Lizenznummer ist bereits im Register vorhanden');
            } else {
                $this->sendError(500, 'Fehler beim Speichern: ' . $e->getMessage());
            }
        }
    }

    // === SEARCH ENDPOINT ===

    private function handleSearch($method) {
        if ($method !== 'GET') {
            $this->sendError(405, 'Nur GET erlaubt');
            return;
        }

        $searchTerm = $_GET['q'] ?? '';
        
        if (strlen($searchTerm) < 2) {
            $this->sendError(400, 'Suchbegriff muss mindestens 2 Zeichen lang sein');
            return;
        }

        $results = $this->db->searchGewerbeakten($searchTerm);
        $this->sendSuccess(['data' => $results]);
    }

    // === STATISTIKEN ENDPOINT ===

    private function handleStatistiken($method) {
        if ($method !== 'GET') {
            $this->sendError(405, 'Nur GET erlaubt');
            return;
        }

        $stats = $this->db->getStatistiken();
        $this->sendSuccess(['data' => $stats]);
    }

    // === ACTIVITY ENDPOINT ===

    private function handleActivity($method) {
        if ($method !== 'GET') {
            $this->sendError(405, 'Nur GET erlaubt');
            return;
        }

        $limit = intval($_GET['limit'] ?? 20);
        $activity = $this->db->getRecentActivity($limit);
        $this->sendSuccess(['data' => $activity]);
    }

    // === HELPER METHODS ===

    private function convertFrontendData($frontendData) {
        // Frontend-Daten in Datenbankformat konvertieren
        $data = [
            'lizenznummer' => $frontendData['lizenznummer'] ?? '',
            'vermerk' => $frontendData['vermerk'] ?? '',
            'stadt' => $frontendData['stadt'] ?? '',
            'betrieb' => $frontendData['betrieb'] ?? '',
            'ausgestellt_am' => $frontendData['ausgestellt_am'] ?? date('Y-m-d'),
            'anzahl_lizenzen' => intval($frontendData['anzahl_lizenzen'] ?? 1),
            'sondergenehmigung' => $frontendData['sondergenehmigung'] ?? '',
            'sonstiges' => $frontendData['sonstiges'] ?? '',
            'mitarbeiter' => []
        ];

        // Mitarbeiter konvertieren
        if (isset($frontendData['mitarbeiter']) && is_array($frontendData['mitarbeiter'])) {
            foreach ($frontendData['mitarbeiter'] as $index => $mitarbeiter) {
                if (!empty($mitarbeiter['vorname']) && !empty($mitarbeiter['nachname']) && !empty($mitarbeiter['telegram'])) {
                    $rolle = $index === 0 ? 'Inhaber' : ($index . '. Stellvertretung');
                    
                    $data['mitarbeiter'][] = [
                        'rolle' => $rolle,
                        'vorname' => $mitarbeiter['vorname'],
                        'nachname' => $mitarbeiter['nachname'],
                        'telegram' => $mitarbeiter['telegram']
                    ];
                }
            }
        }

        // Validierung
        if (empty($data['lizenznummer']) || empty($data['stadt']) || 
            empty($data['betrieb']) || empty($data['mitarbeiter'])) {
            return null;
        }

        return $data;
    }

    private function lizenznummerExists($lizenznummer) {
        $db = $this->db->getConnection();
        $sql = "SELECT COUNT(*) FROM gewerbeakten WHERE lizenznummer = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$lizenznummer]);
        return $stmt->fetchColumn() > 0;
    }

    private function getJsonInput() {
        $input = file_get_contents('php://input');
        return json_decode($input, true);
    }

    private function sendSuccess($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode([
            'success' => true,
            'timestamp' => date('c'),
            ...$data
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    private function sendError($statusCode, $message) {
        http_response_code($statusCode);
        echo json_encode([
            'success' => false,
            'error' => $message,
            'timestamp' => date('c')
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
}

// API ausführen
$api = new GewerberegisterAPI();
$api->handleRequest();
?>