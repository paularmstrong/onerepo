/**
 * This needs to be pulled out into a TS file in order for eslint to parse from markdown-remark.
 */
import { createMarkdownProcessor } from '@astrojs/markdown-remark';

export async function getMarkdownRenderer() {
	const { render } = await createMarkdownProcessor({});
	return render;
}
