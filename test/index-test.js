var them = require("../lib/index.js"),
    expect = require("chai").expect,
    sinon = require("sinon").sandbox;

var fakeModule = {
    SubClass: {
        SubSub: {}
    }
};
var fakeModule2 = {};
var myModule = {};
var myCovModule = {};

var fakeContext = {
    require: function(name) {
        if (name === "module") {
            return fakeModule;
        } else if (name === "module2") {
            return fakeModule2;
        } else if (name === "./lib/myModule.js") {
            return myModule;
        } else if (name === "./lib_cov/myModule.js") {
            return myCovModule;
        }
    }
};

describe('Them', function() {

    beforeEach(function() {
        sinon.spy(fakeContext, "require");
    });

    afterEach(function() {
        sinon.restore();
        delete process.env.THEM_LIB;
    });

    describe('#init() #list()', function() {

        it('should save map and return in list', function() {
            // given
            var module = {};
            var map = {_: "underscore"};
            them.init(module, map);

            // when
            var result = them.list();

            // then
            expect(result).to.deep.equal(map);
        });
    });

    describe('#()', function() {

        it('should require module in the context', function() {
            // given
            them.init(fakeContext, {});
            // when
            them(function(module) {
                expect(module).to.equal(fakeModule);
            });
            // then
            expect(fakeContext.require.calledOnce).to.be.true;
            expect(fakeContext.require.calledWith("module")).to.be.true;
        });

        it('should require multiple modules in the context', function() {
            // given
            them.init(fakeContext, {});
            // when
            them(function(module, module2) {
                expect(module).to.equal(fakeModule);
                expect(module2).to.equal(fakeModule2);
            });
            // then
            expect(fakeContext.require.calledTwice).to.be.true;
            expect(fakeContext.require.calledWith("module")).to.be.true;
            expect(fakeContext.require.calledWith("module2")).to.be.true;
        });

        it('should map from the map if it\'s there', function() {
            // given
            them.init(fakeContext, {
                name: "module"
            });
            // when
            them(function(name) {
                expect(name).to.equal(fakeModule);
            });
            // then
            expect(fakeContext.require.calledOnce).to.be.true;
            expect(fakeContext.require.calledWith("module")).to.be.true;
        });

        it('should require submodule', function() {
            // given
            them.init(fakeContext, {
                name: "module#SubClass"
            });
            // when
            them(function(name) {
                expect(name).to.equal(fakeModule.SubClass);
            });
            // then
            expect(fakeContext.require.calledOnce).to.be.true;
            expect(fakeContext.require.calledWith("module")).to.be.true;
        });

        it('should require sub-submodule', function() {
            // given
            them.init(fakeContext, {
                name: "module#SubClass.SubSub"
            });
            // when
            them(function(name) {
                expect(name).to.equal(fakeModule.SubClass.SubSub);
            });
            // then
            expect(fakeContext.require.calledOnce).to.be.true;
            expect(fakeContext.require.calledWith("module")).to.be.true;
        });

        it('should require local module from ./lib by default', function() {
            // given
            them.init(fakeContext, {
                name: "./myModule.js"
            });
            // when
            them(function(name) {
                expect(name).to.equal(myModule);
            });
            // then
            expect(fakeContext.require.calledOnce).to.be.true;
            expect(fakeContext.require.calledWith("./lib/myModule.js")).to.be.true;
        });

        it('should require local module from THEM_LIB environment variable', function() {
            // given
            process.env.THEM_LIB = './lib_cov';
            them.init(fakeContext, {
                name: "./myModule.js"
            });
            // when
            them(function(name) {
                expect(name).to.equal(myCovModule);
            });
            // then
            expect(fakeContext.require.calledOnce).to.be.true;
            expect(fakeContext.require.calledWith("./lib_cov/myModule.js")).to.be.true;
        });

    });

    describe('#getLib()', function() {

        it('should return the default lib folder', function() {
            // given
            them.init(fakeContext, {});
            // when
            var lib = them.getLib();
            // then
            expect(lib).to.equal("./lib");
        });

        it('should return the default lib folder', function() {
            // given
            process.env.THEM_LIB = './lib_cov';
            them.init(fakeContext, {});
            // when
            var lib = them.getLib();
            // then
            expect(lib).to.equal("./lib_cov");
        });

    });
});