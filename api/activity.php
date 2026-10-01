<?php
require_once __DIR__ . '/../config/config.php';

require_auth();

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 15;
$stmt = $pdo->prepare("SELECT * FROM activity_logs ORDER BY created_at DESC, id DESC LIMIT ?");
$stmt->bindValue(1, $limit, PDO::PARAM_INT);
$stmt->execute();

json_response([
    'success' => true,
    'data' => $stmt->fetchAll()
]);
