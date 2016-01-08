(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ctx = document.getElementById('main').getContext('2d');

var clear = exports.clear = function clear() {
  return ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

var drawRect = exports.drawRect = function drawRect(_ref) {
  var color = _ref.color;
  var width = _ref.width;
  var height = _ref.height;
  var x = _ref.x;
  var y = _ref.y;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

var outOfScreen = function outOfScreen(_ref) {
  var y = _ref.y;
  var height = _ref.height;
  return y + height > 600 || y < 0;
};

var boxCollision = function boxCollision(a) {
  return function (b) {
    return a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height;
  };
};

var hitPipe = function hitPipe(bird, pipes) {
  return (0, _util.any)(boxCollision(bird), pipes);
};

exports.default = function (_ref2) {
  var bird = _ref2.bird;
  var pipes = _ref2.pipes;
  return outOfScreen(bird) || hitPipe(bird, pipes);
};

},{"./util":8}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GAP = 60;

var birdFactory = exports.birdFactory = function birdFactory() {
  return {
    color: 'orange',
    x: 400,
    y: 300,
    accl: 0,
    width: 30,
    height: 30
  };
};

var createPipe = function createPipe(gap) {
  return [{
    color: 'green',
    x: 800,
    y: 0,
    width: 50,
    height: gap - GAP
  }, {
    color: 'green',
    x: 800,
    y: gap + GAP,
    width: 50,
    height: 600 - (gap + 50)
  }];
};

var pipeFactory = exports.pipeFactory = function pipeFactory() {
  return createPipe(Math.random() * 400 + 100);
};

},{}],4:[function(require,module,exports){
'use strict';

var _collition = require('./collition');

var _collition2 = _interopRequireDefault(_collition);

var _tick = require('./tick');

var _tick2 = _interopRequireDefault(_tick);

var _util = require('./util');

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

var _simulate = require('./simulate');

var _simulate2 = _interopRequireDefault(_simulate);

var _factories = require('./factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var model = {
  bird: (0, _factories.birdFactory)(),
  pipes: []
};
var flap = function flap() {
  return model = (0, _util.merge)(model, { bird: (0, _util.merge)(model.bird, { accl: -6 }) });
};

document.addEventListener('click', flap);
document.addEventListener('keypress', flap);

(0, _tick2.default)(function () {
  model = (0, _simulate2.default)(model);
  if ((0, _collition2.default)(model)) window.location.reload();
  (0, _render2.default)(model);
});

},{"./collition":2,"./factories":3,"./render":5,"./simulate":6,"./tick":7,"./util":8}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

var _canvas = require('./canvas');

var drawPipe = _canvas.drawRect;
var drawBird = _canvas.drawRect;

exports.default = function (model) {
  (0, _canvas.clear)();
  (0, _util.map)(drawPipe, model.pipes);
  drawBird(model.bird);
};

},{"./canvas":1,"./util":8}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util');

var _factories = require('./factories');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var simulateBird = function simulateBird(bird) {
  return (0, _util.merge)(bird, { y: bird.y + bird.accl, accl: bird.accl + 0.25 });
};
var addPipe = function addPipe(pipes) {
  return Math.random() > 0.995 ? [].concat(_toConsumableArray(pipes), _toConsumableArray((0, _factories.pipeFactory)())) : pipes;
};
var filterPipes = function filterPipes(pipes) {
  return (0, _util.filter)(function (_ref) {
    var x = _ref.x;
    var width = _ref.width;
    return x + width >= 0;
  }, pipes);
};
var movePipes = function movePipes(pipes) {
  return (0, _util.map)(function (pipe) {
    return (0, _util.merge)(pipe, { x: pipe.x - 2 });
  }, pipes);
};
var simulatePipes = (0, _util.compose)(filterPipes, (0, _util.compose)(movePipes, addPipe));

exports.default = function (m) {
  return (0, _util.merge)(m, { bird: simulateBird(m.bird), pipes: simulatePipes(m.pipes) });
};

},{"./factories":3,"./util":8}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (f) {
  var loop = function loop() {
    window.requestAnimationFrame(loop);
    f();
  };
  loop();
};

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var head = exports.head = function head(list) {
  return list[0];
};
var tail = exports.tail = function tail(list) {
  return list.slice(1);
};

var reduce = exports.reduce = function reduce(f, init, list) {
  return list.length === 0 ? init : reduce(f, f(init, head(list)), tail(list));
};

