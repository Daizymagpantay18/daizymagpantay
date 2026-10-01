<?php
require_once __DIR__ . '/../config/config.php';

$action = $_GET['action'] ?? 'list';
$input = get_json_input();

switch ($action) {
    case 'list':
        $status = $_GET['status'] ?? '';
        $search = sanitize_string($_GET['search'] ?? '');
        $category = sanitize_string($_GET['category'] ?? '');
        $isAdmin = is_admin_logged_in();

        $query = "SELECT p.*, (SELECT COUNT(*) FROM project_images WHERE project_id = p.id) as screenshot_count 
                  FROM projects p WHERE 1=1";
        $params = [];

        // If not logged in as admin, force Published only
        if (!$isAdmin || ($status === 'Published' || $status === 'Draft')) {
            if (!$isAdmin) {
                $query .= " AND p.status = 'Published'";
            } else if (!empty($status) && $status !== 'all') {
                $query .= " AND p.status = ?";
                $params[] = $status;
            }
        }

        if (!empty($search)) {
            $query .= " AND (p.title LIKE ? OR p.short_description LIKE ? OR p.technologies_json LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        if (!empty($category) && $category !== 'all') {
            $query .= " AND p.category = ?";
            $params[] = $category;
        }

        $query .= " ORDER BY p.sort_order ASC, p.id DESC";

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $projects = $stmt->fetchAll();

        foreach ($projects as &$p) {
            $p['technologies'] = !empty($p['technologies_json']) ? json_decode($p['technologies_json'], true) : [];
        }

        json_response([
            'success' => true,
            'data' => $projects
        ]);
        break;

    case 'get':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        $slug = sanitize_string($_GET['slug'] ?? '');

        if ($id > 0) {
            $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
            $stmt->execute([$id]);
        } else if (!empty($slug)) {
            $stmt = $pdo->prepare("SELECT * FROM projects WHERE slug = ?");
            $stmt->execute([$slug]);
        } else {
            json_response(['success' => false, 'message' => 'Project ID or slug required.'], 400);
        }

        $project = $stmt->fetch();
        if (!$project) {
            json_response(['success' => false, 'message' => 'Project not found.'], 404);
        }

        // Fetch screenshots
        $imgStmt = $pdo->prepare("SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order ASC, id ASC");
        $imgStmt->execute([$project['id']]);
        $project['screenshots'] = $imgStmt->fetchAll();
        $project['technologies'] = !empty($project['technologies_json']) ? json_decode($project['technologies_json'], true) : [];

        json_response([
            'success' => true,
            'data' => $project
        ]);
        break;

    case 'increment_view':
        $id = isset($input['id']) ? (int)$input['id'] : (int)($_GET['id'] ?? 0);
        if ($id > 0) {
            $stmt = $pdo->prepare("UPDATE projects SET views_count = views_count + 1 WHERE id = ?");
            $stmt->execute([$id]);
        }
        json_response(['success' => true]);
        break;

    case 'create':
        require_auth();

        $title = sanitize_string($input['title'] ?? '');
        $projectNumber = sanitize_string($input['project_number'] ?? '01');
        $slug = sanitize_string($input['slug'] ?? '');
        if (empty($slug)) {
            $slug = strtolower(preg_replace('/[^A-Za-z0-9-]+/', '-', $title));
        }
        $shortDesc = trim((string)($input['short_description'] ?? ''));
        $fullDesc = trim((string)($input['full_description'] ?? ''));
        $category = sanitize_string($input['category'] ?? 'System Design');
        $year = sanitize_string($input['year'] ?? date('Y'));
        $role = sanitize_string($input['role'] ?? 'Lead Developer');
        $coverImage = sanitize_string($input['cover_image'] ?? 'assets/images/project-default.svg');
        $githubUrl = sanitize_string($input['github_url'] ?? '');
        $projectUrl = sanitize_string($input['project_url'] ?? '');
        $isFeatured = !empty($input['is_featured']) ? 1 : 0;
        $status = in_array($input['status'] ?? '', ['Published', 'Draft']) ? $input['status'] : 'Published';
        $problem = trim((string)($input['problem'] ?? ''));
        $solution = trim((string)($input['solution'] ?? ''));
        $myContribution = trim((string)($input['my_contribution'] ?? ''));
        $sortOrder = (int)($input['sort_order'] ?? 0);

        $techArray = is_array($input['technologies'] ?? null) ? $input['technologies'] : [];
        $technologiesJson = json_encode($techArray);

        if (empty($title)) {
            json_response(['success' => false, 'message' => 'Project title is required.'], 400);
        }

        // Check unique slug
        $stmt = $pdo->prepare("SELECT id FROM projects WHERE slug = ?");
        $stmt->execute([$slug]);
        if ($stmt->fetch()) {
            $slug .= '-' . time();
        }

        $stmt = $pdo->prepare("INSERT INTO projects (
            project_number, title, slug, short_description, full_description, category, year, role,
            technologies_json, cover_image, github_url, project_url, is_featured, status,
            problem, solution, my_contribution, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->execute([
            $projectNumber, $title, $slug, $shortDesc, $fullDesc, $category, $year, $role,
            $technologiesJson, $coverImage, $githubUrl, $projectUrl, $isFeatured, $status,
            $problem, $solution, $myContribution, $sortOrder
        ]);

        $projectId = $pdo->lastInsertId();

        // Handle screenshots
        if (!empty($input['screenshots']) && is_array($input['screenshots'])) {
            $imgStmt = $pdo->prepare("INSERT INTO project_images (project_id, image_url, caption, sort_order) VALUES (?, ?, ?, ?)");
            $ord = 1;
            foreach ($input['screenshots'] as $img) {
                $imgUrl = is_array($img) ? ($img['image_url'] ?? '') : (string)$img;
                $caption = is_array($img) ? ($img['caption'] ?? '') : '';
                if (!empty($imgUrl)) {
                    $imgStmt->execute([$projectId, $imgUrl, $caption, $ord++]);
                }
            }
        }

        log_activity('PROJECT_CREATE', "Created project '$title' ($status).");

        json_response([
            'success' => true,
            'message' => 'Project created successfully!',
            'project_id' => $projectId
        ]);
        break;

    case 'update':
        require_auth();

        $id = (int)($input['id'] ?? 0);
        if ($id <= 0) {
            json_response(['success' => false, 'message' => 'Valid Project ID is required.'], 400);
        }

        $title = sanitize_string($input['title'] ?? '');
        $projectNumber = sanitize_string($input['project_number'] ?? '01');
        $slug = sanitize_string($input['slug'] ?? '');
        $shortDesc = trim((string)($input['short_description'] ?? ''));
        $fullDesc = trim((string)($input['full_description'] ?? ''));
        $category = sanitize_string($input['category'] ?? 'System Design');
        $year = sanitize_string($input['year'] ?? date('Y'));
        $role = sanitize_string($input['role'] ?? 'Lead Developer');
        $coverImage = sanitize_string($input['cover_image'] ?? 'assets/images/project-default.svg');
        $githubUrl = sanitize_string($input['github_url'] ?? '');
        $projectUrl = sanitize_string($input['project_url'] ?? '');
        $isFeatured = !empty($input['is_featured']) ? 1 : 0;
        $status = in_array($input['status'] ?? '', ['Published', 'Draft']) ? $input['status'] : 'Published';
        $problem = trim((string)($input['problem'] ?? ''));
        $solution = trim((string)($input['solution'] ?? ''));
        $myContribution = trim((string)($input['my_contribution'] ?? ''));
        $sortOrder = (int)($input['sort_order'] ?? 0);

        $techArray = is_array($input['technologies'] ?? null) ? $input['technologies'] : [];
        $technologiesJson = json_encode($techArray);

        if (empty($title)) {
            json_response(['success' => false, 'message' => 'Project title is required.'], 400);
        }

        // Slug check
        $slugCheck = $pdo->prepare("SELECT id FROM projects WHERE slug = ? AND id != ?");
        $slugCheck->execute([$slug, $id]);
        if ($slugCheck->fetch()) {
            $slug .= '-' . time();
        }

        $stmt = $pdo->prepare("UPDATE projects SET 
            project_number = ?, title = ?, slug = ?, short_description = ?, full_description = ?,
            category = ?, year = ?, role = ?, technologies_json = ?, cover_image = ?,
            github_url = ?, project_url = ?, is_featured = ?, status = ?, problem = ?,
            solution = ?, my_contribution = ?, sort_order = ?
            WHERE id = ?");

        $stmt->execute([
            $projectNumber, $title, $slug, $shortDesc, $fullDesc,
            $category, $year, $role, $technologiesJson, $coverImage,
            $githubUrl, $projectUrl, $isFeatured, $status, $problem,
            $solution, $myContribution, $sortOrder, $id
        ]);

        // Replace screenshots if provided
        if (isset($input['screenshots']) && is_array($input['screenshots'])) {
            $pdo->prepare("DELETE FROM project_images WHERE project_id = ?")->execute([$id]);
            $imgStmt = $pdo->prepare("INSERT INTO project_images (project_id, image_url, caption, sort_order) VALUES (?, ?, ?, ?)");
            $ord = 1;
            foreach ($input['screenshots'] as $img) {
                $imgUrl = is_array($img) ? ($img['image_url'] ?? '') : (string)$img;
                $caption = is_array($img) ? ($img['caption'] ?? '') : '';
                if (!empty($imgUrl)) {
                    $imgStmt->execute([$id, $imgUrl, $caption, $ord++]);
                }
            }
        }

        log_activity('PROJECT_UPDATE', "Updated project '$title'.");

        json_response([
            'success' => true,
            'message' => 'Project updated successfully!'
        ]);
        break;

    case 'toggle_status':
        require_auth();
        $id = (int)($input['id'] ?? 0);
        $newStatus = in_array($input['status'] ?? '', ['Published', 'Draft']) ? $input['status'] : 'Published';

        $stmt = $pdo->prepare("UPDATE projects SET status = ? WHERE id = ?");
        $stmt->execute([$newStatus, $id]);

        log_activity('PROJECT_STATUS', "Changed project ID $id status to $newStatus.");

        json_response([
            'success' => true,
            'message' => "Project status set to $newStatus."
        ]);
        break;

    case 'delete':
        require_auth();
        $id = (int)($input['id'] ?? 0);
        if ($id <= 0) {
            json_response(['success' => false, 'message' => 'Valid Project ID is required.'], 400);
        }

        $stmt = $pdo->prepare("SELECT title FROM projects WHERE id = ?");
        $stmt->execute([$id]);
        $proj = $stmt->fetch();
        $title = $proj['title'] ?? "ID $id";

        $pdo->prepare("DELETE FROM projects WHERE id = ?")->execute([$id]);

        log_activity('PROJECT_DELETE', "Deleted project '$title'.");

        json_response([
            'success' => true,
            'message' => 'Project deleted successfully.'
        ]);
        break;

    default:
        json_response(['success' => false, 'message' => 'Invalid action.'], 400);
}
