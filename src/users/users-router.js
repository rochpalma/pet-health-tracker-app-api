const express = require('express');
const UsersService = require('./users-service');
const { requireAuth } = require('../middleware/jwt-auth');

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
  .route('/')
  .get((req, res, next) => {
    UsersService.getAllUsers(req.app.get('db'))
      .then((users) => {
        res.json(users.map(UsersService.serializeUser));
      })

      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { full_name, email, password } = req.body;
    const newUser = { full_name, email, password };

    for (const [key, value] of Object.entries(newUser)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }

    const passwordError = UsersService.validatePassword(password);

    if (passwordError)
      return res.status(400).json({ error: { message: passwordError } });

    UsersService.hasExistingEmail(req.app.get('db'), email).then(
      (hasExistingEmail) => {
        if (hasExistingEmail)
          return res
            .status(400)
            .json({ error: { message: `Email already exists` } });

        return UsersService.hashPassword(password)
          .then((hashedPassword) => {
            const newUser = {
              full_name,
              email,
              password: hashedPassword,
            };

            return UsersService.insertUser(req.app.get('db'), newUser).then(
              (user) => {
                res.status(201).json(UsersService.serializeUser(user));
              }
            );
          })
          .catch(next);
      }
    );
  });

usersRouter.route('/getdetails').get(requireAuth, (req, res) => {
  res.send(req.user);
});

usersRouter
  .route('/:user_id')
  //.all(requireAuth)
  .all((req, res, next) => {
    UsersService.getUserById(req.app.get('db'), req.params.user_id).then(
      (user) => {
        if (!user) {
          return res
            .status(404)
            .json({ error: { message: `User doesn't exist` } });
        }
        res.user = user;
        next();
      }
    );
  })
  .get((req, res, next) => {
    res.json(UsersService.serializeUser(res.user));
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      full_name,
      email,
      password,
      mobile,
      home
    } = req.body;
    const passwordError = UsersService.validatePassword(password);
    
    if (passwordError)
      return res.status(400).json({ error: { message: passwordError } });

         UsersService.hashPassword(password)
          .then((hashedPassword) => {
            const userToUpdate = {
              full_name,
              email,
              password: hashedPassword,
              mobile,
              home
            }
    
          return  UsersService.updateUser(req.app.get('db'), req.params.user_id, userToUpdate)
            .then((numRowsAffected) => {
              res.status(204).end();
        })
      })
  })
  // .catch(next);


module.exports = usersRouter;