export function point(that, x, y) {
  that._context.bezierCurveTo(
    that._x1 + that._k * (that._x2 - that._x0),
    that._y1 + that._k * (that._y2 - that._y0),
    that._x2 + that._k * (that._x1 - x),
    that._y2 + that._k * (that._y1 - y),
    that._x2,
    that._y2
  );
};

function cardinal(tension) {
  var k = (tension == null ? 1 : 1 - tension) / 6;
  return function(context) {
    return new Cardinal(context, k);
  };
}

function Cardinal(context, k) {
  this._context = context;
  this._k = k;
}

Cardinal.prototype = {
  lineStart: function() {
    this._x0 = this._x1 = this._x2 =
    this._y0 = this._y1 = this._y2 = NaN;
    this._state = 0;
  },
  lineEnd: function() {
    switch (this._state) {
      case 1: this._context.closePath(); break;
      case 2: this._context.lineTo(this._x2, this._y2); break;
      case 3: point(this, this._x1, this._y1); break;
    }
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._state) {
      case 0: this._state = 1; this._context.moveTo(x, y); break;
      case 1: this._state = 2; break;
      case 2: this._state = 3; this._x0 = this._x2, this._y0 = this._y2; // proceed
      default: point(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

export default cardinal;
