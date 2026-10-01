<?php
require_once __DIR__ . '/../config/config.php';

$action = $_GET['action'] ?? 'list';
$input = get_json_input();

switch ($action) {
    case 'submit':
        $senderName = sanitize_string($input['sender_name'] ?? '');
        $email = sanitize_string($input['email'] ?? '');
        $subject = sanitize_string($input['subject'] ?? 'Portfolio Inquiry');
        $message = trim((string)($input['message'] ?? ''));

        if (empty($senderName) || empty($email) || empty($message)) {
            json_response(['success' => false, 'message' => 'Please fill in your name, email, and message.'], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            json_response(['success' => false, 'message' => 'Please provide a valid email address.'], 400);
        }

        $stmt = $pdo->prepare("INSERT INTO messages (sender_name, email, subject, message, status) VALUES (?, ?, ?, ?, 'Unread')");
        $stmt->execute([$senderName, $email, $subject, $message]);

        // Log public submission activity
        log_activity('MESSAGE_RECEIVED', "New message received from $senderName ($email).");

        json_response([
            'success' => true,
            'message' => 'Your message has been delivered successfully. Thank you for getting in touch!'
        ]);
        break;

    case 'list':
        require_auth();

        $status = sanitize_string($_GET['status'] ?? '');
        $search = sanitize_string($_GET['search'] ?? '');

        $query = "SELECT * FROM messages WHERE 1=1";
        $params = [];

        if (!empty($status) && $status !== 'all') {
            $query .= " AND status = ?";
            $params[] = $status;
        }

        if (!empty($search)) {
            $query .= " AND (sender_name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $query .= " ORDER BY id DESC";

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $messages = $stmt->fetchAll();

        // Get unread count
        $unreadStmt = $pdo->query("SELECT COUNT(*) AS cnt FROM messages WHERE status = 'Unread'");
        $unreadCount = (int)$unreadStmt->fetch()['cnt'];

        json_response([
            'success' => true,
            'data' => $messages,
            'unread_count' => $unreadCount
        ]);
        break;

    case 'update_status':
        require_auth();

        $id = (int)($input['id'] ?? 0);
        $status = sanitize_string($input['status'] ?? '');

        if ($id <= 0 || !in_array($status, ['Unread', 'Read', 'Replied'])) {
            json_response(['success' => false, 'message' => 'Valid ID and status required.'], 400);
        }

        $stmt = $pdo->prepare("UPDATE messages SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        log_activity('MESSAGE_STATUS', "Marked message ID $id as $status.");

        json_response([
            'success' => true,
            'message' => "Message marked as $status."
        ]);
        break;

    case 'delete':
        require_auth();
        $id = (int)($input['id'] ?? 0);
        if ($id <= 0) {
            json_response(['success' => false, 'message' => 'Message ID required.'], 400);
        }

        $pdo->prepare("DELETE FROM messages WHERE id = ?")->execute([$id]);

        log_activity('MESSAGE_DELETE', "Deleted message ID $id.");

        json_response([
            'success' => true,
            'message' => 'Message deleted.'
        ]);
        break;

    default:
        json_response(['success' => false, 'message' => 'Invalid action.'], 400);
}
