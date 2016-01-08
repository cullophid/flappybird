(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GRAVITY = exports.GRAVITY = 0.25;
var SPEED = exports.SPEED = 2;
var SCREEN_WIDTH = exports.SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = exports.SCREEN_HEIGHT = 600;
var PIPE_MIN_SPACE = exports.PIPE_MIN_SPACE = 80;
var PIPE_PROBABILITY = exports.PIPE_PROBABILITY = 0.7;
var GAP_SIZE = exports.GAP_SIZE = 120;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawBox = exports.clear = undefined;

var _config = require('../config');

var ctx = document.getElementById('main').getContext('2d');

// () -> undefined
var clear = exports.clear = function clear() {
  return ctx.clearRect(0, 0, _config.SCREEN_WIDTH, _config.SCREEN_HEIGHT);
};

// Box -> undefined
var drawBox = exports.drawBox = function drawBox(_ref) {
  var color = _ref.color;
  var width = _ref.width;
  var height = _ref.height;
  var x = _ref.x;
  var y = _ref.y;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
};

},{"../config":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Box -> Boolean
var boxHitScreenEdge = exports.boxHitScreenEdge = function boxHitScreenEdge(screenHeight) {
  return function (_ref) {
    var y = _ref.y;
    var height = _ref.height;
    return y + height > screenHeight || y < 0;
  };
};

// Box -> Box -> Boolean
var boxCollision = exports.boxCollision = function boxCollision(a) {
  return function (b) {
    return a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height;
  };
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.move = exports.fall = undefined;

var _util = require('../util');

// Number -> Element -> Element
var fall = exports.fall = function fall(gravity) {
  return function (e) {
    return (0, _util.merge)(e, { y: e.y + e.accl, accl: e.accl + gravity });
  };
};

// Number-> Element -> Element
var move = exports.move = function move(d) {
  return function (e) {
    return (0, _util.merge)(e, { x: e.x + d });
  };
};

},{"../util":11}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pipeFactory = exports.birdFactory = undefined;

var _config = require('./config');

// () -> Bird
var birdFactory = exports.birdFactory = function birdFactory() {
  return {
    color: 'red',
    x: _config.SCREEN_WIDTH / 2,
    y: _config.SCREEN_HEIGHT / 2,
    accl: 0,
    width: 30,
    height: 30
  };
};

// Number -> [Pipe]
var createPipe = function createPipe(gap) {
  return [{
    color: 'green',
    x: _config.SCREEN_WIDTH,
    y: 0,
    width: 50,
    height: gap - _config.GAP_SIZE / 2
  }, {
    color: 'green',
    x: 800,
    y: gap + _config.GAP_SIZE / 2,
    width: 50,
    height: _config.SCREEN_HEIGHT - (gap + 50)
  }];
};

// () -> [Pipe]
var pipeFactory = exports.pipeFactory = function pipeFactory() {
  return createPipe(Math.random() * (_config.SCREEN_HEIGHT - 2 * _config.GAP_SIZE) + _config.GAP_SIZE);
};

},{"./config":1}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config');

var _util = require('./util');

var _collision = require('./dsl/collision');

// Box -> Boolean
var boxHitEdge = (0, _collision.boxHitScreenEdge)(_config.SCREEN_HEIGHT);

