/**
 * Represents a 4×4 homogeneous matrix that enables Document Object Model (DOM)
 * scripting access to Cascading Style Sheets (CSS) 2-D and 3-D Transforms
 * functionality.
 */
export class Matrix extends DOMMatrix {
  private readonly precision = 1000;

  /**
   *  Matrix#isAffine() -> Boolean
   *
   *  Determines whether the matrix is affine.
   **/
  isAffine () {
    return !(this.m13 || this.m14 || this.m23 || this.m24 || this.m31 ||
      this.m32 || this.m33 !== 1 || this.m34 || this.m43 || this.m44 !== 1);
  }

  /**
   *  Matrix#getMatrixStr() -> String
   *  return affine transformation matrix
   *
   *  Returns a string representation of the 3d matrix.
   **/
  getMatrixStr() {
    const points = [
      Math.trunc(this.a * this.precision) / this.precision,
      Math.trunc(this.b * this.precision) / this.precision,
      Math.trunc(this.c * this.precision) / this.precision,
      Math.trunc(this.d * this.precision) / this.precision,
      Math.trunc(this.e * this.precision) / this.precision,
      Math.trunc(this.f * this.precision) / this.precision
    ];
    return `matrix(${points.join(', ')})`;
  }

  /**
   *  Matrix#getMatrix3dStr() -> String
   *
   *  Returns a string representation of the 3d matrix.
   **/
  getMatrix3dStr() {
    const points = [
      Math.trunc(this.m11 * this.precision) / this.precision,
      Math.trunc(this.m12 * this.precision) / this.precision,
      Math.trunc(this.m13 * this.precision) / this.precision,
      Math.trunc(this.m14 * this.precision) / this.precision,
      Math.trunc(this.m21 * this.precision) / this.precision,
      Math.trunc(this.m22 * this.precision) / this.precision,
      Math.trunc(this.m23 * this.precision) / this.precision,
      Math.trunc(this.m24 * this.precision) / this.precision,
      Math.trunc(this.m31 * this.precision) / this.precision,
      Math.trunc(this.m32 * this.precision) / this.precision,
      Math.trunc(this.m33 * this.precision) / this.precision,
      Math.trunc(this.m34 * this.precision) / this.precision,
      Math.trunc(this.m41 * this.precision) / this.precision,
      Math.trunc(this.m42 * this.precision) / this.precision,
      Math.trunc(this.m43 * this.precision) / this.precision,
      Math.trunc(this.m44 * this.precision) / this.precision
    ];
    return `matrix3d(${points.join(', ')})`;
  }
}
