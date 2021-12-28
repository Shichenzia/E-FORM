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
    router.post('/get_template_by_id', http.handler(logic.getTemplateById));
    router.post('/set_template_by_id', http.handler(logic.setTemplateById));
    router.post('/del_template_by_id', http.handler(logic.delTemplateById));

    router.post('/add_object', http.handler(logic.addObject));
    router.post('/add_object_values', http.handler(logic.addObjectValues));
    router.post('/get_object_values_by_id', http.handler(logic.getObjectValuesById));


  });

  app.start();
};
