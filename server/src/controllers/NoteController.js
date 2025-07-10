module.exports = {
  async createNote(req, res) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Only admins can create notes' });
  }

  try {
    const { Note, User } = require('../models');

    const note = await Note.create({
      content: req.body.content,
      userId: req.user.id
    });

    // Re-fetch the note with author included
    const noteWithAuthor = await Note.findByPk(note.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['username']
      }]
    });

    // ✅ Emit enriched note with author info
    req.app.get('io').emit('new-note', noteWithAuthor);

    // Send to the one who created it as well
    res.status(201).send(noteWithAuthor);
  } catch (err) {
    res.status(500).send('Error creating note: ' + err.message);
  }
},

  async getAllNotes(req, res) {
    try {
      const { Note, User } = require('../models');
      const notes = await Note.findAll({
        include: [{
          model: User,
          as: 'author',
          attributes: ['username']
        }],
        order: [['createdAt', 'DESC']]
      });
      res.send(notes);
    } catch (err) {
      res.status(500).send('Error fetching notes: ' + err.message);
    }
  },

  async markAsRead(req, res) {
    try {
      const { User } = require('../models');
      await User.update(
        { lastNoteReadAt: new Date() },
        { where: { id: req.user.id } }
      );
      res.send({ success: true });
    } catch (err) {
      res.status(500).send('Error updating read status: ' + err.message);
    }
  }
};