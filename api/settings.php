<?php
require_once __DIR__ . '/../config/config.php';

$action = $_GET['action'] ?? 'get';
$input = get_json_input();

switch ($action) {
    case 'get':
        $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
        $rows = $stmt->fetchAll();
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }

        json_response([
            'success' => true,
            'data' => $settings
        ]);
        break;

    case 'update':
        require_auth();

        if (is_array($input)) {
            $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
            foreach ($input as $key => $val) {
                $cleanKey = sanitize_string($key);
                $cleanVal = is_array($val) ? json_encode($val) : (string)$val;
                $stmt->execute([$cleanKey, $cleanVal, $cleanVal]);
            }
            log_activity('SETTINGS_UPDATE', "Portfolio site settings updated.");
        }

        json_response([
            'success' => true,
            'message' => 'Settings saved successfully!'
        ]);
        break;

    default:
        json_response(['success' => false, 'message' => 'Invalid action.'], 400);
}
