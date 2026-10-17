import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Expose browser globals (window, document, DOMMatrix...) before any source
// module is loaded: matrix.ts extends DOMMatrix and dom.ts captures
// window.document at import time.
GlobalRegistrator.register({
  settings: {
    disableJavaScriptFileLoading: true,
    disableCSSFileLoading: true,
  },
});
