const xss = require('xss');

const EventsService = {
    getAllEvents(db) {
      return db.from('events').select('*');
    },
    getEventById(db, id) {
      return db.from('events').select('*').where('id', id).first();
    },
    getEventsByUser(db, dog_id) {
      return(
        db.from('events').distinct('events.*','dog_profile.name')
        .innerJoin('dog_profile','events.dog_id', 'dog_profile.id')
        .where('events.dog_id', dog_id)    
      )     
    },
    insertEvent(db, newEvent) {
      return db
        .insert(newEvent)
        .into('events')
        .returning('*')
        .then(([event]) => event)
       // .then((event) => EventsService.getEventById(db, event.id));
    },
    serializeEvent(event) {
      return {
        id: event.id,
        note_type: xss(event.note_type),
        event_note: xss(event.event_note),
        event_date: xss(event.event_date),
        dog_id: xss(event.dog_id)
      };
    },
    updateEvent(db, id, updateFields) {
      return EventsService.getAllEvents(db).where({ id }).update(updateFields);
    }
  };
  
  module.exports = EventsService;