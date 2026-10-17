import assert from 'assert';

import { Matrix } from '../../src/ui_utils/matrix';
import { Point } from '../../src/ui_utils/point';

const EPSILON = 1e-9;

// DOMMatrix methods (translate, scale...) return a plain DOMMatrix, not a Matrix
const toMatrix = (m: DOMMatrix) => new Matrix(Array.from(m.toFloat64Array()));

function assertPointEqual(actual: Point, x: number, y: number, z = 0) {
  assert.ok(Math.abs(actual.x - x) < EPSILON, `x: expected ${x}, got ${actual.x}`);
  assert.ok(Math.abs(actual.y - y) < EPSILON, `y: expected ${y}, got ${actual.y}`);
  assert.ok(Math.abs(actual.z - z) < EPSILON, `z: expected ${z}, got ${actual.z}`);
}

describe('Point', function () {
  describe('constructor', function () {
    it('should store x and y, with z defaulting to 0', function () {
      const p = new Point(3, 4);
      assert.strictEqual(p.x, 3);
      assert.strictEqual(p.y, 4);
      assert.strictEqual(p.z, 0);
    });

    it('should store z when given', function () {
      assert.strictEqual(new Point(1, 2, 3).z, 3);
    });
  });

  describe('matrixTransform', function () {
    it('should leave the point unchanged with the identity matrix', function () {
      assertPointEqual(new Point(5, 7).matrixTransform(new Matrix()), 5, 7);
    });

    it('should apply a translation', function () {
      const m = toMatrix(new DOMMatrix().translate(10, 20));
      assertPointEqual(new Point(1, 2).matrixTransform(m), 11, 22);
    });

    it('should apply a scale', function () {
      const m = toMatrix(new DOMMatrix().scale(2, 3));
      assertPointEqual(new Point(1, 2).matrixTransform(m), 2, 6);
    });

    it('should apply a rotation', function () {
      const m = toMatrix(new DOMMatrix().rotate(90));
      assertPointEqual(new Point(1, 2).matrixTransform(m), -2, 1);
    });

    it('should apply a combined transformation', function () {
      // scale first, then translate (DOMMatrix post-multiplies)
      const m = toMatrix(new DOMMatrix().translate(10, 0).scale(2));
      assertPointEqual(new Point(1, 1).matrixTransform(m), 12, 2);
    });

    it('should transform the z coordinate', function () {
      const m = toMatrix(new DOMMatrix().translate(0, 0, 5));
      assertPointEqual(new Point(1, 2, 3).matrixTransform(m), 1, 2, 8);
    });

    it('should return a new Point and not modify the original', function () {
      const p = new Point(1, 2);
      const m = toMatrix(new DOMMatrix().translate(10, 10));
      const result = p.matrixTransform(m);
      assert.ok(result instanceof Point);
      assert.notStrictEqual(result, p);
      assertPointEqual(p, 1, 2);
    });

    it('should not modify the matrix', function () {
      const m = toMatrix(new DOMMatrix().translate(10, 10));
      const before = m.getMatrix3dStr();
      new Point(1, 2).matrixTransform(m);
      assert.strictEqual(m.getMatrix3dStr(), before);
    });
  });
});
