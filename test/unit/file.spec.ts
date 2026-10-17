import assert from 'assert';

import { importFile } from '../../src/ui_utils/file';

describe('importFile', function () {
  afterEach(function () {
    document.head.innerHTML = '';
  });

  describe('js', function () {
    it('should append a script element to the head', function () {
      importFile('/lib/script.js', 'js');
      const script = document.head.lastElementChild as HTMLScriptElement;
      assert.strictEqual(script.tagName, 'SCRIPT');
      assert.strictEqual(script.getAttribute('src'), '/lib/script.js');
      assert.strictEqual(script.getAttribute('type'), 'text/javascript');
    });

    it('should insert the script first when requested', function () {
      const existing = document.createElement('meta');
      document.head.appendChild(existing);
      importFile('/lib/first.js', 'js', undefined, document, true);
      const script = document.head.firstElementChild as HTMLScriptElement;
      assert.strictEqual(script.getAttribute('src'), '/lib/first.js');
      assert.strictEqual(document.head.lastElementChild, existing);
    });

    it('should call the callback with the path once loaded', function () {
      const calls: string[] = [];
      importFile('/lib/clb.js', 'js', path => calls.push(path));
      const script = document.head.lastElementChild as HTMLScriptElement;
      assert.deepStrictEqual(calls, []);
      script.dispatchEvent(new Event('load'));
      assert.deepStrictEqual(calls, ['/lib/clb.js']);
    });
  });

  describe('css', function () {
    it('should append a stylesheet link to the head', function () {
      importFile('/lib/style.css', 'css');
      const link = document.head.lastElementChild as HTMLLinkElement;
      assert.strictEqual(link.tagName, 'LINK');
      assert.strictEqual(link.getAttribute('rel'), 'stylesheet');
      assert.strictEqual(link.getAttribute('type'), 'text/css');
      assert.strictEqual(link.getAttribute('href'), '/lib/style.css');
      assert.strictEqual(link.getAttribute('media'), 'screen');
    });

    it('should insert the link first when requested', function () {
      const existing = document.createElement('meta');
      document.head.appendChild(existing);
      importFile('/lib/first.css', 'css', undefined, document, true);
      const link = document.head.firstElementChild as HTMLLinkElement;
      assert.strictEqual(link.getAttribute('href'), '/lib/first.css');
    });

    it('should call the callback with the path once the stylesheet is available', function (done) {
      this.timeout(1000);
      importFile('/lib/clb.css', 'css', path => {
        try {
          assert.strictEqual(path, '/lib/clb.css');
          done();
        } catch (e) {
          done(e);
        }
      });
      const link = document.head.lastElementChild as HTMLLinkElement;
      // simulate the browser attaching the stylesheet once loaded
      Object.defineProperty(link, 'sheet', { value: new CSSStyleSheet() });
    });
  });

  it('should import into the given document', function () {
    const otherDoc = document.implementation.createHTMLDocument('other');
    importFile('/lib/other.js', 'js', undefined, otherDoc);
    assert.strictEqual(otherDoc.head.lastElementChild.getAttribute('src'), '/lib/other.js');
    assert.strictEqual(document.head.querySelector('script'), null);
  });
});
