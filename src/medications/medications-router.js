const express = require('express');
const MedicationsService = require('./medications-service');
const medicationsRouter = express.Router();
const jsonParser = express.json();

medicationsRouter
  .route('/')
  .get((req, res, next) => {
    MedicationsService.getAllMedications(req.app.get('db'))
      .then((medications) => {
        res.json(medications.map(MedicationsService.serializeMedication));
      })

      .catch(next);
  })
.post(jsonParser, (req, res, next) => {
    const { medicine_id, dog_id, dosage_amount, dosage_unit, medication_note } = req.body;
    const newMedication = { medicine_id, dog_id, dosage_amount, dosage_unit, medication_note };

    for (const [key, value] of Object.entries(newMedication)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }
    
    MedicationsService.insertMedication(req.app.get('db'), newMedication).then(
        (medication) => {
          res.status(201).json(MedicationsService.serializeMedication(medication));
        })
        .catch(next);
  });

  medicationsRouter
  .route('/medlist')
  .get((req, res, next) => {
    MedicationsService.getAllMedicationList(req.app.get('db'))
      .then((medications) => {
        res.json(medications.map(MedicationsService.serializeMedicationList));
      })

      .catch(next);
  })

  medicationsRouter
  .route('/:medication_id')
  .all((req, res, next) => {
    MedicationsService.getMedicationById(req.app.get('db'), req.params.medication_id).then(
      (medication) => {
        if (!medication) {
          return res
            .status(404)
            .json({ error: { message: `medication doesn't exist` } });
        }
        res.medication = medication;
        next();
      }
    );
  })
  .get((req, res, next) => {
    res.json(MedicationsService.serializeMedications(res.medication));
  })
  .patch(jsonParser, (req, res, next) => {
    const {
        medicine_id, 
        dosage_amount, 
        dosage_unit, 
        medication_note
    } = req.body;
    const medToUpdate = {
        medicine_id, 
        dosage_amount, 
        dosage_unit, 
        medication_note
    };

    MedicationsService.updateMedication(req.app.get('db'), req.params.medication_id, medToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = medicationsRouter;