/**
 * Based on withAstro docs file tree
 * https://github.com/withastro/docs/blob/03ff35e6cf3f40f7b710403e7717288cf5927cc6/src/components/internal/rehype-file-tree.ts
 * MIT License
 *
 * Copyright (c) 2022 withastro
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import type { Element } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import type { Child } from 'hastscript';
import { rehype } from 'rehype';
import { CONTINUE, SKIP, visit } from 'unist-util-visit';
import { getIcon } from './file-tree-icons';

/** Make a text node with the pass string as its contents. */
const Text = (value = ''): { type: 'text'; value: string } => ({
	type: 'text',
	value,
});

/** Convert an HTML string containing an SVG into a HAST element node. */
const makeSVGIcon = (svgString: string) => {
	const root = fromHtml(svgString, { fragment: true });
	const svg = root.children[0] as Element;
	svg.properties = {
		...svg.properties,
		width: 16,
		height: 16,
		class: 'tree-icon',
		'aria-hidden': 'true',
	};
	return svg;
};

const FileIcon = (filename: string) => {
	const { svg } = getIcon(filename);
	return makeSVGIcon(svg);
};

const FolderIcon = makeSVGIcon(
	'<svg viewBox="0 0 20 20"><path d="M14.77 6.45H9.8v-.47A.97.97 0 0 0 8.83 5H3.75v10H15.7V7.42a.91.91 0 0 0-.93-.97Z"/></svg>',
);

export const fileTreeProcessor = rehype().use(() => (tree: Element, file) => {
	const { directoryLabel } = file.data as { directoryLabel: string };
	visit(tree, 'element', (node) => {
		// Strip nodes that only contain newlines
		node.children = node.children.filter(
			(child) => child.type === 'comment' || child.type !== 'text' || !/^\n+$/.test(child.value),
		);

		if (node.tagName !== 'li') return CONTINUE;

		// Ensure node has properties so we can assign classes later.
		if (!node.properties) node.properties = {};

		const [firstChild, ...otherChildren] = node.children;

		const comment: Array<Child> = [];
		if (firstChild?.type === 'text') {
			const [filename, ...fragments] = firstChild.value.split(' ');
			firstChild.value = filename || '';
			comment.push(fragments.join(' '));
		}
		const subTreeIndex = otherChildren.findIndex((child) => child.type === 'element' && child.tagName === 'ul');
		const commentNodes = subTreeIndex > -1 ? otherChildren.slice(0, subTreeIndex) : [...otherChildren];
		otherChildren.splice(0, subTreeIndex > -1 ? subTreeIndex : otherChildren.length);
		comment.push(...commentNodes);

		const firstChildTextContent = toString(firstChild);

		// Decide a node is a directory if it ends in a `/` or contains another list.
		const isDirectory =
			/\/\s*$/.test(firstChildTextContent) ||
			otherChildren.some((child) => child.type === 'element' && child.tagName === 'ul');
		const isPlaceholder = /^\s*(\.{3}|…)\s*$/.test(firstChildTextContent);
		const isHighlighted = firstChild.type === 'element' && firstChild.tagName === 'strong';
		const hasContents = otherChildren.length > 0;

		const fileExtension = isDirectory ? 'dir' : firstChildTextContent.trim().split('.').pop() || '';

		const icon = h('span', isDirectory ? FolderIcon : FileIcon(firstChildTextContent));
		if (!icon.properties) icon.properties = {};
		if (isDirectory) {
			icon.children.unshift(h('span', { class: 'sr-only' }, directoryLabel));
		}

		node.properties.class = isDirectory ? 'directory' : 'file';
		if (isPlaceholder) node.properties.class += ' empty';
		node.properties['data-filetype'] = fileExtension;

		const treeEntry = h(
			'span',
			{ class: 'tree-entry' },
			h('span', { class: isHighlighted ? 'highlight' : '' }, [isPlaceholder ? null : icon, firstChild]),
			Text(comment.length > 0 ? ' ' : ''),
			comment.length > 0 ? h('span', { class: 'comment' }, ...comment) : Text(),
		);

		if (isDirectory) {
			node.children = [
				h('details', { open: hasContents }, [
					h('summary', treeEntry),
					...(hasContents ? otherChildren : [h('ul', h('li', '…'))]),
				]),
			];
			// Continue down the tree.
			return CONTINUE;
		}

		node.children = [treeEntry, ...otherChildren];

		// Files can’t contain further files or directories, so skip iterating children.
		return SKIP;
	});
});
