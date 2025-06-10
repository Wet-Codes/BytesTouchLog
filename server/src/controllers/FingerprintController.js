const axios = require('axios');
const qs = require('qs');
const { Fingerprint } = require('../models');

// ENROLL
const enroll = async (req, res) => {
  const {
    name,
    enrolled_index_finger_data,
    enrolled_middle_finger_data
  } = req.body;

  if (
    !name ||
    !Array.isArray(enrolled_index_finger_data) ||
    !Array.isArray(enrolled_middle_finger_data) ||
    enrolled_index_finger_data.length !== 4 ||
    enrolled_middle_finger_data.length !== 4
  ) {
    return res.status(400).json({ success: false, error: 'Invalid fingerprint data. Expected 4 samples per finger.' });
  }

  const data = {
    data: JSON.stringify({
      index_finger: enrolled_index_finger_data,
      middle_finger: enrolled_middle_finger_data
    })
  };

  try {
    const response = await axios.post(
      'http://localhost:5555/coreComponents/enroll.php',
      qs.stringify(data),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const enrolled = response.data;

    if (
      enrolled.enrolled_index_finger &&
      enrolled.enrolled_middle_finger
    ) {
      const saved = await Fingerprint.create({
        name,
        enrolledFMD1: enrolled.enrolled_index_finger,
        enrolledFMD2: enrolled.enrolled_middle_finger
      });

      res.json({
        success: true,
        message: 'Enrollment successful',
        fingerprint: {
          id: saved.id,
          name: saved.name
        }
      });
    } else {
      res.status(500).json({ success: false, error: 'Enrollment failed in PHP' });
    }
  } catch (err) {
    console.error('Enroll error:', err.message);
    res.status(500).json({ success: false, error: 'Enrollment failed' });
  }
};

// VERIFY (1-to-1)
const verify = async (req, res) => {
  const { fmd, enrolledFMD1, enrolledFMD2 } = req.body;

  if (!fmd || !enrolledFMD1 || !enrolledFMD2) {
    return res.status(400).json({ success: false, error: 'Missing fingerprint data for verification.' });
  }

  const data = {
    data: JSON.stringify({
      pre_enrolled_finger_data: fmd,
      enrolled_index_finger_data: enrolledFMD1,
      enrolled_middle_finger_data: enrolledFMD2
    })
  };

  try {
    const response = await axios.post(
      'http://localhost:5555/coreComponents/verify.php',
      qs.stringify(data),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const result = response.data;

    if (result === "match") {
      return res.json({ success: true, message: 'Match found' });
    } else if (result === "no_match") {
      return res.json({ success: false, message: 'No match found' });
    } else {
      return res.status(500).json({ success: false, error: 'PHP verification failed' });
    }
  } catch (err) {
    console.error('Verify error:', err.message);
    return res.status(500).json({ success: false, error: 'Verification failed' });
  }
};


//IDENTIFY
const identify = async (req, res) => {
  const { fmd } = req.body;
  console.log('[IDENTIFY] Incoming body:', req.body);

  if (!fmd) {
    return res.status(400).json({ success: false, error: 'No fingerprint provided for identification.' });
  }

  try {
    const allUsers = await Fingerprint.findAll({
      attributes: ['id', 'name', 'enrolledFMD1', 'enrolledFMD2', 'createdAt']
    });

    if (!allUsers.length) {
      return res.status(404).json({ success: false, error: 'No enrolled fingerprints found.' });
    }

    let matchedUser = null;

    for (const user of allUsers) {
      const isMatch = await checkMatch(fmd, user.enrolledFMD1, user.enrolledFMD2);

      if (isMatch) {
        matchedUser = user;
        break;
      }
    }

    if (matchedUser) {
      console.log('[MATCHED USER]', matchedUser.name);
      return res.json({
        success: true,
        message: 'Identification successful',
        user: {
          id: matchedUser.id,
          name: matchedUser.name,
          enrolledAt: matchedUser.createdAt
        }
      });
    } else {
      return res.json({ success: false, message: 'No match found in identification' });
    }

  } catch (err) {
    console.error('Identify error:', err);
    return res.status(500).json({ success: false, error: 'Identification failed' });
  }
};

// ✅ Helper: Check match with both fingerprints
async function checkMatch(sampleFmd, fmd1, fmd2) {
  try {
    const postData = {
      data: JSON.stringify({
        pre_enrolled_finger_data: sampleFmd,
        all_enrolled: [{
          indexfinger: fmd1 || '',
          middlefinger: fmd2 || ''
        }]
      })
    };

    const response = await axios.post(
      'http://localhost:5555/coreComponents/verify.php',
      qs.stringify(postData),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 5000
      }
    );

    return response.data === "match";
  } catch (err) {
    console.error('checkMatch error:', err.message);
    return false;
  }
}


module.exports = {
  enroll,
  verify,
  identify
};
