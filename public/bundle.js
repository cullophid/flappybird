(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GRAVITY = exports.GRAVITY = 0.5;
var SPEED = exports.SPEED = 3;
var SCREEN_WIDTH = exports.SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = exports.SCREEN_HEIGHT = 600;
var PIPE_MIN_SPACE = exports.PIPE_MIN_SPACE = 80;
var PIPE_PROBABILITY = exports.PIPE_PROBABILITY = 0.7;
var GAP_SIZE = exports.GAP_SIZE = 120;
var FLAP_POWER = exports.FLAP_POWER = -8;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawBox = exports.clear = undefined;

var _config = require('../config');

var ctx = document.getElementById('main').getContext('2d');

var clear = exports.clear = function clear() {
  return ctx.clearRect(0, 0, _config.SCREEN_WIDTH, _config.SCREEN_HEIGHT);
};

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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.offsetX = exports.boxCollision = exports.boxHitScreenEdge = exports.fall = undefined;

var _util = require('../util');

// Number -> Element -> Element
var fall = exports.fall = function fall(gravity) {
  return function (e) {
    return (0, _util.merge)(e, { y: e.y + e.accl, accl: e.accl + gravity });
  };
};

// Number -> Box -=> Boolean
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

// Number-> Element -> Element
var offsetX = exports.offsetX = function offsetX(x) {
  return function (e) {
    return (0, _util.merge)(e, { x: e.x + x });
  };
};

},{"../util":10}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

var _physics = require('./dsl/physics');

// Box -> Boolean
var boxHitEdge = (0, _physics.boxHitScreenEdge)(_config.SCREEN_HEIGHT);

// Model -> Boolean

