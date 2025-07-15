// DashboardController.js
const db = require('../models');

module.exports = {
getFinesDistribution: async (req, res) => {
  try {
    const eventId = req.query.eventId;  // Read eventId from the query string

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    console.log('Event ID received:', eventId);  // Debugging line

    // Get total students
    const totalStudents = await db.Student.count();

    // Get students with fines (absent and unpaid)
    const withFines = await db.Fine.count({
      where: {
        event_id: eventId,  // Use eventId from query parameter
        status: 'absent',
        paid: 0  // Assuming paid is stored as 0 for unpaid
      }
    });

    res.json({
      totalStudents,
      withFines,
      withoutFines: totalStudents - withFines
    });
  } catch (error) {
    console.error('Error fetching fines distribution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
,

getFinesOverTime: async (req, res) => {
  try {
    const { startYear, endYear } = req.query;

    if (!startYear || !endYear) {
      return res.status(400).json({ error: 'Missing startYear or endYear query parameters' });
    }

    // Use full years (Jan 1 to Dec 31)
    const startDate = new Date(`${startYear}-01-01`);
    const endDate = new Date(`${endYear}-12-31`);

    const fines = await db.Fine.findAll({
      include: [{
        model: db.Event,
        where: {
          date: {
            [db.Sequelize.Op.between]: [startDate, endDate]
          }
        }
      }]
    });

    const result = {
      '1st Semester': 0,
      '2nd Semester': 0,
      'Summer': 0
    };

    fines.forEach(fine => {
      const semester = fine.Event.semester;
      if (result[semester] !== undefined) {
        result[semester] += parseFloat(fine.amount);
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching fines over time:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
},

  getAttendanceByCourse: async (req, res) => {
    try {
      const eventId = req.query.eventId;
      
      const courses = ['BSIT', 'BSIS', 'BSCS'];
      const result = [];
      
      for (const course of courses) {
        const students = await db.Student.findAll({
          where: { department: course },
          include: [{
            model: db.Fine,
             as: 'fines',
            where: { event_id: eventId },
            required: false
          }]
        });
        
        let attended = 0;
        let absent = 0;
        
        students.forEach(student => {
          const fineRecord = student.fines.find(f => f.event_id === eventId);
          if (fineRecord && fineRecord.status === 'present') {
            attended++;
          } else {
            absent++;
          }
        });
        
        result.push({
          course,
          attended,
          absent
        });
      }
      
      res.json(result);
    } catch (error) {
      console.error('Error fetching attendance by course:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getStudentDistribution: async (req, res) => {
    try {
      const distribution = await db.Student.findAll({
        attributes: [
          'department',
          [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
        ],
        group: ['department']
      });
      
      res.json(distribution);
    } catch (error) {
      console.error('Error fetching student distribution:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};