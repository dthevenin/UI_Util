import { isFunction } from 'vs_utils';

/**
 * Imports a JavaScript or css file into a document
 *
 * @param {String} path The file path to import
 * @param {String} type The file type ['js', 'css']
 * @param {Function} clb A function which will be called when the file is loaded
 * @param {Document} doc The document into import the file
 * @param first insert first. Optional, by default insert at the end
 */
export function importFile (path: string, type: 'js' | 'css', clb: (path: string) => void = undefined, doc = document, first = false) {
  if (type === 'js') {
    const jsEffects = doc.createElement ('script');
    jsEffects.setAttribute ('type', 'text/javascript');
    jsEffects.setAttribute ('src', path);
    if (isFunction(clb)) {
      jsEffects.onload = () => clb.call (this, path);
    }

    const head = doc.head ?? doc.querySelector('head');
    if (first && doc.head.firstElementChild) {
      head.insertBefore (jsEffects, head.firstElementChild);
    }
    else {
      head.appendChild(jsEffects);
    }
  } else { // CSS
    const cssStyle = doc.createElement('link');
    cssStyle.setAttribute('rel', 'stylesheet');
    cssStyle.setAttribute('type', 'text/css');
    cssStyle.setAttribute('href', path);
    cssStyle.setAttribute('media', 'screen');
    if (isFunction(clb)) {
      let count = 0;

      const waitForSheet = () => {
        if (!cssStyle.sheet) {
          if (count++ < 100) {
            setTimeout(waitForSheet, 100);
          } else {
            console.error ('CSS load of ' + path + ' failed!');
          }
          return;
        }
        clb.call(document, path);
      };
      waitForSheet();
    }

    const head = doc.head ?? doc.querySelector('head');
    if (first && doc.head.firstElementChild) {
      head.insertBefore (cssStyle, head.firstElementChild);
    }
    else {
      head.appendChild (cssStyle);
    }
  }
}
