const { Student } = require('../models');
const xlsx = require('xlsx');

module.exports = {
    async getAllStudents(req, res) {
        try {
            const students = await Student.findAll();
            res.send(students);
        } catch (err) {
            res.status(500).send('Error fetching students', err);
        }
    },

    async createStudent(req, res) {
        try {
            const student = await Student.create(req.body);
            res.send(student);
        } catch (err) {
            res.status(500).send('Error creating student', err);
        }
    },

    async updateStudent(req, res) {
        try {
            const student = await Student.findByPk(req.params.id);
            if (student) {
                await student.update(req.body);
                res.send(student);
            } else {
                res.status(404).send('Student not found');
            }
        } catch (err) {
            res.status(500).send('Error updating student', err);
        }
    },

    async deleteStudent(req, res) {
        try {
            const student = await Student.findByPk(req.params.id);
            if (student) {
                await student.destroy();
                res.send('Student deleted');
            } else {
                res.status(404).send('Student not found');
            }
        } catch (err) {
            res.status(500).send('Error deleting student', err);
        }
    },

    async upload(req, res) {
        try {
            // Check if any files were uploaded
            if (!req.files || Object.keys(req.files).length === 0) {
              return res.status(400).send('No files were uploaded.');
            }
                } catch (err) {
                    res.status(500).send('Error processing upload: ' + err.message);
                  }
                
    
        const file = req.files.file; // Get the uploaded file
        const workbook = xlsx.read(file.data); // Read the file from the buffer
        const sheetName = workbook.SheetNames[0];
        const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        //add data validation here
    // Example: Check if required fields exist
    const requiredFields = ['Last Name', 'First Name', 'Middle Initial', 'Department', 'ID Number'];
    const validData = sheet.filter(row => requiredFields.every(field => row[field]));

    if (validData.length !== sheet.length) {
      return res.status(400).send('Some rows have missing required fields.');
    }
    
        // Insert the rows into the database
        const promises = sheet.map(row => {
          return Student.create({
            lastName: row['Last Name'],
            firstName: row['First Name'],
            middleInitial: row['Middle Initial'],
            department: row['Department'],
            idNumber: row['ID Number']
          });
        });
    
        //Concluding the insertion
        try {
          await Promise.all(promises);
          res.status(200).send('File uploaded and data inserted successfully.');
        } catch (err) {
          res.status(500).send('Error processing upload: ' + err.message);
        }
    }
}
