import Express from 'express';
import GraphHTTP from 'express-graphql';
import SchemaNotes from './schema';
import Cors from 'cors';


const APP_PORT = 3100;
const app = Express();

app.use('/api', Cors(), GraphHTTP({
  schema: SchemaNotes,
  pretty: true,
  graphiql: true,
}));

app.listen(APP_PORT, () => {
  console.log(`App is listening on port ${APP_PORT}`);
});
