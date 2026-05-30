/** Mark markdown <img> tags so Astro dev audit skips them (synced/public content). */
export function rehypeMarkdownImages() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
      node.properties ??= {};
      if (!node.properties.dataImageComponent) {
        node.properties.dataImageComponent = 'true';
      }
    });
  };
}

/** @param {import('hast').Root} tree @param {string} test @param {(node: import('hast').Element) => void} fn */
function visit(tree, test, fn) {
  walk(tree);
  function walk(node) {
    if (node.type === 'element') {
      if (node.tagName === test) fn(node);
      for (const child of node.children ?? []) walk(child);
    } else if (node.children) {
      for (const child of node.children) walk(child);
    }
  }
}
