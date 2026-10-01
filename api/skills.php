<?php
require_once __DIR__ . '/../config/config.php';

$action = $_GET['action'] ?? 'list';
$input = get_json_input();

switch ($action) {
    case 'list':
        $isAdmin = is_admin_logged_in();
        $grouped = isset($_GET['grouped']) ? (bool)$_GET['grouped'] : true;

        $catStmt = $pdo->query("SELECT * FROM skill_categories ORDER BY sort_order ASC, id ASC");
        $categories = $catStmt->fetchAll();

        $skillQuery = "SELECT s.*, c.name as category_name, c.slug as category_slug 
                       FROM skills s 
                       JOIN skill_categories c ON s.category_id = c.id";
        if (!$isAdmin) {
            $skillQuery .= " WHERE s.is_visible = 1";
        }
        $skillQuery .= " ORDER BY c.sort_order ASC, s.sort_order ASC, s.id ASC";

        $skillStmt = $pdo->query($skillQuery);
        $skills = $skillStmt->fetchAll();

        if ($grouped) {
            $groupedData = [];
            foreach ($categories as $cat) {
                $catSkills = array_values(array_filter($skills, function($s) use ($cat) {
                    return $s['category_id'] == $cat['id'];
                }));
                
                // If not admin, only include categories that have visible skills
                if ($isAdmin || count($catSkills) > 0) {
                    $groupedData[] = [
                        'id' => $cat['id'],
                        'name' => $cat['name'],
                        'slug' => $cat['slug'],
                        'skills' => $catSkills
                    ];
                }
            }
            json_response([
                'success' => true,
                'categories' => $categories,
                'data' => $groupedData,
                'flat_skills' => $skills
            ]);
        } else {
            json_response([
                'success' => true,
                'categories' => $categories,
                'data' => $skills
            ]);
        }
        break;

    case 'categories':
        $catStmt = $pdo->query("SELECT * FROM skill_categories ORDER BY sort_order ASC");
        json_response([
            'success' => true,
            'data' => $catStmt->fetchAll()
        ]);
        break;

    case 'create':
        require_auth();

        $categoryId = (int)($input['category_id'] ?? 0);
        $name = sanitize_string($input['name'] ?? '');
        $description = sanitize_string($input['description'] ?? '');
        $iconName = sanitize_string($input['icon_name'] ?? 'code');
        $isVisible = isset($input['is_visible']) ? (int)$input['is_visible'] : 1;
        $sortOrder = (int)($input['sort_order'] ?? 0);

        if (empty($name) || $categoryId <= 0) {
            json_response(['success' => false, 'message' => 'Skill name and category are required.'], 400);
        }

        $stmt = $pdo->prepare("INSERT INTO skills (category_id, name, description, icon_name, is_visible, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$categoryId, $name, $description, $iconName, $isVisible, $sortOrder]);

        log_activity('SKILL_CREATE', "Added skill '$name'.");

        json_response([
            'success' => true,
            'message' => 'Skill added successfully!',
            'id' => $pdo->lastInsertId()
        ]);
        break;

    case 'update':
        require_auth();

        $id = (int)($input['id'] ?? 0);
        $categoryId = (int)($input['category_id'] ?? 0);
        $name = sanitize_string($input['name'] ?? '');
        $description = sanitize_string($input['description'] ?? '');
        $iconName = sanitize_string($input['icon_name'] ?? 'code');
        $isVisible = isset($input['is_visible']) ? (int)$input['is_visible'] : 1;
        $sortOrder = (int)($input['sort_order'] ?? 0);

        if ($id <= 0 || empty($name) || $categoryId <= 0) {
            json_response(['success' => false, 'message' => 'Valid ID, name, and category are required.'], 400);
        }

        $stmt = $pdo->prepare("UPDATE skills SET category_id = ?, name = ?, description = ?, icon_name = ?, is_visible = ?, sort_order = ? WHERE id = ?");
        $stmt->execute([$categoryId, $name, $description, $iconName, $isVisible, $sortOrder, $id]);

        log_activity('SKILL_UPDATE', "Updated skill '$name'.");

        json_response([
            'success' => true,
            'message' => 'Skill updated successfully!'
        ]);
        break;

    case 'delete':
        require_auth();
        $id = (int)($input['id'] ?? 0);
        if ($id <= 0) {
            json_response(['success' => false, 'message' => 'Skill ID required.'], 400);
        }

        $stmt = $pdo->prepare("SELECT name FROM skills WHERE id = ?");
        $stmt->execute([$id]);
        $skill = $stmt->fetch();
        $name = $skill['name'] ?? "ID $id";

        $pdo->prepare("DELETE FROM skills WHERE id = ?")->execute([$id]);

        log_activity('SKILL_DELETE', "Deleted skill '$name'.");

        json_response([
            'success' => true,
            'message' => 'Skill deleted successfully.'
        ]);
        break;

    default:
        json_response(['success' => false, 'message' => 'Invalid action.'], 400);
}
