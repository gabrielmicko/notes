import Express from 'express';
import GraphHTTP from 'express-graphql';
import SchemaNotes from './schema';
import Cors from 'cors';
import Config from '../Config/config.json';

const app = Express();

app.use(
  '/api',
  Cors(),
  GraphHTTP({
    schema: SchemaNotes,
    pretty: true,
    graphiql: true
  })
);

app.listen(Config.graphQLPort, () => {
  console.log(`App is listening on port ${Config.graphQLPort}`);
});
