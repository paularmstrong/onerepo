import { HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts';

const COOKIE_NAME = 'dt';

export default async (req, context) => {
	const res = await context.next();
	const type = res.headers.get('content-type');
	if (!type?.startsWith('text/html')) {
		return;
	}

	const prefers = req.headers.get('sec-ch-prefers-color-scheme');
	const rawCookie = context.cookies.get(COOKIE_NAME) ?? 'auto=true&theme=light';
	const params = new URLSearchParams(rawCookie);
	const isAuto = params.get('auto') === 'true';
	const theme = isAuto && prefers ? prefers : params.get('theme') || 'light';

	console.log({
		cookie: context.cookies.get(COOKIE_NAME) || undefined,
		isAuto,
		prefers,
		theme,
		ua: req.headers.get('user-agent'),
	});

	return new HTMLRewriter()
		.on('html', {
			element(element) {
				const original = element.getAttribute('class') || false;
				element.setAttribute('class', [theme, original].filter(Boolean).join(' '));
				element.setAttribute('data-auto-theme', isAuto ? 'true' : 'false');
			},
		})
		.on(isAuto ? 'option[value="auto"]' : `option[value="${theme}"]`, {
			element(element) {
				element.setAttribute('selected', 'selected');
			},
		})
		.on(`[data-theme-icon]`, {
			element(element) {
				const value = element.getAttribute('data-theme-icon');
				if (value !== theme) {
					const classlist = element.getAttribute('class') || '';
					element.setAttribute('class', `${classlist} hidden`);
				}
			},
		})
		.transform(res);
};
