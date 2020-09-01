const xss = require('xss');

const MedicationsService = {
    getAllMedications(db) {
      return db.from('medication').select('*');
    },
    getMedicationById(db, id) {
      return db.from('medication').select('*').where('id', id).first();
    },
    getMedicationByUser(db, dog_id) {
      return(
        db.from('medication').distinct('medication.*','dog_profile.name')
        .innerJoin('dog_profile','medication.dog_id', 'dog_profile.id')
        .where('medication.dog_id', dog_id)    
      )     
    },
    insertMedication(db, newMedication) {
      return db
        .insert(newMedication)
        .into('medication')
        .returning('*')
        .then(([medication]) => medication)
       // .then((event) => MedicationsService.getEventById(db, event.id));
    },
    serializeMedication(medication) {
      return {
        id: medication.id,
        medicine_id: xss(medication.medicine_id),
        dog_id: xss(medication.dog_id),
        dosage_amount: xss(medication.dosage_amount),
        dosage_unit: xss(medication.dosage_unit),
        medication_note: xss(medication.medication_note),
        dog_id: xss(medication.dog_id)
      };
    },
    serializeMedicationList(medication) {
        return {
          id: medication.id,
          medicine: xss(medication.medicine),
        };
      },
    updateMedication(db, id, updateFields) {
      return MedicationsService.getAllMedications(db).where({ id }).update(updateFields);
    }
  };
  
  module.exports = MedicationsService;