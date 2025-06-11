const { Student } = require('../models');
const xlsx = require('xlsx');
const axios = require('axios');
const qs = require('qs');
const { generateStudentId } = require('../utils/idGenerator');

// --- Utility Functions ---
const processName = (fullName) => {
  const [lastName, ...restParts] = fullName.split(', ').map(s => s.trim());
  const firstNameParts = restParts.join(' ').split(' ').filter(p => p);

  return {
    lastName: lastName || '',
    firstName: firstNameParts[0] || '',
    middleInitial: firstNameParts.slice(1)
      .map(n => n.charAt(0).toUpperCase())
      .join('')
  };
};

const formatYearLevel = (year) => {
  const levelMap = {
    '1ST': '1st Year',
    '2ND': '2nd Year',
    '3RD': '3rd Year',
    '4TH': '4th Year'
  };
  return levelMap[year?.toUpperCase()] || year;
};

const mapCourse = (courseName) => {
  const COURSE_MAP = {
    'BS Information Technology (Network Systems)': 'BSIT',
    'BS Computer Science': 'BSCS',
    'BS Information Systems': 'BSIS',
    'BS Information Technology (Database Systems)': 'BSIT-DB',
    'BS Information Technology (Multimedia Systems)': 'BSIT-MM'
  };
  return COURSE_MAP[courseName] || courseName;
};

module.exports = {
   async EnrollExist (req, res) {
    const { studentId, enrolled_index_finger_data, enrolled_middle_finger_data } = req.body;

    if (!studentId) {
      return res.status(400).json({ success: false, error: 'Missing studentId' });
    }

    if (
      !Array.isArray(enrolled_index_finger_data) ||
      !Array.isArray(enrolled_middle_finger_data) ||
      enrolled_index_finger_data.length !== 4 ||
      enrolled_middle_finger_data.length !== 4
    ) {
      return res.status(400).json({ success: false, error: 'Invalid fingerprint data. Expected 4 samples per finger.' });
    }

    try {
      const student = await Student.findByPk(studentId);

      if (!student) {
        return res.status(404).json({ success: false, error: 'Student not found' });
      }

      const fingerprintPayload = {
        data: JSON.stringify({
          index_finger: enrolled_index_finger_data,
          middle_finger: enrolled_middle_finger_data
        })
      };

      console.log('[ENROLL EXISTING STUDENT] Sending fingerprint data to PHP service...');
      const fpResponse = await axios.post(
        'http://localhost:5555/coreComponents/enroll.php',
        qs.stringify(fingerprintPayload),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const enrolled = fpResponse.data;

      if (!enrolled.enrolled_index_finger || !enrolled.enrolled_middle_finger) {
        console.error('[ENROLL EXISTING STUDENT] PHP enrollment failed:', enrolled);
        return res.status(500).json({ success: false, error: 'Fingerprint enrollment failed in PHP backend.' });
      }

      await student.update({
        enrolledFMD1: enrolled.enrolled_index_finger,
        enrolledFMD2: enrolled.enrolled_middle_finger
      });

      console.log(`[ENROLL EXISTING STUDENT] Student ${student.idNumber} fingerprint updated`);

      res.status(200).json({
        success: true,
        message: 'Fingerprint enrolled successfully',
        student
      });

    } catch (err) {
      console.error('[ENROLL EXISTING STUDENT] Error:', err.message || err);
      res.status(500).json({
        success: false,
        error: 'Enrollment failed: ' + (err.message || 'Unknown error')
      });
    }
  },

  async getAllStudents(req, res) {
    try {
      const students = await Student.findAll();
      res.send(students);
    } catch (err) {
      res.status(500).send('Error fetching students: ' + err.message);
    }
  },

  async createStudent(req, res) {
    console.log('[CREATE STUDENT] Incoming request:', req.body);

    const {    
      course,
      enrolled_index_finger_data,
      enrolled_middle_finger_data
    } = req.body;

    // Validate fingerprint data
    if (
      !Array.isArray(enrolled_index_finger_data) ||
      !Array.isArray(enrolled_middle_finger_data) ||
      enrolled_index_finger_data.length !== 4 ||
      enrolled_middle_finger_data.length !== 4
    ) {
      console.warn('[CREATE STUDENT] Invalid fingerprint data format');
      return res.status(400).json({
        success: false,
        error: 'Invalid fingerprint data. Expected 4 samples per finger.'
      });
    }

    const fingerprintPayload = {
      data: JSON.stringify({
        index_finger: enrolled_index_finger_data,
        middle_finger: enrolled_middle_finger_data
      })
    };

    try {
      console.log('[CREATE STUDENT] Sending fingerprint data to PHP enroll service...');
      const fpResponse = await axios.post(
        'http://localhost:5555/coreComponents/enroll.php',
        qs.stringify(fingerprintPayload),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      console.log('[CREATE STUDENT] PHP enrollment response:', fpResponse.data);
      const enrolled = fpResponse.data;

      if (!enrolled.enrolled_index_finger || !enrolled.enrolled_middle_finger) {
        console.error('[CREATE STUDENT] PHP enrollment failed:', enrolled);
        return res.status(500).json({ success: false, error: 'Fingerprint enrollment failed in PHP backend.' });
      }
        console.log('[CREATE STUDENT] course value:', course);
      const newStudent = await Student.create({
         ...req.body,
        department: mapCourse(course),
        enrolledFMD1: enrolled.enrolled_index_finger,
        enrolledFMD2: enrolled.enrolled_middle_finger,
        idNumber: generateStudentId()
      });

      console.log('[CREATE STUDENT] Student successfully created:', newStudent.idNumber);

      res.status(201).send(newStudent);

    } catch (err) {
      console.error('[CREATE STUDENT] Unexpected error:', err.response?.data || err.message || err);
      res.status(500).json({
        success: false,
        error: 'Student creation failed: ' + (err.message || 'Unknown error')
      });
    }
  },

  async upload(req, res) {
    try {
      console.log('Upload request received. Files:', req.files);

      if (!req.user) {
        return res.status(401).send('Unauthorized');
      }

      const file = req.files.file;
      const workbook = xlsx.read(file.data);
      const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      console.log('Raw sheet data:', sheet.slice(0, 2));

      const students = [];
      const errors = [];

      for (const [index, row] of sheet.entries()) {
        try {
          const { lastName, firstName, middleInitial } = processName(row['Student Name']);

          const processed = {
            lastName,
            firstName,
            middleInitial,
            yearLevel: formatYearLevel(row['Year Level']),
            department: mapCourse(row['Course']),
            idNumber: `STU-${Date.now()}-${index}`
          };

          if (!processed.lastName || !processed.firstName) {
            throw new Error('Missing name components');
          }

          console.log(`Processed row ${index + 1}:`, { raw: row['Student Name'], parsed: processed });
          students.push(processed);
        } catch (err) {
          errors.push({
            row: index + 1,
            error: err.message,
            data: row
          });
        }
      }

      if (errors.length > 0) {
        console.error('Validation errors:', errors);
        return res.status(400).json({
          success: false,
          message: `${errors.length} rows failed processing`,
          errors
        });
      }

      const result = await Student.bulkCreate(students);
      res.json({
        success: true,
        created: result.length,
        message: `Successfully imported ${result.length} students`
      });

    } catch (err) {
      console.error('Server error during upload:', err);
      res.status(500).json({
        success: false,
        message: 'Server error during upload',
        error: err.message
      });
    }
  }
};