exports.default = function (_ref) {
  var bird = _ref.bird;
  var pipes = _ref.pipes;
  return boxHitEdge(bird) || (0, _util.any)((0, _physics.boxCollision)(bird), pipes);
};

},{"./config":1,"./dsl/physics":3,"./util":10}],7:[function(require,module,exports){
'use strict';

var _tick = require('./dsl/tick');

var _tick2 = _interopRequireDefault(_tick);

var _util = require('./util');

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

var _simulate = require('./simulate');

var _simulate2 = _interopRequireDefault(_simulate);

var _factories = require('./factories');

var _gameOver = require('./gameOver');

var _gameOver2 = _interopRequireDefault(_gameOver);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Model -> Boolean

var model = {
  bird: (0, _factories.birdFactory)(),
  pipes: []
};

var flap = function flap() {
  return model = (0, _util.merge)(model, { bird: (0, _util.merge)(model.bird, { accl: _config.FLAP_POWER }) });
};

document.addEventListener('click', flap);
document.addEventListener('keypress', flap);

(0, _tick2.default)(function (i) {
  model = (0, _simulate2.default)(i, model);
  if ((0, _gameOver2.default)(model)) window.location.reload();
  (0, _render2.default)(model);
});

},{"./config":1,"./dsl/tick":4,"./factories":5,"./gameOver":6,"./render":8,"./simulate":9,"./util":10}],8:[function(require,module,exports){
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

},{"./dsl/canvas":2,"./util":10}],9:[function(require,module,exports){
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
  return (0, _util.map)((0, _physics.offsetX)(-_config.SPEED), pipes);
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
  return {
    bird: freeFall(m.bird),
    pipes: simulatePipes(tick, m.pipes)
  };
};

},{"./config":1,"./dsl/physics":3,"./factories":5,"./util":10}],10:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2RzbC9jYW52YXMuanMiLCJzcmMvanMvZHNsL3BoeXNpY3MuanMiLCJzcmMvanMvZHNsL3RpY2suanMiLCJzcmMvanMvZmFjdG9yaWVzLmpzIiwic3JjL2pzL2dhbWVPdmVyLmpzIiwic3JjL2pzL21haW4uanMiLCJzcmMvanMvcmVuZGVyLmpzIiwic3JjL2pzL3NpbXVsYXRlLmpzIiwic3JjL2pzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FPLElBQU0sT0FBTyxXQUFQLE9BQU8sR0FBRyxHQUFHLENBQUE7QUFDbkIsSUFBTSxLQUFLLFdBQUwsS0FBSyxHQUFHLENBQUMsQ0FBQTtBQUNmLElBQU0sWUFBWSxXQUFaLFlBQVksR0FBRyxHQUFHLENBQUE7QUFDeEIsSUFBTSxhQUFhLFdBQWIsYUFBYSxHQUFHLEdBQUcsQ0FBQTtBQUN6QixJQUFNLGNBQWMsV0FBZCxjQUFjLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLElBQU0sZ0JBQWdCLFdBQWhCLGdCQUFnQixHQUFHLEdBQUcsQ0FBQTtBQUM1QixJQUFNLFFBQVEsV0FBUixRQUFRLEdBQUcsR0FBRyxDQUFBO0FBQ3BCLElBQU0sVUFBVSxXQUFWLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQTs7Ozs7Ozs7Ozs7O0FDTjVCLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBOztBQUVyRCxJQUFNLEtBQUssV0FBTCxLQUFLLEdBQUcsU0FBUixLQUFLO1NBQVMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUhyQyxZQUFZLFVBQUUsYUFBYSxDQUd3QztDQUFBLENBQUE7O0FBRXBFLElBQU0sT0FBTyxXQUFQLE9BQU8s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QUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FBQTs7O0FBQUEsQUFHaEUsSUFBTSxHQUFHLFdBQUgsR0FBRyxHQUFHLFNBQU4sR0FBRyxDQUFJLENBQUMsRUFBRSxJQUFJO1NBQUssTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7d0NBQVMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUM7Q0FBQTs7QUFBQSxBQUVqRSxJQUFNLE1BQU0sV0FBTixNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksQ0FBQyxFQUFFLElBQUk7U0FDNUIsTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7V0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdDQUFPLENBQUMsSUFBRSxDQUFDLEtBQUksQ0FBQztHQUFBLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQztDQUFBOzs7QUFBQSxBQUczQyxJQUFNLEdBQUcsV0FBSCxHQUFHLEdBQUcsU0FBTixHQUFHLENBQUksQ0FBQyxFQUFFLElBQUk7U0FBSyxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztXQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQUEsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDO0NBQUEsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgY29uc3QgR1JBVklUWSA9IDAuNVxuZXhwb3J0IGNvbnN0IFNQRUVEID0gM1xuZXhwb3J0IGNvbnN0IFNDUkVFTl9XSURUSCA9IDgwMFxuZXhwb3J0IGNvbnN0IFNDUkVFTl9IRUlHSFQgPSA2MDBcbmV4cG9ydCBjb25zdCBQSVBFX01JTl9TUEFDRSA9IDgwXG5leHBvcnQgY29uc3QgUElQRV9QUk9CQUJJTElUWSA9IDAuN1xuZXhwb3J0IGNvbnN0IEdBUF9TSVpFID0gMTIwXG5leHBvcnQgY29uc3QgRkxBUF9QT1dFUiA9IC04XG4iLCJpbXBvcnQge1NDUkVFTl9XSURUSCwgU0NSRUVOX0hFSUdIVH0gZnJvbSAnLi4vY29uZmlnJ1xuY29uc3QgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKS5nZXRDb250ZXh0KCcyZCcpXG5cbmV4cG9ydCBjb25zdCBjbGVhciA9ICgpID0+IGN0eC5jbGVhclJlY3QoMCwgMCwgU0NSRUVOX1dJRFRILCBTQ1JFRU5fSEVJR0hUKVxuXG5leHBvcnQgY29uc3QgZHJhd0JveCA9ICh7Y29sb3IsIHdpZHRoLCBoZWlnaHQsIHgsIHl9KSA9PiB7XG4gIGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodClcbn1cbiIsImltcG9ydCB7bWVyZ2V9IGZyb20gJy4uL3V0aWwnXG5cbi8vIE51bWJlciAtPiBFbGVtZW50IC0+IEVsZW1lbnRcbmV4cG9ydCBjb25zdCBmYWxsID0gZ3Jhdml0eSA9PiBlID0+IG1lcmdlKGUsIHt5OiBlLnkgKyBlLmFjY2wsIGFjY2w6IGUuYWNjbCArIGdyYXZpdHl9KVxuXG4vLyBOdW1iZXIgLT4gQm94IC09PiBCb29sZWFuXG5leHBvcnQgY29uc3QgYm94SGl0U2NyZWVuRWRnZSA9IHNjcmVlbkhlaWdodCA9PiAoe3ksIGhlaWdodH0pID0+ICh5ICsgaGVpZ2h0ID4gc2NyZWVuSGVpZ2h0KSB8fCB5IDwgMFxuXG4vLyBCb3ggLT4gQm94IC0+IEJvb2xlYW5cbmV4cG9ydCBjb25zdCBib3hDb2xsaXNpb24gPSBhID0+IGIgPT5cbiAgKGEueCArIGEud2lkdGggPiBiLnggJiYgYS54IDwgYi54ICsgYi53aWR0aCkgJiZcbiAgKGEueSArIGEuaGVpZ2h0ID4gYi55KSAmJiAoYS55IDwgYi55ICsgYi5oZWlnaHQpXG5cbi8vIE51bWJlci0+IEVsZW1lbnQgLT4gRWxlbWVudFxuZXhwb3J0IGNvbnN0IG9mZnNldFggPSB4ID0+IGUgPT4gbWVyZ2UoZSwge3g6IGUueCArIHh9KVxuIiwiZXhwb3J0IGRlZmF1bHQgZiA9PiB7XG4gIGxldCBpID0gMFxuICBjb25zdCBsb29wID0gKCkgPT4ge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcClcbiAgICBmKGkrKylcbiAgfVxuXG4gIGxvb3AoKVxufVxuIiwiaW1wb3J0IHtTQ1JFRU5fV0lEVEgsIFNDUkVFTl9IRUlHSFQsIEdBUF9TSVpFfSBmcm9tICcuL2NvbmZpZydcblxuLy8gKCkgLT4gQmlyZFxuZXhwb3J0IGNvbnN0IGJpcmRGYWN0b3J5ID0gKCkgPT4gKHtcbiAgY29sb3I6ICdyZWQnLFxuICB4OiBTQ1JFRU5fV0lEVEggLyAyLFxuICB5OiBTQ1JFRU5fSEVJR0hUIC8gMixcbiAgYWNjbDogMCxcbiAgd2lkdGg6IDMwLFxuICBoZWlnaHQ6IDMwXG59KVxuXG4vLyBOdW1iZXIgLT4gW1BpcGVdXG5jb25zdCBjcmVhdGVQaXBlID0gZ2FwID0+IFtcbiAge1xuICAgIGNvbG9yOiAnZ3JlZW4nLFxuICAgIHg6IFNDUkVFTl9XSURUSCxcbiAgICB5OiAwLFxuICAgIHdpZHRoOiA1MCxcbiAgICBoZWlnaHQ6IGdhcCAtIEdBUF9TSVpFIC8gMlxuICB9LFxuICB7XG4gICAgY29sb3I6ICdncmVlbicsXG4gICAgeDogODAwLFxuICAgIHk6IChnYXAgKyBHQVBfU0laRSAvIDIpLFxuICAgIHdpZHRoOiA1MCxcbiAgICBoZWlnaHQ6IFNDUkVFTl9IRUlHSFQgLSAoZ2FwICsgNTApXG4gIH1cbl1cblxuLy8gKCkgLT4gW1BpcGVdXG5leHBvcnQgY29uc3QgcGlwZUZhY3RvcnkgPSAoKSA9PiBjcmVhdGVQaXBlKChNYXRoLnJhbmRvbSgpICogKFNDUkVFTl9IRUlHSFQgLSAyICogR0FQX1NJWkUpKSArIEdBUF9TSVpFKVxuIiwiaW1wb3J0IHtTQ1JFRU5fSEVJR0hUfSBmcm9tICcuL2NvbmZpZydcbmltcG9ydCB7YW55fSBmcm9tICcuL3V0aWwnXG5pbXBvcnQge2JveEhpdFNjcmVlbkVkZ2UsIGJveENvbGxpc2lvbn0gZnJvbSAnLi9kc2wvcGh5c2ljcydcblxuLy8gQm94IC0+IEJvb2xlYW5cbmNvbnN0IGJveEhpdEVkZ2UgPSBib3hIaXRTY3JlZW5FZGdlKFNDUkVFTl9IRUlHSFQpXG5cbi8vIE1vZGVsIC0+IEJvb2xlYW5cbmV4cG9ydCBkZWZhdWx0ICh7YmlyZCwgcGlwZXN9KSA9PiBib3hIaXRFZGdlKGJpcmQpIHx8IGFueShib3hDb2xsaXNpb24oYmlyZCksIHBpcGVzKVxuIiwiaW1wb3J0IHRpY2sgZnJvbSAnLi9kc2wvdGljaydcbmltcG9ydCB7bWVyZ2V9IGZyb20gJy4vdXRpbCdcbmltcG9ydCByZW5kZXIgZnJvbSAnLi9yZW5kZXInXG5pbXBvcnQgc2ltdWxhdGUgZnJvbSAnLi9zaW11bGF0ZSdcbmltcG9ydCB7YmlyZEZhY3Rvcnl9IGZyb20gJy4vZmFjdG9yaWVzJ1xuaW1wb3J0IGdhbWVPdmVyIGZyb20gJy4vZ2FtZU92ZXInXG5pbXBvcnQge0ZMQVBfUE9XRVJ9IGZyb20gJy4vY29uZmlnJ1xuLy8gTW9kZWwgLT4gQm9vbGVhblxuXG5sZXQgbW9kZWwgPSB7XG4gIGJpcmQ6IGJpcmRGYWN0b3J5KCksXG4gIHBpcGVzOiBbXVxufVxuXG5jb25zdCBmbGFwID0gKCkgPT5cbiAgbW9kZWwgPSBtZXJnZShtb2RlbCwge2JpcmQ6IG1lcmdlKG1vZGVsLmJpcmQsIHthY2NsOiBGTEFQX1BPV0VSfSl9KVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZsYXApXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGZsYXApXG5cbnRpY2soaSA9PiB7XG4gIG1vZGVsID0gc2ltdWxhdGUoaSwgbW9kZWwpXG4gIGlmIChnYW1lT3Zlcihtb2RlbCkpIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICByZW5kZXIobW9kZWwpXG59KVxuIiwiaW1wb3J0IHttYXB9IGZyb20gJy4vdXRpbCdcbmltcG9ydCB7Y2xlYXIsIGRyYXdCb3h9IGZyb20gJy4vZHNsL2NhbnZhcydcblxuZXhwb3J0IGRlZmF1bHQgbW9kZWwgPT4ge1xuICBjbGVhcigpXG4gIG1hcChkcmF3Qm94LCBtb2RlbC5waXBlcylcbiAgZHJhd0JveChtb2RlbC5iaXJkKVxufVxuIiwiaW1wb3J0IHttZXJnZSwgbWFwLCBmaWx0ZXIsIGNvbXBvc2V9IGZyb20gJy4vdXRpbCdcbmltcG9ydCB7R1JBVklUWSwgU1BFRUQsIFBJUEVfTUlOX1NQQUNFLCBQSVBFX1BST0JBQklMSVRZfSBmcm9tICcuL2NvbmZpZydcbmltcG9ydCB7ZmFsbCwgb2Zmc2V0WH0gZnJvbSAnLi9kc2wvcGh5c2ljcydcbmltcG9ydCB7cGlwZUZhY3Rvcnl9IGZyb20gJy4vZmFjdG9yaWVzJ1xuXG4vLyBbUGlwZV0gLT4gW1BpcGVdXG5jb25zdCBtb3ZlUGlwZXMgPSBwaXBlcyA9PiBtYXAob2Zmc2V0WCgtU1BFRUQpLCBwaXBlcylcblxuLy8gRWxlbWVudCAtPiBFbGVtZW50XG5jb25zdCBmcmVlRmFsbCA9IGZhbGwoR1JBVklUWSlcblxuLy8gTnVtYmVyIC0+IFtQaXBlXSAtPiBbUGlwZV1cbmNvbnN0IGFkZFBpcGUgPSAodGljaywgcGlwZXMpID0+XG4gIHRpY2sgJSBQSVBFX01JTl9TUEFDRSA9PT0gMCAmJiBNYXRoLnJhbmRvbSgpID4gUElQRV9QUk9CQUJJTElUWSA/IFsuLi5waXBlcywgLi4ucGlwZUZhY3RvcnkoKV0gOiBwaXBlc1xuXG4vLyBbUGlwZV0gLT4gW1BpcGVdXG5jb25zdCBmaWx0ZXJQaXBlcyA9IHBpcGVzID0+IGZpbHRlcigoe3gsIHdpZHRofSkgPT4geCArIHdpZHRoID49IDAsIHBpcGVzKVxuXG4vLyBOdW1iZXIgLT4gTW9kZWwgLT4gW1BpcGVdXG5jb25zdCBzaW11bGF0ZVBpcGVzID0gY29tcG9zZShmaWx0ZXJQaXBlcywgY29tcG9zZShtb3ZlUGlwZXMsIGFkZFBpcGUpKVxuXG4vLyBOdW1iZXIgLT4gTW9kZWwgLT4gTW9kZWzCp1xuZXhwb3J0IGRlZmF1bHQgKHRpY2ssIG0pID0+ICh7XG4gIGJpcmQ6IGZyZWVGYWxsKG0uYmlyZCksXG4gIHBpcGVzOiBzaW11bGF0ZVBpcGVzKHRpY2ssIG0ucGlwZXMpXG59KVxuIiwiLy8gW2FdIC0+IGFcbmV4cG9ydCBjb25zdCBoZWFkID0gbGlzdCA9PiBsaXN0WzBdXG4vLyBbYV0gLT4gW2FdXG5leHBvcnQgY29uc3QgdGFpbCA9IGxpc3QgPT4gbGlzdC5zbGljZSgxKVxuLy8ge2s6dn0gLT4ge2s6dn0gLT4ge2s6dn1cbmV4cG9ydCBjb25zdCBtZXJnZSA9IChhLCBiKSA9PiBPYmplY3QuYXNzaWduKHt9LCBhLCBiKVxuXG4vLyAoKHkgLT4geiksIChhLi4ueCAtPiB5KSkgLT4gKGEuLi54IC0+IHopXG5leHBvcnQgY29uc3QgY29tcG9zZSA9IChmLCBnKSA9PiAoLi4uYXJncykgPT4gZihnKC4uLmFyZ3MpKVxuXG4vLyAoKGEsIGIpIC0+IGEpIC0+IGEgLT4gW2JdIC0+IGFcbmV4cG9ydCBjb25zdCByZWR1Y2UgPSAoZiwgaW5pdCwgbGlzdCkgPT5cbiAgbGlzdC5sZW5ndGggPT09IDAgPyBpbml0IDogcmVkdWNlKGYsIGYoaW5pdCwgaGVhZChsaXN0KSksIHRhaWwobGlzdCkpXG5cbi8vICgoYSAtPiBiKSwgW2FdKSAtPiBbYl1cbmV4cG9ydCBjb25zdCBtYXAgPSAoZiwgbGlzdCkgPT4gcmVkdWNlKChyLCBlKSA9PiBbLi4uciwgZihlKV0sIFtdLCBsaXN0KVxuLy8gKChhIC0+IEJvb2xlYW4pLCBbYV0pIC0+IFthXVxuZXhwb3J0IGNvbnN0IGZpbHRlciA9IChmLCBsaXN0KSA9PlxuICByZWR1Y2UoKHIsIGUpID0+IGYoZSkgPyBbLi4uciwgZV0gOiByLCBbXSwgbGlzdClcblxuLy8gKChhIC0+IEJvb2xlYW4pLCBbYV0pIC0+IEJvb2xlYW5cbmV4cG9ydCBjb25zdCBhbnkgPSAoZiwgbGlzdCkgPT4gcmVkdWNlKChyLCBlKSA9PiByIHx8IGYoZSksIGZhbHNlLCBsaXN0KVxuIl19
