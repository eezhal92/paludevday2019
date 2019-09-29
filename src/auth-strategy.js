import User from './models/User';

export function localStrategyHandler (email, password, callback) {
  User.findOne({
    email,
    password,
  })
    .then((user) => {
      if (!user) {
        return callback(null, false);
      }

      callback(null, user);
    })
    .catch(err => callback(err));
}

export function serializeUser (user, callback) {
  callback(null, user._id);
}

export function deserializeUser (id, callback) {
  User.findById(id)
    .then((user) => callback(null, user))
    .catch(error => callback(error));
}
