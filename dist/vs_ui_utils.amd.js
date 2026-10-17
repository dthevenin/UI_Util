define(['exports', 'vs_utils'], (function (exports, vs_utils) { 'use strict';

  class Matrix extends DOMMatrix {
    constructor() {
      super(...arguments);
      this.precision = 1e3;
    }
    /**
     *  Matrix#isAffine() -> Boolean
     *
     *  Determines whether the matrix is affine.
     **/
    isAffine() {
      return !(this.m13 || this.m14 || this.m23 || this.m24 || this.m31 || this.m32 || this.m33 !== 1 || this.m34 || this.m43 || this.m44 !== 1);
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
      return `matrix(${points.join(", ")})`;
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
      return `matrix3d(${points.join(", ")})`;
    }
  }

  class Point {
    constructor(x, y, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    /**
     * Applies the given 2×3 matrix transformation on this Point object and
     * returns a new, transformed Point object.
     *
     * @name Point#matrixTransform
     * @function
     * @public
     * @param {Matrix} matrix he matrix
     * @returns {Point} the matrix
     */
    matrixTransform(matrix) {
      let matrixTmp = new Matrix();
      const transM = matrixTmp.translate(this.x, this.y, this.z ?? 0);
      const multiTransM = matrix.multiply(transM);
      return new Point(multiTransM.m41, multiTransM.m42, multiTransM.m43);
    }
  }

  function importFile(path, type, clb = void 0, doc = document, first = false) {
    if (type === "js") {
      const jsEffects = doc.createElement("script");
      jsEffects.setAttribute("type", "text/javascript");
      jsEffects.setAttribute("src", path);
      if (vs_utils.isFunction(clb)) {
        jsEffects.onload = () => clb.call(this, path);
      }
      const head = doc.head ?? doc.querySelector("head");
      if (first && doc.head.firstElementChild) {
        head.insertBefore(jsEffects, head.firstElementChild);
      } else {
        head.appendChild(jsEffects);
      }
    } else {
      const cssStyle = doc.createElement("link");
      cssStyle.setAttribute("rel", "stylesheet");
      cssStyle.setAttribute("type", "text/css");
      cssStyle.setAttribute("href", path);
      cssStyle.setAttribute("media", "screen");
      if (vs_utils.isFunction(clb)) {
        let count = 0;
        const waitForSheet = () => {
          if (!cssStyle.sheet) {
            if (count++ < 100) {
              setTimeout(waitForSheet, 100);
            } else {
              console.error("CSS load of " + path + " failed!");
            }
            return;
          }
          clb.call(document, path);
        };
        waitForSheet();
      }
      const head = doc.head ?? doc.querySelector("head");
      if (first && doc.head.firstElementChild) {
        head.insertBefore(cssStyle, head.firstElementChild);
      } else {
        head.appendChild(cssStyle);
      }
    }
  }

  var document$1 = typeof window != "undefined" ? window.document : null;
  const getElementHeight = (elem) => getElementDimensions(elem).height;
  const getElementWidth = (elem) => getElementDimensions(elem).width;
  function getElementDimensions(elem) {
    const { height, width } = elem.getBoundingClientRect();
    return { height, width };
  }
  function getElementStyle(elem, key) {
    let value = elem.style.getPropertyValue(key);
    if (!value || value === "auto") {
      const css = document$1?.defaultView?.getComputedStyle(elem, null);
      value = css?.getPropertyValue(key);
    }
    {
      return value ? parseFloat(value) : 1;
    }
  }
  function setElementStyle(elem, styles) {
    const elementStyle = elem.style;
    for (const [key, value] of Object.entries(styles)) {
      const property = toCssPropertyName(key);
      if (property === "opacity") {
        setElementOpacity(
          elem,
          value === null || value === void 0 ? void 0 : vs_utils.isNumber(value) ? value : parseFloat(value)
        );
      } else {
        if (value === null || value === void 0) {
          elementStyle.removeProperty(property);
        } else {
          elementStyle.setProperty(property, vs_utils.isString(value) ? value : `${value}`);
        }
      }
    }
  }
  const toCssPropertyName = (property) => property.startsWith("--") ? property : property.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  function setElementOpacity(elem, value) {
    const elementStyle = elem.style;
    if (vs_utils.isUndefined(value)) {
      elementStyle.removeProperty("opacity");
    } else {
      elementStyle.opacity = value > 1 ? "1" : value < 1e-5 ? "0" : value.toString();
    }
  }
  const getElementOpacity = (elem) => getElementStyle(elem, "opacity");
  function getElementAbsolutePosition(elem, force = false) {
    if (!force && elem.getBoundingClientRect) {
      const rec = elem.getBoundingClientRect();
      if (rec) {
        return new Point(rec.left, rec.top);
      }
    }
    throw new Error("getElementAbsolutePosition Polyfill not implemented");
  }
  function setElementPos(elem, x, y) {
    var elementStyle = elem.style;
    elementStyle.left = x + "px";
    elementStyle.top = y + "px";
  }
  function setElementSize(elem, w, h) {
    var elementStyle = elem.style;
    elementStyle.width = w + "px";
    elementStyle.height = h + "px";
  }
  function setElementVisibility(elem, v) {
    var elementStyle = elem.style;
    if (elementStyle || vs_utils.isString(elem.innerHTML)) {
      elementStyle.visibility = v ? "visible" : "hidden";
    } else {
      elem.setAttribute("visibility", v ? "visible" : "hidden");
    }
  }
  function isElementVisible(elem) {
    if (!elem) {
      return false;
    }
    var elementStyle = elem.style;
    if (elementStyle || vs_utils.isString(elem.innerHTML)) {
      return elementStyle.visibility !== "hidden";
    } else if (elem instanceof CharacterData) {
      return true;
    } else {
      return elem.getAttribute("visibility") !== "hidden";
    }
  }
  function removeAllElementChild(elem) {
    if (!elem.childNodes) return;
    let l = elem.childNodes.length;
    while (l--) {
      elem.removeChild(elem.firstChild);
    }
  }
  function setElementTransform(elem, transform) {
    if (elem && elem.style) elem.style.transform = transform;
    else console.warn("setElementTransform, elem null or without style");
  }
  const getElementTransform = (elem) => elem?.style?.transform;
  function getElementMatrixTransform(elem) {
    const css = document$1?.defaultView?.getComputedStyle(elem, null);
    return css?.transform ? new Matrix(css.transform) : null;
  }
  function setElementTransformOrigin(elem, value) {
    elem.style.transformOrigin = value;
  }
  function addCssRules(selector, rules) {
    if (!vs_utils.isArray(rules)) return;
    rules.forEach((rule) => addCssRule(selector, rule));
  }
  let appStyleSheet = null;
  function addCssRule(selector, rule) {
    if (!appStyleSheet) {
      const style = document$1.createElement("style");
      style.appendChild(document$1.createTextNode(""));
      const head = document$1.getElementsByTagName("head")[0];
      head.appendChild(style);
      appStyleSheet = document$1.styleSheets[document$1.styleSheets.length - 1];
    }
    const l = appStyleSheet.cssRules.length;
    appStyleSheet.insertRule(selector + " {" + rule + "}", l);
  }
  const getBoundingClientRect = (elem) => elem.getBoundingClientRect();

  exports.Matrix = Matrix;
  exports.Point = Point;
  exports.addCssRule = addCssRule;
  exports.addCssRules = addCssRules;
  exports.getBoundingClientRect = getBoundingClientRect;
  exports.getElementAbsolutePosition = getElementAbsolutePosition;
  exports.getElementHeight = getElementHeight;
  exports.getElementMatrixTransform = getElementMatrixTransform;
  exports.getElementOpacity = getElementOpacity;
  exports.getElementTransform = getElementTransform;
  exports.getElementWidth = getElementWidth;
  exports.importFile = importFile;
  exports.isElementVisible = isElementVisible;
  exports.removeAllElementChild = removeAllElementChild;
  exports.setElementOpacity = setElementOpacity;
  exports.setElementPos = setElementPos;
  exports.setElementSize = setElementSize;
  exports.setElementStyle = setElementStyle;
  exports.setElementTransform = setElementTransform;
  exports.setElementTransformOrigin = setElementTransformOrigin;
  exports.setElementVisibility = setElementVisibility;

}));
//# sourceMappingURL=vs_ui_utils.amd.js.map
