class DMath {
  /**
   * Converts degrees to radians.
   * @param {number} d - Degrees.
   * @returns {number} Radians.
   */
  static dtr(d: number): number {
    return (d * Math.PI) / 180.0;
  }

  /**
   * Converts radians to degrees.
   * @param {number} r - Radians.
   * @returns {number} Degrees.
   */
  static rtd(r: number): number {
    return (r * 180.0) / Math.PI;
  }

  /**
   * Calculates the sine of an angle.
   * @param {number} d - Degrees.
   * @returns {number} Sine of the angle.
   */
  static sin(d: number): number {
    return Math.sin(this.dtr(d));
  }

  /**
   * Calculates the cosine of an angle.
   * @param {number} d - Degrees.
   * @returns {number} Cosine of the angle.
   */
  static cos(d: number): number {
    return Math.cos(this.dtr(d));
  }

  /**
   * Calculates the tangent of an angle.
   * @param {number} d - Degrees.
   * @returns {number} Tangent of the angle.
   */
  static tan(d: number): number {
    return Math.tan(this.dtr(d));
  }

  /**
   * Calculates the arcsine of a value.
   * @param {number} d - Value.
   * @returns {number} Arcsine in degrees.
   */
  static arcsin(d: number): number {
    return this.rtd(Math.asin(d));
  }

  /**
   * Calculates the arccosine of a value.
   * @param {number} d - Value.
   * @returns {number} Arccosine in degrees.
   */
  static arccos(d: number): number {
    return this.rtd(Math.acos(d));
  }

  /**
   * Calculates the arctangent of a value.
   * @param {number} d - Value.
   * @returns {number} Arctangent in degrees.
   */
  static arctan(d: number): number {
    return this.rtd(Math.atan(d));
  }

  /**
   * Calculates the arccotangent of a value.
   * @param {number} x - Value.
   * @returns {number} Arccotangent in degrees.
   */
  static arccot(x: number): number {
    return this.rtd(Math.atan(1 / x));
  }

  /**
   * Calculates the arctangent of y/x.
   * @param {number} y - Y value.
   * @param {number} x - X value.
   * @returns {number} Arctangent in degrees.
   */
  static arctan2(y: number, x: number): number {
    return this.rtd(Math.atan2(y, x));
  }

  /**
   * Fixes an angle to be within 0 to 360 degrees.
   * @param {number} a - Angle.
   * @returns {number} Fixed angle.
   */
  static fixAngle(a: number): number {
    return this.fix(a, 360);
  }

  /**
   * Fixes an hour to be within 0 to 24 hours.
   * @param {number} a - Hour.
   * @returns {number} Fixed hour.
   */
  static fixHour(a: number): number {
    return this.fix(a, 24);
  }

  /**
   * Fixes a value to be within 0 to b.
   * @param {number} a - Value.
   * @param {number} b - Upper bound.
   * @returns {number} Fixed value.
   */
  static fix(a: number, b: number): number {
    a = a - b * Math.floor(a / b);
    return a < 0 ? a + b : a;
  }
}

export default DMath;