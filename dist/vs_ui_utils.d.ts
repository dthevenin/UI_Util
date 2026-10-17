/**
 * Represents a 4×4 homogeneous matrix that enables Document Object Model (DOM)
 * scripting access to Cascading Style Sheets (CSS) 2-D and 3-D Transforms
 * functionality.
 */
declare class Matrix extends DOMMatrix {
    private readonly precision;
    /**
     *  Matrix#isAffine() -> Boolean
     *
     *  Determines whether the matrix is affine.
     **/
    isAffine(): boolean;
    /**
     *  Matrix#getMatrixStr() -> String
     *  return affine transformation matrix
     *
     *  Returns a string representation of the 3d matrix.
     **/
    getMatrixStr(): string;
    /**
     *  Matrix#getMatrix3dStr() -> String
     *
     *  Returns a string representation of the 3d matrix.
     **/
    getMatrix3dStr(): string;
}

/**
 *  @class
 *  Point is an (x, y) coordinate pair.
 *  When you use a Point object in matrix operations, the object is
 *  treated as a vector of the following form <x, y, 1>
 *
 * @param {Number} the x-coordinate value.
 * @param {Number} the y-coordinate value.
 */
declare class Point {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z?: number);
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
    matrixTransform(matrix: Matrix): Point;
}

/**
 * Imports a JavaScript or css file into a document
 *
 * @param {String} path The file path to import
 * @param {String} type The file type ['js', 'css']
 * @param {Function} clb A function which will be called when the file is loaded
 * @param {Document} doc The document into import the file
 * @param first insert first. Optional, by default insert at the end
 */
declare function importFile(path: string, type: 'js' | 'css', clb?: (path: string) => void, doc?: Document, first?: boolean): void;

/**
 *  Returns the height of `element`.<br/>
 *
 *  This method returns correct values on elements whose display is set to
 *  `none` either in an inline style rule or in an CSS stylesheet.
 *
 *
 * @param {Element} elem The element
 *	@returns {Number} the height
 **/
declare const getElementHeight: (elem: HTMLElement) => number;
/**
 *  Returns the width of `element`.<br/>
 *
 *  This method returns correct values on elements whose display is set to
 *  `none` either in an inline style rule or in an CSS stylesheet.
 *
 *
 * @param {Element} elem The element
 *	@returns {Number} the width
 **/
declare const getElementWidth: (elem: HTMLElement) => number;
/**
 *  Modifies `element`'s CSS style properties. Styles are passed as a hash of
 *  property-value pairs. Properties can be specified either in their CSS
 *  form (`font-size`) or in their camelized form (`fontSize`). CSS custom
 *  properties (`--main-color`) are used as is.
 *  A `null` or `undefined` value removes the property.
 *
 * @example
 * setElementStyle (elem, {color: 'red', fontSize: '12px'});
 * // add/set color and font-size properties
 * setElementStyle (elem, {'z-index': 10, opacity: 0.5});
 * // numbers are converted to strings, opacity is clamped to [0, 1]
 * setElementStyle (elem, {color: undefined});
 * // remove color property
 *
 * @param {Element} elem The element
 * @param styles The property-value pairs
 */
declare function setElementStyle(elem: HTMLElement, styles: Record<string, number | string | null | undefined>): void;
/**
 *  Sets the visual opacity of an element while working around inconsistencies
 *  in various browsers. The `opacity` argument should be a floating point
 *  number, where the value of `0` is fully transparent and `1` is fully opaque.
 *
 *  @example
 *  // set to 50% transparency
 *  setElementOpacity (element, 0.5);
 *
 *  // these are equivalent, but allow for setting more than
 *  // one CSS property at once:
 *  setElementStyle (element, { opacity: 0.5 });
 *  setElementStyle (element, "opacity: 0.5");
 *
 * @param {Element} elem The element
 * @param {Number} value The opacity
 **/
declare function setElementOpacity(elem: HTMLElement, value: number | undefined): void;
/**
 *  Returns the opacity of the element.
 *
 * @param {Element} elem The element
 * @return {Number} value The opacity
 **/
declare const getElementOpacity: (elem: HTMLElement) => number;
/**
 * Compute the elements position in terms of the window viewport
 * Returns a vs.Point {x, y}
 *
 * @return Point the x,y absolute position of an element
 **/
declare function getElementAbsolutePosition(elem: HTMLElement, force?: boolean): Point;
/**
 *  Set the absolute element position.
 *
 * @param {Element} elem The element
 * @param {Number} x The element left position
 * @param {Number} y The element top position
 **/
declare function setElementPos(elem: HTMLElement, x: number, y: number): void;
/**
 * Set the element size
 *
 * @param {Element} elem The element
 * @param {Number} w The element width
 * @param {Number} h The element height
 **/
declare function setElementSize(elem: HTMLElement, w: number, h: number): void;
/**
 *  Set the element HTML visibility
 *
 *
 * @param {Element} elem The element
 * @param {boolean} v True if the element should be visible or false
 **/
declare function setElementVisibility(elem: HTMLElement, v: boolean): void;
/**
 *  Return true if the element is visible, false otherwise
 *
 * @param {Element} elem The element
 * @return {boolean}
 **/
declare function isElementVisible(elem: HTMLElement): boolean;
/**
 *  Remove all element children
 *
 * @param {Element} elem The element
 **/
declare function removeAllElementChild(elem: HTMLElement): void;
declare function setElementTransform(elem: HTMLElement, transform: string): void;
/**
 *@private
 */
declare const getElementTransform: (elem: HTMLElement) => string | undefined;
/**
 *  get the Matrix transformation to a element
 *
 * @param {Element} elem The element
 * @return {Matrix} matrix3d css transformation
 **/
declare function getElementMatrixTransform(elem: HTMLElement): Matrix | null;
/**
 *  Set the CSS transformation to an element
 *
 * @param {Element} elem The element
 * @param {String} value. The value is a CSS string. Ex: '50% 0%' or '10px 10px'
 **/
declare function setElementTransformOrigin(elem: HTMLElement, value: string): void;
/********************************************************************
                         Style mamangent
*********************************************************************/
/**
 *  Modifies CSS styleSheets.
 *  <p>
 *  Modifies CSS style styleSheets. It can be preempted
 *  by css style inline modification (see vs.ui.View.setStyle).
 *  @see vs.ui.View#setStyles if you want to modify inline CSS.
 *
 *  @example
 *  vs.util.addCssRules ('.classname1', ['color: red', 'margin: 0px']);
 *
 * @param {String} selector CSS Selector
 * @param {Array} rules the array of rules
 */
declare function addCssRules(selector: string, rules: string[]): void;
/**
 *  Modifies CSS styleSheets.
 *  <p>
 *  Modifies CSS style styleSheets. It can be preempted
 *  by css style inline modification (see vs.ui.View.setStyle).
 *  @see vs.ui.View#setStyle if you want to modify inline CSS.
 *
 *  @example
 *  vs.util.addCssRule ('.classname1', 'color: red');
 *
 * @param {String} selector CSS Selector
 * @param {String} rule the rule using the following format:
 *   "prop_name: value"
 */
declare function addCssRule(selector: string, rule: string): void;
declare const getBoundingClientRect: (elem: HTMLElement) => DOMRect;

export { Matrix, Point, addCssRule, addCssRules, getBoundingClientRect, getElementAbsolutePosition, getElementHeight, getElementMatrixTransform, getElementOpacity, getElementTransform, getElementWidth, importFile, isElementVisible, removeAllElementChild, setElementOpacity, setElementPos, setElementSize, setElementStyle, setElementTransform, setElementTransformOrigin, setElementVisibility };
