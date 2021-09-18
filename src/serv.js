'use strict';

const { libs, runtime } = nodex;
const { http } = libs;
const { logic } = runtime;

exports.init = async function (args) {
  console.log('serv init.');
  console.log('serv init args:', args);
  console.log('runtime:', runtime);

  const app = http.webapp(args);

  app.route(router => {
    router.get('/', http.handler(logic.helloWorld));

    router.post('/add_template', http.handler(logic.addTemplate));
    router.post('/update_template_by_id', http.handler(logic.updateTemplateById));
    router.post('/select_template_by_id', http.handler(logic.selectTemplateById));
    router.post('/del_template_by_id', http.handler(logic.delTemplateById));

  });

  app.start();
};
