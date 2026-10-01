<?php
require_once __DIR__ . '/../config/config.php';

$action = $_GET['action'] ?? 'list';
$input = get_json_input();

switch ($action) {
    case 'list':
        $stmt = $pdo->query("SELECT * FROM experience ORDER BY sort_order ASC, year DESC, id DESC");
        json_response([
            'success' => true,
            'data' => $stmt->fetchAll()
        ]);
        break;

    case 'create':
        require_auth();

        $year = sanitize_string($input['year'] ?? date('Y'));
        $title = sanitize_string($input['title'] ?? '');
        $description = trim((string)($input['description'] ?? ''));
        $category = sanitize_string($input['category'] ?? 'Milestone');
        $sortOrder = (int)($input['sort_order'] ?? 0);

        if (empty($year) || empty($title) || empty($description)) {
            json_response(['success' => false, 'message' => 'Year, title, and description are required.'], 400);
        }

        $stmt = $pdo->prepare("INSERT INTO experience (year, title, description, category, sort_order) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$year, $title, $description, $category, $sortOrder]);

        log_activity('JOURNEY_CREATE', "Added journey timeline entry '$year - $title'.");

        json_response([
            'success' => true,
            'message' => 'Timeline entry added successfully!',
            'id' => $pdo->lastInsertId()
        ]);
        break;

    case 'update':
        require_auth();

        $id = (int)($input['id'] ?? 0);
        $year = sanitize_string($input['year'] ?? date('Y'));
        $title = sanitize_string($input['title'] ?? '');
        $description = trim((string)($input['description'] ?? ''));
        $category = sanitize_string($input['category'] ?? 'Milestone');
        $sortOrder = (int)($input['sort_order'] ?? 0);

        if ($id <= 0 || empty($year) || empty($title) || empty($description)) {
            json_response(['success' => false, 'message' => 'Valid ID, year, title, and description are required.'], 400);
        }

        $stmt = $pdo->prepare("UPDATE experience SET year = ?, title = ?, description = ?, category = ?, sort_order = ? WHERE id = ?");
        $stmt->execute([$year, $title, $description, $category, $sortOrder, $id]);

        log_activity('JOURNEY_UPDATE', "Updated timeline entry '$year - $title'.");

        json_response([
            'success' => true,
            'message' => 'Timeline entry updated successfully!'
        ]);
        break;

    case 'delete':
        require_auth();
        $id = (int)($input['id'] ?? 0);
        if ($id <= 0) {
            json_response(['success' => false, 'message' => 'ID required.'], 400);
        }

        $stmt = $pdo->prepare("SELECT title FROM experience WHERE id = ?");
        $stmt->execute([$id]);
        $exp = $stmt->fetch();
        $title = $exp['title'] ?? "ID $id";

        $pdo->prepare("DELETE FROM experience WHERE id = ?")->execute([$id]);

        log_activity('JOURNEY_DELETE', "Deleted timeline entry '$title'.");

        json_response([
            'success' => true,
            'message' => 'Timeline entry deleted.'
        ]);
        break;

    default:
        json_response(['success' => false, 'message' => 'Invalid action.'], 400);
}
