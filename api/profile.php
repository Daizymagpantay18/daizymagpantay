<?php
require_once __DIR__ . '/../config/config.php';

$action = $_GET['action'] ?? 'get';
$input = get_json_input();

switch ($action) {
    case 'get':
        $stmt = $pdo->query("SELECT * FROM profile LIMIT 1");
        $profile = $stmt->fetch();

        if ($profile) {
            $profile['other_socials'] = !empty($profile['other_socials_json']) ? json_decode($profile['other_socials_json'], true) : [];
            $profile['availability_status'] = !empty($profile['availability_status_json']) ? json_decode($profile['availability_status_json'], true) : [];
        }

        json_response([
            'success' => true,
            'data' => $profile
        ]);
        break;

    case 'update':
        require_auth();

        $fullName = sanitize_string($input['full_name'] ?? 'DAIZY MAGPANTAY');
        $profTitle = sanitize_string($input['professional_title'] ?? '');
        $shortIntro = trim((string)($input['short_intro'] ?? ''));
        $aboutMe = trim((string)($input['about_me'] ?? ''));
        $location = sanitize_string($input['location'] ?? 'Philippines');
        $focusAreas = sanitize_string($input['focus_areas'] ?? 'Systems • Web • Design');
        $currentStatus = sanitize_string($input['current_status'] ?? 'Studying Information Technology');
        $email = sanitize_string($input['email'] ?? '');
        $phone = sanitize_string($input['phone'] ?? '');
        $linkedinUrl = sanitize_string($input['linkedin_url'] ?? '');
        $githubUrl = sanitize_string($input['github_url'] ?? '');
        $avatarUrl = sanitize_string($input['avatar_url'] ?? 'assets/images/portrait-cinematic.png');
        $heroBadge = sanitize_string($input['hero_badge'] ?? 'PORTFOLIO / 2026');
        $resumeUrl = sanitize_string($input['resume_url'] ?? '');

        $otherSocialsJson = isset($input['other_socials']) ? json_encode($input['other_socials']) : null;
        $availabilityJson = isset($input['availability_status']) ? json_encode($input['availability_status']) : null;

        $stmt = $pdo->query("SELECT id FROM profile LIMIT 1");
        $existing = $stmt->fetch();

        if ($existing) {
            $updateStmt = $pdo->prepare("UPDATE profile SET 
                full_name = ?, professional_title = ?, short_intro = ?, about_me = ?,
                location = ?, focus_areas = ?, current_status = ?, email = ?, phone = ?,
                linkedin_url = ?, github_url = ?, other_socials_json = ?, availability_status_json = ?,
                avatar_url = ?, hero_badge = ?, resume_url = ?
                WHERE id = ?");
            $updateStmt->execute([
                $fullName, $profTitle, $shortIntro, $aboutMe, $location, $focusAreas,
                $currentStatus, $email, $phone, $linkedinUrl, $githubUrl,
                $otherSocialsJson, $availabilityJson, $avatarUrl, $heroBadge, $resumeUrl, $existing['id']
            ]);
        } else {
            $insertStmt = $pdo->prepare("INSERT INTO profile (
                full_name, professional_title, short_intro, about_me, location, focus_areas,
                current_status, email, phone, linkedin_url, github_url, other_socials_json,
                availability_status_json, avatar_url, hero_badge, resume_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $insertStmt->execute([
                $fullName, $profTitle, $shortIntro, $aboutMe, $location, $focusAreas,
                $currentStatus, $email, $phone, $linkedinUrl, $githubUrl,
                $otherSocialsJson, $availabilityJson, $avatarUrl, $heroBadge, $resumeUrl
            ]);
        }

        log_activity('PROFILE_UPDATE', "Profile details updated for $fullName.");

        json_response([
            'success' => true,
            'message' => 'Profile updated successfully!'
        ]);
        break;

    default:
        json_response(['success' => false, 'message' => 'Invalid action.'], 400);
}
