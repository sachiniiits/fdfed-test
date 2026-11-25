'use strict';

import { useLayoutEffect } from 'react';

// Joins/splits the stylesheet list. Written as an escape sequence rather than a
// literal NUL byte so the file stays plain UTF-8 text (a raw 0x00 made Git
// treat it as binary). NUL never occurs in CSS, so it is a safe separator.
const SEPARATOR = '\u0000';

export function usePageStyles(...cssTexts) {
  // The spread makes a new array every render, so the dependency is the joined
  // text: stable across renders, different when the caller swaps stylesheets.
  const key = cssTexts.join(SEPARATOR);

  useLayoutEffect(() => {
    const nodes = key.split(SEPARATOR).map((text) => {
      const el = document.createElement('style');
      el.setAttribute('data-page-style', '');
      el.textContent = text;
      document.head.appendChild(el);
      return el;
    });

    return () => {
      nodes.forEach((el) => el.remove());
    };
  }, [key]);
}
