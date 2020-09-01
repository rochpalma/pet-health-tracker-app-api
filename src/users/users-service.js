const xss = require('xss');
const bcrypt = require('bcryptjs');

const strongRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})[\S]+/;

const UsersService = {
    getAllUsers(db) {
      return db.from('users').select('*');
    },
    getUserById(db, id) {
      return db.from('users').select('*').where('id', id).first();
    },
    getUserByEmail(db, email) {
      return db.from('users').select('*').where('email', email).first();
    },
    insertUser(db, newUser) {
      return db
        .insert(newUser)
        .into('users')
        .returning('*')
        .then(([user]) => user)
        .then((user) => UsersService.getUserById(db, user.id));
    },
    serializeUser(user) {
      return {
        id: user.id,
        email: xss(user.email),
        password: xss(user.password),
        full_name: xss(user.full_name),
      };
    },
    updateUser(db, id, updateFields) {
      return UsersService.getAllUsers(db).where({ id }).update(updateFields);
    },
    hashPassword(password) {
      return bcrypt.hash(password, 12);
    },
    hasExistingEmail(db, email) {
      return db('users')
        .where({ email })
        .first()
        .then((user) => !!user);
    },
    validatePassword(password) {
      if (password.length < 8) {
        return 'Password must be atleast 8 characters';
      }
      if (!strongRegex.test(password)) {
        return 'Password must contain uppercase letter, lowercase letter, number, and special character';
      }
      return null;
    },
  };
  
  module.exports = UsersService;
