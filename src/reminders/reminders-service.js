const xss = require('xss');

const RemindersService = {
    getAllReminders(db) {
      return db.from('reminders').select('*');
    },
    getVaccineById(db, id) {
      return db.from('reminders').select('*').where('id', id).first();
    },
    getReminderByUser(db, dog_id) {
      return(
        db.from('reminders').distinct('reminders.*','dog_profile.name')
        .innerJoin('dog_profile','reminders.dog_id', 'dog_profile.id')
        .where('reminders.dog_id', dog_id)    
      )     
    },
    insertReminder(db, newReminder) {
      return db
        .insert(newReminder)
        .into('reminders')
        .returning('*')
        .then(([reminder]) => reminder)
    },
    serializeReminder(reminder) {
      return {
        id: reminder.id,
        dog_id: xss(reminder.dog_id),
        reminder_name: xss(reminder.reminder_name),
        reminder_date: xss(reminder.reminder_date),
        repeat: xss(reminder.repeat),
        reminder_type: xss(reminder.reminder_type),
        reminder_note: xss(reminder.reminder_note),
      };
    },
    updateReminder(db, id, updateFields) {
      return RemindersService.getAllReminders(db).where({ id }).update(updateFields);
    }
  };
  
  module.exports = RemindersService;