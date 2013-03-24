## Demo example

Instead of doing this

```js
var http = require('http'),
    myModule = require('./lib/myModule'),
    User = require('./lib/models').User;
    
// rest of your code
```

you do

```js
require("them")(function(http, myModule, User) {
  // rest of you code
})
```

## The goals I wanted to achieve with this library

* Avoid redundand pattern of require
* Have centralized, relative to the root require
* Contistent naming across my application
* Configurable require for test and coverage
* Stop the "where the comma should go" debate

## Warning before use

* Do not use in libraries or modules, but you can safely use it in your application. 
* This library is quite young, please be careful and patient. 

## Installation

    npm install them --save
    
## Initialization

You must initialize *them* before you use it, because you have to tell what is your root module and all the required modules should be relative to that.

```js
require('them').init(module, [mapping]);
```
* module: do not change it, you have to pass the module
* mapping: a simple which contains mapping between name and module if it doesn't match.

Example:

```js
require('them').init(module, {
    _: "underscore",
    email: "./services/email",
    User: "./models/models#User",
});
```

## Usage

Example
```js
require("them")(function(http, _, email, User) {
  // you code
});
```

## Features

* Automatically require module based on the parameter name
* You have to configure manually your own submodules to be requirable, by default it search from the ./lib/ directory
* You can change the default library directory with *THEM_LIB* environment variable. It's useful for coverage