var map = exports.map = function map(f, list) {
  return reduce(function (r, e) {
    return [].concat(_toConsumableArray(r), [f(e)]);
  }, [], list);
};
var filter = exports.filter = function filter(f, list) {
  return reduce(function (r, e) {
    return f(e) ? [].concat(_toConsumableArray(r), [e]) : r;
  }, [], list);
};

var merge = exports.merge = function merge(a, b) {
  return Object.assign({}, a, b);
};

var compose = exports.compose = function compose(f, g) {
  return function () {
    return f(g.apply(undefined, arguments));
  };
};

var any = exports.any = function any(f, list) {
  return reduce(function (r, e) {
    return r || f(e);
  }, false, list);
};

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9qcy9jYW52YXMuanMiLCJzcmMvanMvY29sbGl0aW9uLmpzIiwic3JjL2pzL2ZhY3Rvcmllcy5qcyIsInNyYy9qcy9tYWluLmpzIiwic3JjL2pzL3JlbmRlci5qcyIsInNyYy9qcy9zaW11bGF0ZS5qcyIsInNyYy9qcy90aWNrLmpzIiwic3JjL2pzL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBOztBQUVyRCxJQUFNLEtBQUssV0FBTCxLQUFLLEdBQUcsU0FBUixLQUFLO1NBQVMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0NBQUEsQ0FBQTs7QUFFNUUsSUFBTSxRQUFRLFdBQVIsUUFBUSxHQUFHLFNBQVgsUUFBUSxPQUFxQztNQUFoQyxLQUFLLFFBQUwsS0FBSztNQUFFLEtBQUssUUFBTCxLQUFLO01BQUUsTUFBTSxRQUFOLE1BQU07TUFBRSxDQUFDLFFBQUQsQ0FBQztNQUFFLENBQUMsUUFBRCxDQUFDOztBQUNsRCxLQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQTtBQUNyQixLQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0NBQ2xDLENBQUE7Ozs7Ozs7Ozs7O0FDTkQsSUFBTSxXQUFXLEdBQUcsU0FBZCxXQUFXO01BQUssQ0FBQyxRQUFELENBQUM7TUFBRSxNQUFNLFFBQU4sTUFBTTtTQUFNLEFBQUMsQ0FB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QUFHLFdBQUgsR0FBRyxHQUFHLFNBQU4sR0FBRyxDQUFJLENBQUMsRUFBRSxJQUFJO1NBQUssTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7d0NBQVMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUM7Q0FBQSxDQUFBO0FBQ2pFLElBQU0sTUFBTSxXQUFOLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBSSxDQUFDLEVBQUUsSUFBSTtTQUM1QixNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztXQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0NBQU8sQ0FBQyxJQUFFLENBQUMsS0FBSSxDQUFDO0dBQUEsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDO0NBQUEsQ0FBQTs7QUFFM0MsSUFBTSxLQUFLLFdBQUwsS0FBSyxHQUFHLFNBQVIsS0FBSyxDQUFJLENBQUMsRUFBRSxDQUFDO1NBQUssTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztDQUFBLENBQUE7O0FBRS9DLElBQU0sT0FBTyxXQUFQLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxDQUFDLEVBQUUsQ0FBQztTQUFLO1dBQWEsQ0FBQyxDQUFDLENBQUMsNEJBQVMsQ0FBQztHQUFBO0NBQUEsQ0FBQTs7QUFFcEQsSUFBTSxHQUFHLFdBQUgsR0FBRyxHQUFHLFNBQU4sR0FBRyxDQUFJLENBQUMsRUFBRSxJQUFJO1NBQUssTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7V0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUFBLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQztDQUFBLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKS5nZXRDb250ZXh0KCcyZCcpXG5cbmV4cG9ydCBjb25zdCBjbGVhciA9ICgpID0+IGN0eC5jbGVhclJlY3QoMCwgMCwgY3R4LmNhbnZhcy53aWR0aCwgY3R4LmNhbnZhcy5oZWlnaHQpXG5cbmV4cG9ydCBjb25zdCBkcmF3UmVjdCA9ICh7Y29sb3IsIHdpZHRoLCBoZWlnaHQsIHgsIHl9KSA9PiB7XG4gIGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodClcbn1cbiIsImltcG9ydCB7YW55fSBmcm9tICcuL3V0aWwnXG5jb25zdCBvdXRPZlNjcmVlbiA9ICh7eSwgaGVpZ2h0fSkgPT4gKHkgKyBoZWlnaHQgPiA2MDApIHx8IHkgPCAwXG5cbmNvbnN0IGJveENvbGxpc2lvbiA9IGEgPT4gYiA9PlxuICAoYS54ICsgYS53aWR0aCA+IGIueCAmJiBhLnggPCBiLnggKyBiLndpZHRoKSAmJlxuICAoYS55ICsgYS5oZWlnaHQgPiBiLnkpICYmIChhLnkgPCBiLnkgKyBiLmhlaWdodClcblxuY29uc3QgaGl0UGlwZSA9IChiaXJkLCBwaXBlcykgPT4gYW55KGJveENvbGxpc2lvbihiaXJkKSwgcGlwZXMpXG5cbmV4cG9ydCBkZWZhdWx0ICh7YmlyZCwgcGlwZXN9KSA9PiBvdXRPZlNjcmVlbihiaXJkKSB8fCBoaXRQaXBlKGJpcmQsIHBpcGVzKVxuIiwiY29uc3QgR0FQID0gNjBcblxuZXhwb3J0IGNvbnN0IGJpcmRGYWN0b3J5ID0gKCkgPT4gKHtcbiAgY29sb3I6ICdvcmFuZ2UnLFxuICB4OiA0MDAsXG4gIHk6IDMwMCxcbiAgYWNjbDogMCxcbiAgd2lkdGg6IDMwLFxuICBoZWlnaHQ6IDMwXG59KVxuXG5jb25zdCBjcmVhdGVQaXBlID0gZ2FwID0+IFtcbiAge1xuICAgIGNvbG9yOiAnZ3JlZW4nLFxuICAgIHg6IDgwMCxcbiAgICB5OiAwLFxuICAgIHdpZHRoOiA1MCxcbiAgICBoZWlnaHQ6IGdhcCAtIEdBUFxuICB9LFxuICB7XG4gICAgY29sb3I6ICdncmVlbicsXG4gICAgeDogODAwLFxuICAgIHk6IChnYXAgKyBHQVApLFxuICAgIHdpZHRoOiA1MCxcbiAgICBoZWlnaHQ6IDYwMCAtIChnYXAgKyA1MClcbiAgfVxuXVxuXG5leHBvcnQgY29uc3QgcGlwZUZhY3RvcnkgPSAoKSA9PiBjcmVhdGVQaXBlKChNYXRoLnJhbmRvbSgpICogNDAwKSArIDEwMClcbiIsImltcG9ydCBjb2xsaXRpb24gZnJvbSAnLi9jb2xsaXRpb24nXG5pbXBvcnQgdGljayBmcm9tICcuL3RpY2snXG5pbXBvcnQge21lcmdlfSBmcm9tICcuL3V0aWwnXG5pbXBvcnQgcmVuZGVyIGZyb20gJy4vcmVuZGVyJ1xuaW1wb3J0IHNpbXVsYXRlIGZyb20gJy4vc2ltdWxhdGUnXG5pbXBvcnQge2JpcmRGYWN0b3J5fSBmcm9tICcuL2ZhY3RvcmllcydcblxubGV0IG1vZGVsID0ge1xuICBiaXJkOiBiaXJkRmFjdG9yeSgpLFxuICBwaXBlczogW11cbn1cbmNvbnN0IGZsYXAgPSAoKSA9PlxuICBtb2RlbCA9IG1lcmdlKG1vZGVsLCB7YmlyZDogbWVyZ2UobW9kZWwuYmlyZCwge2FjY2w6IC0gNn0pfSlcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmbGFwKVxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBmbGFwKVxuXG50aWNrKCgpID0+IHtcbiAgbW9kZWwgPSBzaW11bGF0ZShtb2RlbClcbiAgaWYgKGNvbGxpdGlvbihtb2RlbCkpIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICByZW5kZXIobW9kZWwpXG59KVxuIiwiaW1wb3J0IHttYXB9IGZyb20gJy4vdXRpbCdcbmltcG9ydCB7Y2xlYXIsIGRyYXdSZWN0fSBmcm9tICcuL2NhbnZhcydcblxuY29uc3QgZHJhd1BpcGUgPSBkcmF3UmVjdFxuY29uc3QgZHJhd0JpcmQgPSBkcmF3UmVjdFxuXG5leHBvcnQgZGVmYXVsdCBtb2RlbCA9PiB7XG4gIGNsZWFyKClcbiAgbWFwKGRyYXdQaXBlLCBtb2RlbC5waXBlcylcbiAgZHJhd0JpcmQobW9kZWwuYmlyZClcbn1cbiIsImltcG9ydCB7bWVyZ2UsIG1hcCwgZmlsdGVyLCBjb21wb3NlfSBmcm9tICcuL3V0aWwnXG5pbXBvcnQge3BpcGVGYWN0b3J5fSBmcm9tICcuL2ZhY3RvcmllcydcblxuY29uc3Qgc2ltdWxhdGVCaXJkID0gYmlyZCA9PiBtZXJnZShiaXJkLCB7eTogYmlyZC55ICsgYmlyZC5hY2NsLCBhY2NsOiBiaXJkLmFjY2wgKyAwLjI1fSlcbmNvbnN0IGFkZFBpcGUgPSBwaXBlcyA9PiBNYXRoLnJhbmRvbSgpID4gMC45OTUgPyBbLi4ucGlwZXMsIC4uLnBpcGVGYWN0b3J5KCldIDogcGlwZXNcbmNvbnN0IGZpbHRlclBpcGVzID0gcGlwZXMgPT4gZmlsdGVyKCh7eCwgd2lkdGh9KSA9PiB4ICsgd2lkdGggPj0gMCwgcGlwZXMpXG5jb25zdCBtb3ZlUGlwZXMgPSBwaXBlcyA9PiBtYXAocGlwZSA9PiBtZXJnZShwaXBlLCB7eDogcGlwZS54IC0gMn0pLCBwaXBlcylcbmNvbnN0IHNpbXVsYXRlUGlwZXMgPSBjb21wb3NlKGZpbHRlclBpcGVzLCBjb21wb3NlKG1vdmVQaXBlcywgYWRkUGlwZSkpXG5cbmV4cG9ydCBkZWZhdWx0IG0gPT5cbiAgbWVyZ2UobSwge2JpcmQ6IHNpbXVsYXRlQmlyZChtLmJpcmQpLCBwaXBlczogc2ltdWxhdGVQaXBlcyhtLnBpcGVzKX0pXG4iLCJcbmV4cG9ydCBkZWZhdWx0IGYgPT4ge1xuICBjb25zdCBsb29wID0gKCkgPT4ge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcClcbiAgICBmKClcbiAgfVxuICBsb29wKClcbn1cbiIsImV4cG9ydCBjb25zdCBoZWFkID0gbGlzdCA9PiBsaXN0WzBdXG5leHBvcnQgY29uc3QgdGFpbCA9IGxpc3QgPT4gbGlzdC5zbGljZSgxKVxuXG5leHBvcnQgY29uc3QgcmVkdWNlID0gKGYsIGluaXQsIGxpc3QpID0+e1xuICByZXR1cm4gbGlzdC5sZW5ndGggPT09IDAgPyBpbml0IDogcmVkdWNlKGYsIGYoaW5pdCwgaGVhZChsaXN0KSksIHRhaWwobGlzdCkpXG59XG5cbmV4cG9ydCBjb25zdCBtYXAgPSAoZiwgbGlzdCkgPT4gcmVkdWNlKChyLCBlKSA9PiBbLi4uciwgZihlKV0sIFtdLCBsaXN0KVxuZXhwb3J0IGNvbnN0IGZpbHRlciA9IChmLCBsaXN0KSA9PlxuICByZWR1Y2UoKHIsIGUpID0+IGYoZSkgPyBbLi4uciwgZV0gOiByLCBbXSwgbGlzdClcblxuZXhwb3J0IGNvbnN0IG1lcmdlID0gKGEsIGIpID0+IE9iamVjdC5hc3NpZ24oe30sIGEsIGIpXG5cbmV4cG9ydCBjb25zdCBjb21wb3NlID0gKGYsIGcpID0+ICguLi5hcmdzKSA9PiBmKGcoLi4uYXJncykpXG5cbmV4cG9ydCBjb25zdCBhbnkgPSAoZiwgbGlzdCkgPT4gcmVkdWNlKChyLCBlKSA9PiByIHx8IGYoZSksIGZhbHNlLCBsaXN0KVxuIl19
