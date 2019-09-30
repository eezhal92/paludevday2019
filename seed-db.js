require('dotenv').config();
import User from './src/models/User';

const mongoose = require('mongoose');

connect()
  .then(deleteUsers)
  .then(seedUsers)
  .then(() => process.exit())

function connect() {
  return mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });
}

function deleteUsers() {
  return User.deleteMany({});
}

function seedUsers() {
  const users  = getUsers();
  const promises = [];
  users.forEach((user) => {
    promises.push(User.create(user));
  })

  return Promise.all(promises);
}

function getUsers() {
  return [
    {
      _id: '5d9099353250a60dfb51139c',
      email: 'ijal@paludevday.com',
      name: 'Ijal',
      password: 'mypassword',
      activated: true,
      role: 'admin',
    },
    {
      _id: '5d917a7cd66dd11e1c8ea55d',
      email: 'arif@paludevday.com',
      name: 'Arif Suganda',
      password: 'semangka',
      activated: true,
      role: 'admin',
    },
    {
      _id: '5d917a8cd66dd11e1c8ea55e',
      email: 'algol@paludevday.com',
      password: 'ayobelajar',
      name: 'Algol',
      activated: true,
      role: 'admin',
    },
    {
      _id: '5d917abad66dd11e1c8ea55f',
      email: 'ayub@paludevday.com',
      password: 'desainkeren',
      name: 'Ayub',
      activated: true,
      role: 'admin',
    },
    {
      _id: '5d917ad7d66dd11e1c8ea560',
      email: 'fandi@paludevday.com',
      password: 'jalanjalan',
      name: 'Fandi',
      activated: true,
      role: 'admin',
    },
    {
      _id: '5d917af4d66dd11e1c8ea561',
      email: 'dwi@paludevday.com',
      password: 'marimenabung',
      name: 'Dwi',
      activated: true,
      role: 'admin',
    },
    {
      _id: '5d917b3cd66dd11e1c8ea562',
      email: 'adrin@paludevday.com',
      password: 'semangat',
      name: 'Adrin',
      activated: true,
      role: 'admin',
    },
    {
      _id: '5d917b62d66dd11e1c8ea563',
      email: 'akwan@paludevday.com',
      password: 'belajarlagi',
      name: 'Akwan',
      activated: true,
      role: 'organizer',
    },
    {
      _id: '5d917b78d66dd11e1c8ea564',
      email: 'syaikhan@paludevday.com',
      password: 'belajarlagi',
      name: 'Syaikhan',
      activated: true,
      role: 'organizer',
    },
    {
      _id: '5d917b97d66dd11e1c8ea565',
      email: 'himastatistik@paludevday.com',
      password: 'statistikakeren',
      name: 'HIMA Statistika',
      activated: true,
      role: 'partner',
    },
    {
      _id: '5d917ba2d66dd11e1c8ea566',
      email: 'agrc@paludevday.com',
      password: 'robotjuara',
      name: 'AGRC',
      activated: true,
      role: 'partner',
    },
    {
      _id: '5d917bcbd66dd11e1c8ea567',
      email: 'bersamakami@paludevday.com',
      password: 'spreadgoodness',
      name: 'BersamaKami',
      activated: true,
      role: 'partner',
    },
  ];
}
