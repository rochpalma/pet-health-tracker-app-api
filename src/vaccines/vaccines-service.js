const xss = require('xss');

const VaccinesService = {
    getAllVaccines(db) {
      return db.from('vaccines').select('*');
    },
    getReminderById(db, id) {
      return db.from('vaccines').select('*').where('id', id).first();
    },
    getVaccineByUser(db, dog_id) {
      return(
        db.from('vaccines').distinct('vaccines.*','dog_profile.name')
        .innerJoin('dog_profile','vaccines.dog_id', 'dog_profile.id')
        .where('vaccines.dog_id', dog_id)    
      )     
    },
    insertVaccine(db, newVaccine) {
      return db
        .insert(newVaccine)
        .into('vaccines')
        .returning('*')
        .then(([vaccine]) => vaccine)
    },
    serializeVaccine(vaccine) {
      return {
        id: vaccine.id,
        dog_id: xss(vaccine.dog_id),
        vaccine_name: xss(vaccine.vaccine_name),
        serial_number: xss(vaccine.serial_number),
      };
    },
    updateVaccine(db, id, updateFields) {
      return VaccinesService.getAllvaccines(db).where({ id }).update(updateFields);
    }
  };
  
  module.exports = VaccinesService;