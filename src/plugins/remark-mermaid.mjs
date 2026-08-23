/**
 * Turn ```mermaid fenced blocks into `<pre class="mermaid">` so Shiki leaves
 * them alone and the client-side renderer (see `src/components/Mermaid.astro`)
 * can pick them up.
 */

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function transform(node) {
  if (!node || !Array.isArray(node.children)) return;
  node.children = node.children.map(child => {
    if (child.type === 'code' && child.lang === 'mermaid') {
      return {
        type: 'html',
        value: `<pre class="mermaid" data-mermaid>${escapeHtml(child.value)}</pre>`,
      };
    }
    transform(child);
    return child;
  });
}

export default function remarkMermaid() {
  return (tree) => transform(tree);
}
