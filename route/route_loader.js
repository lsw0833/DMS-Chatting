var route_loader = {};
var config = require('../config');

route_loader.init = (app,router)=> {
  initRouter(app,router);
};
function initRouter(app,router){
  var infoLen = config.route_info.length;

	for (var i = 0; i < infoLen; i++) {
		var curItem = config.route_info[i];

		var curModule = require(curItem.file);

		if (curItem.type == 'get') {
            router.route(curItem.path).get(curModule[curItem.method]);
		} else if (curItem.type == 'post') {
          router.route(curItem.path).post(curModule[curItem.method]);
		} else {
			router.route(curItem.path).post(curModule[curItem.method]);
		}
	}
    app.use('/', router);
}

module.exports = route_loader;