exports.default = function (_ref) {
  var bird = _ref.bird;
  var pipes = _ref.pipes;
  return boxHitEdge(bird) || (0, _util.any)((0, _collision.boxCollision)(bird), pipes);
};

},{"./config":1,"./dsl/collision":3,"./util":11}],7:[function(require,module,exports){
'use strict';

var _tick = require('./tick');

var _tick2 = _interopRequireDefault(_tick);

var _util = require('./util');

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

var _simulate = require('./simulate');

var _simulate2 = _interopRequireDefault(_simulate);

var _factories = require('./factories');

var _gameOver = require('./gameOver');

var _gameOver2 = _interopRequireDefault(_gameOver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Model -> Boolean

var model = {
  bird: (0, _factories.birdFactory)(),
  pipes: []
};

var flap = function flap() {
  return model = (0, _util.merge)(model, { bird: (0, _util.merge)(model.bird, { accl: -6 }) });
};

document.addEventListener('click', flap);
document.addEventListener('keypress', flap);

(0, _tick2.default)(function (i) {
  model = (0, _simulate2.default)(i, model);
  if ((0, _gameOver2.default)(model)) window.location.reload();
  (0, _render2.default)(model);
});

},{"./factories":5,"./gameOver":6,"./render":8,"./simulate":9,"./tick":10,"./util":11}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

var _canvas = require('./dsl/canvas');

exports.default = function (model) {
  (0, _canvas.clear)();
  (0, _util.map)(_canvas.drawBox, model.pipes);
  (0, _canvas.drawBox)(model.bird);
};

},{"./dsl/canvas":2,"./util":11}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

var _config = require('./config');

var _physics = require('./dsl/physics');

var _factories = require('./factories');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// [Pipe] -> [Pipe]
var movePipes = function movePipes(pipes) {
  return (0, _util.map)((0, _physics.move)(-_config.SPEED), pipes);
};

// Element -> Element
var freeFall = (0, _physics.fall)(_config.GRAVITY);

// Number -> [Pipe] -> [Pipe]
var addPipe = function addPipe(tick, pipes) {
  return tick % _config.PIPE_MIN_SPACE === 0 && Math.random() > _config.PIPE_PROBABILITY ? [].concat(_toConsumableArray(pipes), _toConsumableArray((0, _factories.pipeFactory)())) : pipes;
};

// [Pipe] -> [Pipe]
var filterPipes = function filterPipes(pipes) {
  return (0, _util.filter)(function (_ref) {
    var x = _ref.x;
    var width = _ref.width;
    return x + width >= 0;
  }, pipes);
};

// Number -> Model -> [Pipe]
var simulatePipes = (0, _util.compose)(filterPipes, (0, _util.compose)(movePipes, addPipe));

// Number -> Model -> Model§

exports.default = function (tick, m) {
  return (0, _util.merge)(m, {
    bird: freeFall(m.bird),
    pipes: simulatePipes(tick, m.pipes)
  });
};

},{"./config":1,"./dsl/physics":4,"./factories":5,"./util":11}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (f) {
  var i = 0;
  var loop = function loop() {
    window.requestAnimationFrame(loop);
    f(i++);
  };

  loop();
};

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// [a] -> a
var head = exports.head = function head(list) {
  return list[0];
};
// [a] -> [a]
var tail = exports.tail = function tail(list) {
  return list.slice(1);
};
// {k:v} -> {k:v} -> {k:v}
var merge = exports.merge = function merge(a, b) {
  return Object.assign({}, a, b);
};

// ((y -> z), (a...x -> y)) -> (a...x -> z)
var compose = exports.compose = function compose(f, g) {
  return function () {
    return f(g.apply(undefined, arguments));
  };
};

// ((a, b) -> a) -> a -> [b] -> a
var reduce = exports.reduce = function reduce(f, init, list) {
  return list.length === 0 ? init : reduce(f, f(init, head(list)), tail(list));
};

// ((a -> b), [a]) -> [b]
var map = exports.map = function map(f, list) {
  return reduce(function (r, e) {
    return [].concat(_toConsumableArray(r), [f(e)]);
  }, [], list);
};
// ((a -> Boolean), [a]) -> [a]
var filter = exports.filter = function filter(f, list) {
  return reduce(function (r, e) {
    return f(e) ? [].concat(_toConsumableArray(r), [e]) : r;
  }, [], list);
};

