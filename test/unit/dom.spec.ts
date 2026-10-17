import assert from 'assert';

import {
  addCssRule,
  addCssRules,
  getBoundingClientRect,
  getElementAbsolutePosition,
  getElementHeight,
  getElementMatrixTransform,
  getElementOpacity,
  getElementTransform,
  getElementWidth,
  isElementVisible,
  removeAllElementChild,
  setElementOpacity,
  setElementPos,
  setElementSize,
  setElementStyle,
  setElementTransform,
  setElementTransformOrigin,
  setElementVisibility,
} from '../../src/ui_utils/dom';
import { Matrix } from '../../src/ui_utils/matrix';
import { Point } from '../../src/ui_utils/point';

function createElement(): HTMLElement {
  const elem = document.createElement('div');
  document.body.appendChild(elem);
  return elem;
}

// happy-dom does no layout, so the bounding rect is stubbed.
function stubRect(elem: HTMLElement, rect: { left: number; top: number; width: number; height: number }) {
  elem.getBoundingClientRect = () => new DOMRect(rect.left, rect.top, rect.width, rect.height);
}

describe('dom', function () {
  afterEach(function () {
    document.body.innerHTML = '';
  });

  describe('getElementWidth / getElementHeight', function () {
    it('should return the bounding rect dimensions', function () {
      const elem = createElement();
      stubRect(elem, { left: 0, top: 0, width: 120, height: 45 });
      assert.strictEqual(getElementWidth(elem), 120);
      assert.strictEqual(getElementHeight(elem), 45);
    });
  });

  describe('getBoundingClientRect', function () {
    it('should return the element bounding rect', function () {
      const elem = createElement();
      stubRect(elem, { left: 1, top: 2, width: 3, height: 4 });
      const rect = getBoundingClientRect(elem);
      assert.deepStrictEqual(
        [rect.left, rect.top, rect.width, rect.height], [1, 2, 3, 4]);
    });
  });

  describe('getElementAbsolutePosition', function () {
    it('should return the bounding rect position as a Point', function () {
      const elem = createElement();
      stubRect(elem, { left: 15, top: 25, width: 10, height: 10 });
      const pos = getElementAbsolutePosition(elem);
      assert.ok(pos instanceof Point);
      assert.strictEqual(pos.x, 15);
      assert.strictEqual(pos.y, 25);
    });

    it('should throw when forced (no polyfill)', function () {
      const elem = createElement();
      assert.throws(() => getElementAbsolutePosition(elem, true), /Polyfill not implemented/);
    });
  });

  describe('setElementStyle', function () {
    it('should set CSS properties', function () {
      const elem = createElement();
      setElementStyle(elem, { color: 'red', display: 'block' });
      assert.strictEqual(elem.style.color, 'red');
      assert.strictEqual(elem.style.display, 'block');
    });

    it('should convert numbers to strings', function () {
      const elem = createElement();
      setElementStyle(elem, { 'z-index': 10 });
      assert.strictEqual(elem.style.getPropertyValue('z-index'), '10');
    });

    it('should remove properties set to null or undefined', function () {
      const elem = createElement();
      elem.style.color = 'red';
      elem.style.display = 'block';
      setElementStyle(elem, { color: undefined, display: null });
      assert.strictEqual(elem.style.color, '');
      assert.strictEqual(elem.style.display, '');
    });

    it('should accept camelized property names', function () {
      const elem = createElement();
      setElementStyle(elem, { fontSize: '12px', backgroundColor: 'blue' });
      assert.strictEqual(elem.style.getPropertyValue('font-size'), '12px');
      assert.strictEqual(elem.style.getPropertyValue('background-color'), 'blue');
    });

    it('should remove camelized properties', function () {
      const elem = createElement();
      elem.style.fontSize = '12px';
      setElementStyle(elem, { fontSize: undefined });
      assert.strictEqual(elem.style.fontSize, '');
    });

    it('should convert vendor-prefixed camelized names', function () {
      // happy-dom ignores vendor-prefixed properties, so spy on setProperty
      const elem = createElement();
      const properties: string[] = [];
      elem.style.setProperty = (property: string) => { properties.push(property); };
      setElementStyle(elem, { WebkitAppearance: 'none' });
      assert.deepStrictEqual(properties, ['-webkit-appearance']);
    });

    it('should keep custom properties untouched', function () {
      const elem = createElement();
      setElementStyle(elem, { '--mainColor': 'red' });
      assert.strictEqual(elem.style.getPropertyValue('--mainColor'), 'red');
      assert.strictEqual(elem.style.getPropertyValue('--main-color'), '');
    });

    it('should remove the opacity when undefined or null', function () {
      const elem = createElement();
      setElementStyle(elem, { opacity: 0.5 });
      setElementStyle(elem, { opacity: undefined });
      assert.strictEqual(elem.style.opacity, '');
      setElementStyle(elem, { opacity: 0.5 });
      setElementStyle(elem, { opacity: null });
      assert.strictEqual(elem.style.opacity, '');
    });

    it('should handle opacity given as a number or a string', function () {
      const elem = createElement();
      setElementStyle(elem, { opacity: 0.5 });
      assert.strictEqual(elem.style.opacity, '0.5');
      setElementStyle(elem, { opacity: '0.25' });
      assert.strictEqual(elem.style.opacity, '0.25');
    });
  });

  describe('setElementOpacity / getElementOpacity', function () {
    it('should set and read back the opacity', function () {
      const elem = createElement();
      setElementOpacity(elem, 0.3);
      assert.strictEqual(elem.style.opacity, '0.3');
      assert.strictEqual(getElementOpacity(elem), 0.3);
    });

    it('should clamp values above 1', function () {
      const elem = createElement();
      setElementOpacity(elem, 5);
      assert.strictEqual(elem.style.opacity, '1');
    });

    it('should set tiny and negative values to 0', function () {
      const elem = createElement();
      setElementOpacity(elem, 0.000001);
      assert.strictEqual(elem.style.opacity, '0');
      setElementOpacity(elem, -1);
      assert.strictEqual(elem.style.opacity, '0');
    });

    it('should remove the opacity when undefined', function () {
      const elem = createElement();
      setElementOpacity(elem, 0.5);
      setElementOpacity(elem, undefined);
      assert.strictEqual(elem.style.opacity, '');
    });

    it('should return 1 when no opacity is set', function () {
      assert.strictEqual(getElementOpacity(createElement()), 1);
    });

    it('should read the opacity from a stylesheet', function () {
      const elem = createElement();
      elem.className = 'half-transparent';
      addCssRule('.half-transparent', 'opacity: 0.5');
      assert.strictEqual(getElementOpacity(elem), 0.5);
    });
  });

  describe('setElementPos / setElementSize', function () {
    it('should set left and top in px', function () {
      const elem = createElement();
      setElementPos(elem, 10, 20);
      assert.strictEqual(elem.style.left, '10px');
      assert.strictEqual(elem.style.top, '20px');
    });

    it('should set width and height in px', function () {
      const elem = createElement();
      setElementSize(elem, 100, 50);
      assert.strictEqual(elem.style.width, '100px');
      assert.strictEqual(elem.style.height, '50px');
    });
  });

  describe('setElementVisibility / isElementVisible', function () {
    it('should consider an element visible by default', function () {
      assert.strictEqual(isElementVisible(createElement()), true);
    });

    it('should hide and show an element', function () {
      const elem = createElement();
      setElementVisibility(elem, false);
      assert.strictEqual(elem.style.visibility, 'hidden');
      assert.strictEqual(isElementVisible(elem), false);

      setElementVisibility(elem, true);
      assert.strictEqual(elem.style.visibility, 'visible');
      assert.strictEqual(isElementVisible(elem), true);
    });

    it('should return false for a missing element', function () {
      assert.strictEqual(isElementVisible(null), false);
      assert.strictEqual(isElementVisible(undefined), false);
    });
  });

  describe('removeAllElementChild', function () {
    it('should remove every child node', function () {
      const elem = createElement();
      elem.innerHTML = '<span>a</span>text<b>b</b><!-- comment -->';
      assert.strictEqual(elem.childNodes.length, 4);
      removeAllElementChild(elem);
      assert.strictEqual(elem.childNodes.length, 0);
    });

    it('should do nothing on an element without children', function () {
      const elem = createElement();
      removeAllElementChild(elem);
      assert.strictEqual(elem.childNodes.length, 0);
    });
  });

  describe('setElementTransform / getElementTransform', function () {
    it('should set and read back the transform', function () {
      const elem = createElement();
      setElementTransform(elem, 'translate(10px, 20px)');
      assert.strictEqual(elem.style.transform, 'translate(10px, 20px)');
      assert.strictEqual(getElementTransform(elem), 'translate(10px, 20px)');
    });

    it('should warn instead of throwing when the element is missing', function () {
      const warn = console.warn;
      let warned = false;
      console.warn = () => { warned = true; };
      try {
        setElementTransform(null, 'none');
      } finally {
        console.warn = warn;
      }
      assert.ok(warned);
    });

    it('should return undefined for a missing element', function () {
      assert.strictEqual(getElementTransform(null), undefined);
    });
  });

  describe('getElementMatrixTransform', function () {
    it('should return the computed transform as a Matrix', function () {
      const elem = createElement();
      elem.style.transform = 'matrix(2, 0, 0, 2, 10, 20)';
      const m = getElementMatrixTransform(elem);
      assert.ok(m instanceof Matrix);
      assert.strictEqual(m.getMatrixStr(), 'matrix(2, 0, 0, 2, 10, 20)');
    });

    it('should return null when the element has no transform', function () {
      assert.strictEqual(getElementMatrixTransform(createElement()), null);
    });
  });

  describe('setElementTransformOrigin', function () {
    it('should set the transform origin', function () {
      const elem = createElement();
      setElementTransformOrigin(elem, '50% 0%');
      assert.strictEqual(elem.style.transformOrigin, '50% 0%');
    });
  });

  describe('addCssRule / addCssRules', function () {
    function findRule(selector: string): CSSStyleRule | undefined {
      for (const sheet of Array.from(document.styleSheets)) {
        for (const rule of Array.from(sheet.cssRules)) {
          if ((rule as CSSStyleRule).selectorText === selector) {
            return rule as CSSStyleRule;
          }
        }
      }
      return undefined;
    }

    it('should insert a rule into a document stylesheet', function () {
      addCssRule('.add-css-rule', 'color: red');
      const rule = findRule('.add-css-rule');
      assert.ok(rule);
      assert.strictEqual(rule.style.color, 'red');
    });

    it('should insert several rules for the same selector', function () {
      addCssRules('.add-css-rules', ['color: blue', 'margin: 0px']);
      const sheet = findRule('.add-css-rules').parentStyleSheet;
      const rules = Array.from(sheet.cssRules)
        .filter(rule => (rule as CSSStyleRule).selectorText === '.add-css-rules')
        .map(rule => (rule as CSSStyleRule).style.cssText);
      assert.deepStrictEqual(rules, ['color: blue;', 'margin: 0px;']);
    });

    it('should apply the rule to matching elements', function () {
      const elem = createElement();
      elem.className = 'add-css-applied';
      addCssRule('.add-css-applied', 'display: inline-block');
      assert.strictEqual(getComputedStyle(elem).display, 'inline-block');
    });

    it('should ignore a non-array rule list', function () {
      assert.doesNotThrow(() => addCssRules('.ignored', 'color: red' as unknown as string[]));
      assert.strictEqual(findRule('.ignored'), undefined);
    });
  });
});
