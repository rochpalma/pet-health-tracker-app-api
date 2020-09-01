const xss = require('xss');

const NotesService = {
    getAllNotes(db) {
      return db.from('notes').select('*');
    },
    getNotesById(db, id) {
      return db.from('notes').select('*').where('id', id).first();
    },
    getNoteByUser(db, dog_id) {
      return(
        db.from('notes').distinct('notes.*','dog_profile.name')
        .innerJoin('dog_profile','notes.dog_id', 'dog_profile.id')
        .where('notes.dog_id', dog_id)    
      )     
    },
    insertNote(db, newNote) {
      return db
        .insert(newNote)
        .into('notes')
        .returning('*')
        .then(([note]) => note)
    },
    serializeNote(note) {
      return {
        id: note.id,
        dog_id: xss(note.dog_id),
        event_name: xss(note.event_name),
        note: xss(note.note),
        note_type: xss(note.note_type),
      };
    },
    updateNote(db, id, updateFields) {
      return NotesService.getAllNotes(db).where({ id }).update(updateFields);
    }
  };
  
  module.exports = NotesService;