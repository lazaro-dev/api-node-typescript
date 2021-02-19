import { SetupServer } from './server';
import config from 'config';

//criado e chamando a função (self invoked functional)
(async(): Promise<void> => {
  const server = new SetupServer(config.get('App.port'));
  await server.init();
  server.start();
})();
