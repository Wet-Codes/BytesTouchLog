const { Fine,Event } = require('../models');

module.exports = {


updateAttendance: async (req, res) => {
  try {
    const { studentId, eventId, status } = req.body;
    
    // Get the event to access its fee
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Calculate amount based on attendance status
    const amount = status === 'present' ? 0 : event.fee;
    
    // Find or create fine record
    const [fine, created] = await Fine.findOrCreate({
      where: { student_id: studentId, event_id: eventId },
      defaults: {
        amount,
        status,
        paid: (status === 'present') // Only mark paid if present
      }
    });

    if (!created) {
      // Update existing record
      await fine.update({
        amount,
        status,
        paid: (status === 'present')
      });
    }

    res.json(fine);
  } catch (error) {
    console.error('Error in createOrUpdateFine:', error);
    res.status(400).json({ 
      errors: 'Invalid data',
      details: error.message 
    });
  }
},

  getEventFines: async (req, res) => {
  try {
    const fines = await Fine.findAll({
  where: { student_id: req.params.studentId },
  include: [{
    model: Event,
    as: 'event',
   
    attributes: ['name', 'date', 'fee']
  }]
})
    res.json(fines);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
},

  deleteFine: async (req, res) => {
    try {
      const deleted = await Fine.destroy({
        where: { id: req.params.id }
      });
      
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Fine not found' });
      }
    } catch (error) {
      res.status(500).json({ error});
    }
  },


 // Add this method
getAttendanceForEvent: async (req, res) => {
  try {
    const attendance = await Fine.findAll({
      where: { event_id: req.params.eventId },
      attributes: ['student_id', 'status']
    });
    
    // Convert to simple key-value map
    const attendanceMap = {};
    attendance.forEach(record => {
      attendanceMap[record.student_id] = record.status;
    });
    
    res.json(attendanceMap);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
},

// Update the updateAttendance method



getStudentFines: async (req, res) => {
  try {
    // Add ID validation
    if (!req.params.studentId || isNaN(req.params.studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }
    
    const studentId = parseInt(req.params.studentId);
    const fines = await Fine.findAll({
      where: { student_id: studentId },
      include: [
        {
          model: Event,
          as: 'event',
          attributes: ['name', 'date', 'fee']
        }
      ]
    });
    res.json(fines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},


clearStudentFines: async (req, res) => {
  try {
    const { studentId } = req.params;
    await Fine.update(
      { paid: true },
      { 
        where: { 
          student_id: studentId,
          status: 'absent',
          paid: false
        } 
      }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error });
  }
},



};
