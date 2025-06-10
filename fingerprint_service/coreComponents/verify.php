<?php
/**
 * -=-<[ Bismillahirrahmanirrahim ]>-=-
 * Verify or Identify fingerprint
 */

require_once("../coreComponents/basicRequirements.php");

if (!empty($_POST["data"])) {
    $user_data = json_decode($_POST["data"]);

    // 🚨 Mode: Identification (1-to-many)
    if (isset($user_data->pre_enrolled_finger_data) && isset($user_data->all_enrolled)) {
        $pre_fmd = $user_data->pre_enrolled_finger_data;
        $all_enrolled = $user_data->all_enrolled;

        $is_duplicate = check_duplicate($pre_fmd, $all_enrolled);
        if ($is_duplicate) {
            echo json_encode("match");
        } else {
            echo json_encode("no_match");
        }
        exit;
    }

    // ✅ Mode: Traditional verification (1-to-1)
    $pre_enrolled_finger_data = $user_data->pre_enrolled_finger_data;
    $enrolled_index_finger_data = $user_data->enrolled_index_finger_data;
    $enrolled_middle_finger_data = $user_data->enrolled_middle_finger_data;

    $verified_index_finger = verify_fingerprint($pre_enrolled_finger_data, $enrolled_index_finger_data);
    $verified_middle_finger = verify_fingerprint($pre_enrolled_finger_data, $enrolled_middle_finger_data);

    if ($verified_index_finger !== "verification failed" && $verified_index_finger){
        echo json_encode("match");
    }
    elseif ($verified_middle_finger !== "verification failed" && $verified_middle_finger){
        echo json_encode("match");
    }
    else {
        echo json_encode("no_match");
    }

} else {
    echo json_encode("error! no data provided in post request, here to let you know the addtionals have been changed");
}
