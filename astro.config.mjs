import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

function preserveResearchLinks() {
  return (tree, file) => {
    if (!/[\\/]research\.md$/.test(file.path || '')) return;
    const visit = (node) => {
      if (node.tagName === 'a' && /^https?:\/\//.test(node.properties?.href || '')) {
        node.properties.target = '_blank';
        node.properties.rel = ['noreferrer', 'noopener'];
      }
      for (const child of node.children || []) visit(child);
    };
    visit(tree);
  };
}

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || 'https://yujia-liu.com',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  markdown: {
    processor: unified({
      rehypePlugins: [preserveResearchLinks],
    }),
  },
});