// ((a -> Boolean), [a]) -> Boolean
var any = exports.any = function any(f, list) {
  return reduce(function (r, e) {
    return r || f(e);
  }, false, list);
};

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2RzbC9jYW52YXMuanMiLCJzcmMvanMvZHNsL2NvbGxpc2lvbi5qcyIsInNyYy9qcy9kc2wvcGh5c2ljcy5qcyIsInNyYy9qcy9mYWN0b3JpZXMuanMiLCJzcmMvanMvZ2FtZU92ZXIuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9yZW5kZXIuanMiLCJzcmMvanMvc2ltdWxhdGUuanMiLCJzcmMvanMvdGljay5qcyIsInNyYy9qcy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBTyxJQUFNLE9BQU8sV0FBUCxPQUFPLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLElBQU0sS0FBSyxXQUFMLEtBQUssR0FBRyxDQUFDLENBQUE7QUFDZixJQUFNLFlBQVksV0FBWixZQUFZLEdBQUcsR0FBRyxDQUFBO0FBQ3hCLElBQU0sYUFBYSxXQUFiLGFBQWEsR0FBRyxHQUFHLENBQUE7QUFDekIsSUFBTSxjQUFjLFdBQWQsY0FBYyxHQUFHLEVBQUUsQ0FBQTtBQUN6QixJQUFNLGdCQUFnQixXQUFoQixnQkFBZ0IsR0FBRyxHQUFHLENBQUE7QUFDNUIsSUFBTSxRQUFRLFdBQVIsUUFBUSxHQUFHLEdBQUcsQ0FBQTs7Ozs7Ozs7Ozs7O0FDTDNCLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQzs7O0FBQUEsQUFHckQsSUFBTSxLQUFLLFdBQUwsS0FBSyxHQUFHLFNBQVIsS0FBSztTQUFTLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFKckMsWUFBWSxVQUFFLGFBQWEsQ0FJd0M7Q0FBQTs7O0FBQUEsQUFHcEUsSUFBTSxPQUFPLFdBQVAsT0FBTyxHQUFHLFNBQVYsT0FBTyxPQUFxQztNQUFoQyxLQUFLLFFBQUwsS0FBSztNQUFF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LENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUFBOzs7QUFBQSxBQUdoRSxJQUFNLEdBQUcsV0FBSCxHQUFHLEdBQUcsU0FBTixHQUFHLENBQUksQ0FBQyxFQUFFLElBQUk7U0FBSyxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQzt3Q0FBUyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQztDQUFBOztBQUFBLEFBRWpFLElBQU0sTUFBTSxXQUFOLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBSSxDQUFDLEVBQUUsSUFBSTtTQUM1QixNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztXQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0NBQU8sQ0FBQyxJQUFFLENBQUMsS0FBSSxDQUFDO0dBQUEsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDO0NBQUE7OztBQUFBLEFBRzNDLElBQU0sR0FBRyxXQUFILEdBQUcsR0FBRyxTQUFOLEdBQUcsQ0FBSSxDQUFDLEVBQUUsSUFBSTtTQUFLLE1BQU0sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO1dBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FBQSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUM7Q0FBQSxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBjb25zdCBHUkFWSVRZID0gMC4yNVxuZXhwb3J0IGNvbnN0IFNQRUVEID0gMlxuZXhwb3J0IGNvbnN0IFNDUkVFTl9XSURUSCA9IDgwMFxuZXhwb3J0IGNvbnN0IFNDUkVFTl9IRUlHSFQgPSA2MDBcbmV4cG9ydCBjb25zdCBQSVBFX01JTl9TUEFDRSA9IDgwXG5leHBvcnQgY29uc3QgUElQRV9QUk9CQUJJTElUWSA9IDAuN1xuZXhwb3J0IGNvbnN0IEdBUF9TSVpFID0gMTIwXG4iLCJpbXBvcnQge1NDUkVFTl9XSURUSCwgU0NSRUVOX0hFSUdIVH0gZnJvbSAnLi4vY29uZmlnJ1xuY29uc3QgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKS5nZXRDb250ZXh0KCcyZCcpXG5cbi8vICgpIC0+IHVuZGVmaW5lZFxuZXhwb3J0IGNvbnN0IGNsZWFyID0gKCkgPT4gY3R4LmNsZWFyUmVjdCgwLCAwLCBTQ1JFRU5fV0lEVEgsIFNDUkVFTl9IRUlHSFQpXG5cbi8vIEJveCAtPiB1bmRlZmluZWRcbmV4cG9ydCBjb25zdCBkcmF3Qm94ID0gKHtjb2xvciwgd2lkdGgsIGhlaWdodCwgeCwgeX0pID0+IHtcbiAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yXG4gIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KVxufVxuIiwiLy8gQm94IC0+IEJvb2xlYW5cbmV4cG9ydCBjb25zdCBib3hIaXRTY3JlZW5FZGdlID0gc2NyZWVuSGVpZ2h0ID0+ICh7eSwgaGVpZ2h0fSkgPT4gKHkgKyBoZWlnaHQgPiBzY3JlZW5IZWlnaHQpIHx8IHkgPCAwXG5cbi8vIEJveCAtPiBCb3ggLT4gQm9vbGVhblxuZXhwb3J0IGNvbnN0IGJveENvbGxpc2lvbiA9IGEgPT4gYiA9PlxuICAoYS54ICsgYS53aWR0aCA+IGIueCAmJiBhLnggPCBiLnggKyBiLndpZHRoKSAmJlxuICAoYS55ICsgYS5oZWlnaHQgPiBiLnkpICYmIChhLnkgPCBiLnkgKyBiLmhlaWdodClcbiIsImltcG9ydCB7bWVyZ2V9IGZyb20gJy4uL3V0aWwnXG5cbi8vIE51bWJlciAtPiBFbGVtZW50IC0+IEVsZW1lbnRcbmV4cG9ydCBjb25zdCBmYWxsID0gZ3Jhdml0eSA9PiBlID0+IG1lcmdlKGUsIHt5OiBlLnkgKyBlLmFjY2wsIGFjY2w6IGUuYWNjbCArIGdyYXZpdHl9KVxuXG4vLyBOdW1iZXItPiBFbGVtZW50IC0+IEVsZW1lbnRcbmV4cG9ydCBjb25zdCBtb3ZlID0gZCA9PiBlID0+IG1lcmdlKGUsIHt4OiBlLnggKyBkfSlcbiIsImltcG9ydCB7U0NSRUVOX1dJRFRILCBTQ1JFRU5fSEVJR0hULCBHQVBfU0laRX0gZnJvbSAnLi9jb25maWcnXG5cbi8vICgpIC0+IEJpcmRcbmV4cG9ydCBjb25zdCBiaXJkRmFjdG9yeSA9ICgpID0+ICh7XG4gIGNvbG9yOiAncmVkJyxcbiAgeDogU0NSRUVOX1dJRFRIIC8gMixcbiAgeTogU0NSRUVOX0hFSUdIVCAvIDIsXG4gIGFjY2w6IDAsXG4gIHdpZHRoOiAzMCxcbiAgaGVpZ2h0OiAzMFxufSlcblxuLy8gTnVtYmVyIC0+IFtQaXBlXVxuY29uc3QgY3JlYXRlUGlwZSA9IGdhcCA9PiBbXG4gIHtcbiAgICBjb2xvcjogJ2dyZWVuJyxcbiAgICB4OiBTQ1JFRU5fV0lEVEgsXG4gICAgeTogMCxcbiAgICB3aWR0aDogNTAsXG4gICAgaGVpZ2h0OiBnYXAgLSBHQVBfU0laRSAvIDJcbiAgfSxcbiAge1xuICAgIGNvbG9yOiAnZ3JlZW4nLFxuICAgIHg6IDgwMCxcbiAgICB5OiAoZ2FwICsgR0FQX1NJWkUgLyAyKSxcbiAgICB3aWR0aDogNTAsXG4gICAgaGVpZ2h0OiBTQ1JFRU5fSEVJR0hUIC0gKGdhcCArIDUwKVxuICB9XG5dXG5cbi8vICgpIC0+IFtQaXBlXVxuZXhwb3J0IGNvbnN0IHBpcGVGYWN0b3J5ID0gKCkgPT4gY3JlYXRlUGlwZSgoTWF0aC5yYW5kb20oKSAqIChTQ1JFRU5fSEVJR0hUIC0gMiAqIEdBUF9TSVpFKSkgKyBHQVBfU0laRSlcbiIsImltcG9ydCB7U0NSRUVOX0hFSUdIVH0gZnJvbSAnLi9jb25maWcnXG5pbXBvcnQge2FueX0gZnJvbSAnLi91dGlsJ1xuaW1wb3J0IHtib3hIaXRTY3JlZW5FZGdlLCBib3hDb2xsaXNpb259IGZyb20gJy4vZHNsL2NvbGxpc2lvbidcblxuLy8gQm94IC0+IEJvb2xlYW5cbmNvbnN0IGJveEhpdEVkZ2UgPSBib3hIaXRTY3JlZW5FZGdlKFNDUkVFTl9IRUlHSFQpXG5cbmV4cG9ydCBkZWZhdWx0ICh7YmlyZCwgcGlwZXN9KSA9PiBib3hIaXRFZGdlKGJpcmQpIHx8IGFueShib3hDb2xsaXNpb24oYmlyZCksIHBpcGVzKVxuIiwiaW1wb3J0IHRpY2sgZnJvbSAnLi90aWNrJ1xuaW1wb3J0IHttZXJnZX0gZnJvbSAnLi91dGlsJ1xuaW1wb3J0IHJlbmRlciBmcm9tICcuL3JlbmRlcidcbmltcG9ydCBzaW11bGF0ZSBmcm9tICcuL3NpbXVsYXRlJ1xuaW1wb3J0IHtiaXJkRmFjdG9yeX0gZnJvbSAnLi9mYWN0b3JpZXMnXG5pbXBvcnQgZ2FtZU92ZXIgZnJvbSAnLi9nYW1lT3Zlcidcbi8vIE1vZGVsIC0+IEJvb2xlYW5cblxubGV0IG1vZGVsID0ge1xuICBiaXJkOiBiaXJkRmFjdG9yeSgpLFxuICBwaXBlczogW11cbn1cblxuY29uc3QgZmxhcCA9ICgpID0+XG4gIG1vZGVsID0gbWVyZ2UobW9kZWwsIHtiaXJkOiBtZXJnZShtb2RlbC5iaXJkLCB7YWNjbDogLTZ9KX0pXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZmxhcClcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZmxhcClcblxudGljayhpID0+IHtcbiAgbW9kZWwgPSBzaW11bGF0ZShpLCBtb2RlbClcbiAgaWYgKGdhbWVPdmVyKG1vZGVsKSkgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gIHJlbmRlcihtb2RlbClcbn0pXG4iLCJpbXBvcnQge21hcH0gZnJvbSAnLi91dGlsJ1xuaW1wb3J0IHtjbGVhciwgZHJhd0JveH0gZnJvbSAnLi9kc2wvY2FudmFzJ1xuXG5leHBvcnQgZGVmYXVsdCBtb2RlbCA9PiB7XG4gIGNsZWFyKClcbiAgbWFwKGRyYXdCb3gsIG1vZGVsLnBpcGVzKVxuICBkcmF3Qm94KG1vZGVsLmJpcmQpXG59XG4iLCJpbXBvcnQge21lcmdlLCBtYXAsIGZpbHRlciwgY29tcG9zZX0gZnJvbSAnLi91dGlsJ1xuaW1wb3J0IHtHUkFWSVRZLCBTUEVFRCwgUElQRV9NSU5fU1BBQ0UsIFBJUEVfUFJPQkFCSUxJVFl9IGZyb20gJy4vY29uZmlnJ1xuaW1wb3J0IHtmYWxsLCBtb3ZlfSBmcm9tICcuL2RzbC9waHlzaWNzJ1xuaW1wb3J0IHtwaXBlRmFjdG9yeX0gZnJvbSAnLi9mYWN0b3JpZXMnXG5cbi8vIFtQaXBlXSAtPiBbUGlwZV1cbmNvbnN0IG1vdmVQaXBlcyA9IHBpcGVzID0+IG1hcChtb3ZlKC1TUEVFRCksIHBpcGVzKVxuXG4vLyBFbGVtZW50IC0+IEVsZW1lbnRcbmNvbnN0IGZyZWVGYWxsID0gZmFsbChHUkFWSVRZKVxuXG4vLyBOdW1iZXIgLT4gW1BpcGVdIC0+IFtQaXBlXVxuY29uc3QgYWRkUGlwZSA9ICh0aWNrLCBwaXBlcykgPT5cbiAgdGljayAlIFBJUEVfTUlOX1NQQUNFID09PSAwICYmIE1hdGgucmFuZG9tKCkgPiBQSVBFX1BST0JBQklMSVRZID8gWy4uLnBpcGVzLCAuLi5waXBlRmFjdG9yeSgpXSA6IHBpcGVzXG5cbi8vIFtQaXBlXSAtPiBbUGlwZV1cbmNvbnN0IGZpbHRlclBpcGVzID0gcGlwZXMgPT4gZmlsdGVyKCh7eCwgd2lkdGh9KSA9PiB4ICsgd2lkdGggPj0gMCwgcGlwZXMpXG5cbi8vIE51bWJlciAtPiBNb2RlbCAtPiBbUGlwZV1cbmNvbnN0IHNpbXVsYXRlUGlwZXMgPSBjb21wb3NlKGZpbHRlclBpcGVzLCBjb21wb3NlKG1vdmVQaXBlcywgYWRkUGlwZSkpXG5cbi8vIE51bWJlciAtPiBNb2RlbCAtPiBNb2RlbMKnXG5leHBvcnQgZGVmYXVsdCAodGljaywgbSkgPT5cbiAgbWVyZ2UobSwge1xuICAgIGJpcmQ6IGZyZWVGYWxsKG0uYmlyZCksXG4gICAgcGlwZXM6IHNpbXVsYXRlUGlwZXModGljaywgbS5waXBlcylcbiAgfSlcbiIsIlxuZXhwb3J0IGRlZmF1bHQgZiA9PiB7XG4gIGxldCBpID0gMFxuICBjb25zdCBsb29wID0gKCkgPT4ge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcClcbiAgICBmKGkrKylcbiAgfVxuXG4gIGxvb3AoKVxufVxuIiwiLy8gW2FdIC0+IGFcbmV4cG9ydCBjb25zdCBoZWFkID0gbGlzdCA9PiBsaXN0WzBdXG4vLyBbYV0gLT4gW2FdXG5leHBvcnQgY29uc3QgdGFpbCA9IGxpc3QgPT4gbGlzdC5zbGljZSgxKVxuLy8ge2s6dn0gLT4ge2s6dn0gLT4ge2s6dn1cbmV4cG9ydCBjb25zdCBtZXJnZSA9IChhLCBiKSA9PiBPYmplY3QuYXNzaWduKHt9LCBhLCBiKVxuXG4vLyAoKHkgLT4geiksIChhLi4ueCAtPiB5KSkgLT4gKGEuLi54IC0+IHopXG5leHBvcnQgY29uc3QgY29tcG9zZSA9IChmLCBnKSA9PiAoLi4uYXJncykgPT4gZihnKC4uLmFyZ3MpKVxuXG4vLyAoKGEsIGIpIC0+IGEpIC0+IGEgLT4gW2JdIC0+IGFcbmV4cG9ydCBjb25zdCByZWR1Y2UgPSAoZiwgaW5pdCwgbGlzdCkgPT5cbiAgbGlzdC5sZW5ndGggPT09IDAgPyBpbml0IDogcmVkdWNlKGYsIGYoaW5pdCwgaGVhZChsaXN0KSksIHRhaWwobGlzdCkpXG5cbi8vICgoYSAtPiBiKSwgW2FdKSAtPiBbYl1cbmV4cG9ydCBjb25zdCBtYXAgPSAoZiwgbGlzdCkgPT4gcmVkdWNlKChyLCBlKSA9PiBbLi4uciwgZihlKV0sIFtdLCBsaXN0KVxuLy8gKChhIC0+IEJvb2xlYW4pLCBbYV0pIC0+IFthXVxuZXhwb3J0IGNvbnN0IGZpbHRlciA9IChmLCBsaXN0KSA9PlxuICByZWR1Y2UoKHIsIGUpID0+IGYoZSkgPyBbLi4uciwgZV0gOiByLCBbXSwgbGlzdClcblxuLy8gKChhIC0+IEJvb2xlYW4pLCBbYV0pIC0+IEJvb2xlYW5cbmV4cG9ydCBjb25zdCBhbnkgPSAoZiwgbGlzdCkgPT4gcmVkdWNlKChyLCBlKSA9PiByIHx8IGYoZSksIGZhbHNlLCBsaXN0KVxuIl19
