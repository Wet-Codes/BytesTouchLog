<?php
/**
 * -=-<[ Bismillahirrahmanirrahim ]>-=- 
 * Verify or Identify fingerprint 
 */

require_once("../coreComponents/basicRequirements.php");
header('Content-Type: application/json');

if (!empty($_POST["data"])) {
    $user_data = json_decode($_POST["data"]);

    // 🚨 Mode: Identification (1-to-many)
    if (isset($user_data->pre_enrolled_finger_data) && isset($user_data->all_enrolled)) {
        $pre_fmd = $user_data->pre_enrolled_finger_data;
        $all_enrolled = $user_data->all_enrolled;

        $is_duplicate = check_duplicate($pre_fmd, $all_enrolled);
        if ($is_duplicate) {
            echo json_encode(["success" => true, "message" => "match"]);
        } else {
            echo json_encode(["success" => false, "message" => "no match"]);
        }
        exit;
    }

    // ✅ Mode: Verification (1-to-1)
    $pre = $user_data->pre_enrolled_finger_data ?? null;
    $index = $user_data->enrolled_index_finger_data ?? null;
    $middle = $user_data->enrolled_middle_finger_data ?? null;

    $verified_index = verify_fingerprint($pre, $index);
    $verified_middle = verify_fingerprint($pre, $middle);

    if ($verified_index && $verified_index !== "verification failed") {
        echo json_encode(["success" => true, "message" => "match"]);
    } elseif ($verified_middle && $verified_middle !== "verification failed") {
        echo json_encode(["success" => true, "message" => "match"]);
    } else {
        echo json_encode(["success" => false, "message" => "no match"]);
    }

} else {
    echo json_encode(["success" => false, "error" => "No data provided"]);
}
