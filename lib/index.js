var context;
var map;

function getParamNames(func) {
    var funStr = func.toString();
    return funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g);
}

module.exports = function(fn) {
    var functionParameters = getParamNames(fn);
    var requiredModules = [];

    functionParameters.forEach(function(name) {
        var toRequire = name;
        var subModule;
        if (map.hasOwnProperty(name)) {
            var mapped = map[name].split("#");
            toRequire = mapped[0];
            if(toRequire.substr(0, 2) === "./") {
                toRequire = module.exports.getLib() + toRequire.substr(1);
            }
            subModule = mapped[1];
        }
        if (!subModule) {
            requiredModules.push(context.require(toRequire));
        } else {
            var modules = subModule.split('.');
            if(modules.length === 2) {
                requiredModules.push(context.require(toRequire)[modules[0]][modules[1]]);
            } else {
                requiredModules.push(context.require(toRequire)[subModule]);
            }
        }
    });

    fn.apply(fn, requiredModules);

};

module.exports.init = function(that, mapping) {
    context = that;
    map = mapping;
};

module.exports.getLib = function() {
    return process.env.THEM_LIB || "./lib";
};

module.exports.list = function() {
    return map;
};
