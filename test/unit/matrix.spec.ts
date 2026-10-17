import assert from 'assert';

import { Matrix } from '../../src/ui_utils/matrix';

describe('Matrix', function () {
  it('should be a DOMMatrix', function () {
    const m = new Matrix();
    assert.ok(m instanceof DOMMatrix);
    assert.ok(m.isIdentity);
  });

  it('should be built from a CSS matrix string', function () {
    const m = new Matrix('matrix(1, 2, 3, 4, 5, 6)');
    assert.deepStrictEqual([m.a, m.b, m.c, m.d, m.e, m.f], [1, 2, 3, 4, 5, 6]);
  });

  describe('isAffine', function () {
    it('should be true for the identity matrix', function () {
      assert.strictEqual(new Matrix().isAffine(), true);
    });

    it('should be true for a 2D transformation', function () {
      assert.strictEqual(new Matrix('matrix(2, 0.5, -1, 3, 10, 20)').isAffine(), true);
    });

    it('should be false when the matrix has a z translation', function () {
      const m = new Matrix();
      m.m43 = 5;
      assert.strictEqual(m.isAffine(), false);
    });

    it('should be false when the matrix has a perspective component', function () {
      const m = new Matrix();
      m.m34 = -0.001;
      assert.strictEqual(m.isAffine(), false);
    });

    it('should be false when m33 is not 1', function () {
      const m = new Matrix();
      m.m33 = 2;
      assert.strictEqual(m.isAffine(), false);
    });

    it('should be false when m44 is not 1', function () {
      const m = new Matrix();
      m.m44 = 2;
      assert.strictEqual(m.isAffine(), false);
    });
  });

  describe('getMatrixStr', function () {
    it('should return the identity as a CSS matrix', function () {
      assert.strictEqual(new Matrix().getMatrixStr(), 'matrix(1, 0, 0, 1, 0, 0)');
    });

    it('should return the 2D components', function () {
      assert.strictEqual(
        new Matrix('matrix(1, 2, 3, 4, 5, 6)').getMatrixStr(),
        'matrix(1, 2, 3, 4, 5, 6)');
    });

    it('should truncate values to 3 decimals', function () {
      const m = new Matrix('matrix(0.12345, -0.98765, 1.0009, 2, 3.33333, -4.44449)');
      assert.strictEqual(m.getMatrixStr(), 'matrix(0.123, -0.987, 1, 2, 3.333, -4.444)');
    });

    it('should print tiny negative values as 0', function () {
      const m = new Matrix('matrix(1, -0.0001, 0, 1, 0, 0)');
      assert.strictEqual(m.getMatrixStr(), 'matrix(1, 0, 0, 1, 0, 0)');
    });
  });

  describe('getMatrix3dStr', function () {
    it('should return the identity as a CSS matrix3d', function () {
      assert.strictEqual(
        new Matrix().getMatrix3dStr(),
        'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
    });

    it('should return all 16 components in column-major order', function () {
      const values = Array.from({ length: 16 }, (_, i) => i + 1);
      const m = new Matrix(`matrix3d(${values.join(', ')})`);
      assert.strictEqual(m.getMatrix3dStr(), `matrix3d(${values.join(', ')})`);
    });

    it('should truncate values to 3 decimals', function () {
      const m = new Matrix();
      m.m41 = 1.23456;
      m.m42 = -7.89999;
      assert.strictEqual(
        m.getMatrix3dStr(),
        'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1.234, -7.899, 0, 1)');
    });

    it('should round-trip through the Matrix constructor', function () {
      const m = new Matrix(Array.from(new DOMMatrix().translate(10, 20, 30).scale(2).toFloat64Array()));
      const copy = new Matrix(m.getMatrix3dStr());
      assert.strictEqual(copy.getMatrix3dStr(), m.getMatrix3dStr());
    });
  });
});
