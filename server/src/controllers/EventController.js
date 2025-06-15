module.exports = {
   async getAllEvents(req, res) {
    console.log('[GET /events] Started fetching events');
    try {
      const { Event } = require('../models');

      const events = await Event.findAll({
        attributes: ['eventId', 'name', 'semester', 'date', 'fee'],
      });

      console.log(`[GET /events] Successfully fetched ${events.length} events`);
      res.send(events);
    } catch (err) {
      console.error('[GET /events] Error:', {
        message: err.message,
        stack: err.stack,// Check DB connection
        modelExists: !!Event,
        rawError: err
      });
      res.status(500).send('Error fetching events: ' + err.message);
    }
  },

  async createEvent(req, res) {
    try {
       const { Event } = require('../models');
      const event = await Event.create({
        name: req.body.name,
        semester: req.body.semester,
        fee: req.body.fee,
        date: req.body.date

      });
      res.status(201).send({
        eventId: event.eventId,
        name: event.name,
        semester: event.semester,
        fee: event.fee ,
        date: event.date
      });
    } catch (err) {
      res.status(500).send('Error creating event: ' + err.message);
    }
  },

  async updateEvent(req, res) {
  console.log('[PUT /events/:eventId] Incoming request to update event');
  console.log('[PUT /events/:eventId] Request params:', req.params);
  console.log('[PUT /events/:eventId] Request body:', req.body);

  if (!req.body || Object.keys(req.body).length === 0) {
    console.warn('[PUT /events/:eventId] Empty request body');
    return res.status(400).send('No data provided to update');
  }
  
  try {
    const { Event } = require('../models');

    const [updated] = await Event.update(req.body, {
      where: { eventId: req.params.eventId }
    });

    if (updated) {
      const updatedEvent = await Event.findByPk(req.params.eventId);
      console.log('[PUT /events/:eventId] Successfully updated event:', updatedEvent);
      res.send(updatedEvent);
    } else {
      console.warn('[PUT /events/:eventId] Event not found for ID:', req.params.eventId);
      res.status(404).send('Event not found');
    }
  } catch (err) {
    console.error('[PUT /events/:eventId] Error updating event:', {
      message: err.message,
      stack: err.stack,
      rawError: err
    });
    res.status(500).send('Error updating event: ' + err.message);
  }
}

};