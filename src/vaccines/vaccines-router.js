const express = require('express');
const VaccinesService = require('./vaccines-service');
const vaccinesRouter = express.Router();
const jsonParser = express.json();

vaccinesRouter
  .route('/')
  .get((req, res, next) => {
    VaccinesService.getAllVaccines(req.app.get('db'))
      .then((vaccine) => {
        res.json(vaccine.map(VaccinesService.serializeVaccine));
      })

      .catch(next);
  })
.post(jsonParser, (req, res, next) => {
    const { dog_id, vaccine_name , expiration_date, serial_number } = req.body;
    const newVaccine = { dog_id, vaccine_name , expiration_date, serial_number };

    for (const [key, value] of Object.entries(newVaccine)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }
    
    VaccinesService.insertVaccine(req.app.get('db'), newVaccine).then(
        (vaccine) => {
          res.status(201).json(VaccinesService.serializeVaccine(vaccine));
        })
        .catch(next);
  });

  vaccinesRouter
  .route('/:vaccine_id')
  .all((req, res, next) => {
    VaccinesService.getVaccineById(req.app.get('db'), req.params.vaccine_id).then(
      (vaccine) => {
        if (!vaccine) {
          return res
            .status(404)
            .json({ error: { message: `vaccine doesn't exist` } });
        }
        res.vaccine = vaccine;
        next();
      }
    );
  })
  .get((req, res, next) => {
    res.json(VaccinesService.serializeVaccine(res.vaccine));
  })
  .patch(jsonParser, (req, res, next) => {
    const {
        vaccine_name, 
        expiration_date, 
        serial_number 
    } = req.body;
    const vaccineToUpdate = {
        vaccine_name, 
        expiration_date, 
        serial_number 
    };

    VaccinesService.updateVaccine(req.app.get('db'), req.params.vaccine, vaccineToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = vaccinesRouter;