import * as db from './db';
import app from './app';

export default function bootstrap() {
  const port = process.env.PORT || 5050;
  return Promise.resolve()
    .then(db.connect)
    .then(() => {
      app.listen(port, () => {
        console.log('Running on port:', port);
      });
    });
}
