<?php
require_once __DIR__ . '/../config/config.php';

$action = $_GET['action'] ?? '';
$input = get_json_input();

switch ($action) {
    case 'login':
        $email = sanitize_string($input['email'] ?? '');
        $password = (string)($input['password'] ?? '');

        if (empty($email) || empty($password)) {
            json_response(['success' => false, 'message' => 'Please provide both email and password.'], 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $admin = $stmt->fetch();

        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            json_response(['success' => false, 'message' => 'Invalid email or password.'], 401);
        }

        // Set session
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_name'] = $admin['name'];
        $_SESSION['admin_email'] = $admin['email'];
        $_SESSION['admin_role'] = $admin['role'];
        $_SESSION['last_activity'] = time();

        log_activity('ADMIN_LOGIN', "Administrator {$admin['name']} logged in successfully.", $admin['id'], $admin['name']);

        json_response([
            'success' => true,
            'message' => 'Login successful. Welcome back!',
            'admin' => [
                'id' => $admin['id'],
                'name' => $admin['name'],
                'email' => $admin['email'],
                'role' => $admin['role'],
                'avatar_url' => $admin['avatar_url']
            ]
        ]);
        break;

    case 'check':
        if (is_admin_logged_in()) {
            $stmt = $pdo->prepare("SELECT id, name, email, role, avatar_url FROM admins WHERE id = ?");
            $stmt->execute([$_SESSION['admin_id']]);
            $admin = $stmt->fetch();

            if ($admin) {
                json_response([
                    'success' => true,
                    'authenticated' => true,
                    'admin' => $admin
                ]);
            }
        }
        json_response([
            'success' => true,
            'authenticated' => false,
            'admin' => null
        ]);
        break;

    case 'logout':
        if (is_admin_logged_in()) {
            log_activity('ADMIN_LOGOUT', "Administrator {$_SESSION['admin_name']} logged out.");
        }
        session_unset();
        session_destroy();
        json_response(['success' => true, 'message' => 'Logged out successfully.']);
        break;

    case 'update_credentials':
        require_auth();
        $adminId = $_SESSION['admin_id'];
        $name = sanitize_string($input['name'] ?? '');
        $email = sanitize_string($input['email'] ?? '');
        $currentPassword = (string)($input['current_password'] ?? '');
        $newPassword = (string)($input['new_password'] ?? '');

        if (empty($name) || empty($email)) {
            json_response(['success' => false, 'message' => 'Name and email are required.'], 400);
        }

        // Fetch current admin
        $stmt = $pdo->prepare("SELECT * FROM admins WHERE id = ?");
        $stmt->execute([$adminId]);
        $admin = $stmt->fetch();

        if (!$admin) {
            json_response(['success' => false, 'message' => 'Admin account not found.'], 404);
        }

        if (!empty($newPassword)) {
            if (empty($currentPassword) || !password_verify($currentPassword, $admin['password_hash'])) {
                json_response(['success' => false, 'message' => 'Current password is incorrect.'], 400);
            }
            if (strlen($newPassword) < 6) {
                json_response(['success' => false, 'message' => 'New password must be at least 6 characters.'], 400);
            }
            $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE admins SET name = ?, email = ?, password_hash = ? WHERE id = ?");
            $stmt->execute([$name, $email, $newHash, $adminId]);
        } else {
            $stmt = $pdo->prepare("UPDATE admins SET name = ?, email = ? WHERE id = ?");
            $stmt->execute([$name, $email, $adminId]);
        }

        $_SESSION['admin_name'] = $name;
        $_SESSION['admin_email'] = $email;

        log_activity('PROFILE_UPDATE', "Admin updated account credentials ($email).");

        json_response(['success' => true, 'message' => 'Account settings updated successfully.']);
        break;

    default:
        json_response(['success' => false, 'message' => 'Invalid auth endpoint action.'], 400);
}
