const { Student } = require('../models');
const xlsx = require('xlsx');

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

const { generateStudentId } = require('../utils/idGenerator');
module.exports = {
    
  async getAllStudents(req, res) {
    try {
      const students = await Student.findAll();
      res.send(students);
    } catch (err) {
      res.status(500).send('Error fetching students: ' + err.message);
    }
  },

  async createStudent(req, res) {
  try {
    
    //log
    //console.log('Incoming student data:', req.body);
    const student = await Student.create({
      ...req.body,
      department: req.body.course, // Map "course" to "department"
      idNumber: generateStudentId() // Auto-generate ID (see step 2)
    });

    res.status(201).send(student);
  } catch (err) {
    //log
    console.error('Database error:', err.errors?.map(e => e.message) || err.message);
    res.status(500).send('Error creating student: ' + err.message);
  }
},



  // AuthUpload.js - upload() method
async upload(req, res) {
  try {
  console.log('Upload request received. Files:', req.files);
    
    // Add authentication check
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    const file = req.files.file;
    const workbook = xlsx.read(file.data);
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    
   console.log('Raw sheet data:', sheet.slice(0, 2)); // Log first 2 rows

    const students = [];
    const errors = [];

    for (const [index, row] of sheet.entries()) {
      try {
        // Process name using the helper function
        const { lastName, firstName, middleInitial } = processName(row['Student Name']);

        const processed = {
          lastName,
          firstName,
          middleInitial,
          yearLevel: formatYearLevel(row['Year Level']),
          department: mapCourse(row['Course']),
          idNumber: `STU-${Date.now()}-${index}`
        };

        // Validate required fields
        if (!processed.lastName || !processed.firstName) {
          throw new Error('Missing name components');
        }

        // Add debug log for name parsing
        console.log(`Processed row ${index + 1}:`, {
          raw: row['Student Name'],
          parsed: processed
        });

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

      // Bulk create students
      const result = await Student.bulkCreate(students);
      res.json({
        success: true,
        created: result.length,
        message: `Successfully imported ${result.length} students`
      });

    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({
        success: false,
        message: 'Server error during upload',
        error: err.message
      });
    }
  
},


};