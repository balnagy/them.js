var context;
var map;

function getParamNames(func) {
    var funStr = func.toString();
    return funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g);
}

module.exports = function(fn) {
    var functionParameters = getParamNames(fn);
    var requiredModules = [];
    var lib = process.env.THEM_LIB || "./lib";

    functionParameters.forEach(function(name) {
        var toRequire = name;
        var subModule;
        if (map.hasOwnProperty(name)) {
            var mapped = map[name].split("#");
            toRequire = mapped[0];
            if(toRequire.substr(0, 2) === "./") {
                toRequire = lib + toRequire.substr(1);
            }
            subModule = mapped[1];
        }
        if (!subModule) {
            requiredModules.push(context.require(toRequire));
        } else {
            requiredModules.push(context.require(toRequire)[subModule]);
        }
    });

    fn.apply(fn, requiredModules);

};

module.exports.init = function(that, mapping) {
    context = that;
    map = mapping;
};

module.exports.list = function() {
    return map;
};