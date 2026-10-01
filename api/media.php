<?php
require_once __DIR__ . '/../config/config.php';

$action = $_GET['action'] ?? 'list';
$input = get_json_input();

switch ($action) {
    case 'list':
        $search = sanitize_string($_GET['search'] ?? '');
        $query = "SELECT * FROM media WHERE 1=1";
        $params = [];

        if (!empty($search)) {
            $query .= " AND (filename LIKE ? OR caption LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $query .= " ORDER BY uploaded_at DESC, id DESC";

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        json_response([
            'success' => true,
            'data' => $stmt->fetchAll()
        ]);
        break;

    case 'upload':
        require_auth();

        if (empty($_FILES['file'])) {
            // Check if base64 or URL submitted
            $url = sanitize_string($input['url'] ?? '');
            $caption = sanitize_string($input['caption'] ?? '');
            if (!empty($url)) {
                $filename = basename($url);
                $stmt = $pdo->prepare("INSERT INTO media (filename, file_path, file_size, file_type, caption) VALUES (?, ?, 0, 'image/url', ?)");
                $stmt->execute([$filename, $url, $caption]);
                json_response([
                    'success' => true,
                    'message' => 'Media link registered successfully.',
                    'file_path' => $url,
                    'id' => $pdo->lastInsertId()
                ]);
            }
            json_response(['success' => false, 'message' => 'No file was uploaded.'], 400);
        }

        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            json_response(['success' => false, 'message' => 'Upload error code: ' . $file['error']], 400);
        }

        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $allowedTypes)) {
            json_response(['success' => false, 'message' => 'Invalid file type. Allowed: JPG, PNG, WEBP, GIF, SVG.'], 400);
        }

        $folder = sanitize_string($_POST['folder'] ?? 'media');
        $targetDir = __DIR__ . '/../uploads/' . ($folder === 'projects' ? 'projects/' : ($folder === 'profile' ? 'profile/' : 'media/'));
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $origName = pathinfo($file['name'], PATHINFO_FILENAME);
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $origName) . '_' . time() . '.' . $ext;
        $destPath = $targetDir . $safeName;
        $relPath = 'uploads/' . ($folder === 'projects' ? 'projects/' : ($folder === 'profile' ? 'profile/' : 'media/')) . $safeName;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            json_response(['success' => false, 'message' => 'Failed to save uploaded file.'], 500);
        }

        $caption = sanitize_string($_POST['caption'] ?? $origName);
        $stmt = $pdo->prepare("INSERT INTO media (filename, file_path, file_size, file_type, caption) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$safeName, $relPath, $file['size'], $mimeType, $caption]);

        log_activity('MEDIA_UPLOAD', "Uploaded media file '$safeName'.");

        json_response([
            'success' => true,
            'message' => 'File uploaded successfully!',
            'file_path' => $relPath,
            'filename' => $safeName,
            'id' => $pdo->lastInsertId()
        ]);
        break;

    case 'delete':
        require_auth();
        $id = (int)($input['id'] ?? 0);
        if ($id <= 0) {
            json_response(['success' => false, 'message' => 'Media ID required.'], 400);
        }

        $stmt = $pdo->prepare("SELECT file_path, filename FROM media WHERE id = ?");
        $stmt->execute([$id]);
        $media = $stmt->fetch();

        if ($media) {
            $fullPath = __DIR__ . '/../' . $media['file_path'];
            if (file_exists($fullPath) && is_file($fullPath)) {
                @unlink($fullPath);
            }
            $pdo->prepare("DELETE FROM media WHERE id = ?")->execute([$id]);
            log_activity('MEDIA_DELETE', "Deleted media file '{$media['filename']}'.");
        }

        json_response([
            'success' => true,
            'message' => 'Media deleted successfully.'
        ]);
        break;

    default:
        json_response(['success' => false, 'message' => 'Invalid action.'], 400);
}
