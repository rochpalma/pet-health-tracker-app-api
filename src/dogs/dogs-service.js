const xss = require('xss');

const DogsService = {
    getAllDogs(db) {
      return db.from('dog_profile').select('*');
    },
    getDogById(db, id) {
      return db.from('dog_profile').select('*').where('id', id).first();
    },
    getDogsByOwnerId(db, owner_id) {
      return db.from('dog_profile').select('*').where('owner_id', owner_id);
    },
    insertDog(db, newDog) {
      return db
        .insert(newDog)
        .into('dog_profile')
        .returning('*')
        .then(([dog]) => dog)
        .then((dog) => DogsService.getDogById(db, dog.id));
    },
    serializeDog(dog) {
      return {
        id: dog.id,
        name: xss(dog.name),
        birthdate: xss(dog.birthdate),
        breed: xss(dog.breed),
        gender: xss(dog.gender),
        city: xss(dog.city),
        picture: xss(dog.picture),
        spayed: xss(dog.spayed),
        owner_id: xss(dog.owner_id)
      };
    },
    updateDog(db, id, updateFields) {
      return db.from('dog_profile').select('*').where({ id }).update(updateFields);
    }
  };
  
  module.exports = DogsService;