// @ts-ignore
import type { Context } from 'https://edge.netlify.com/';

const COOKIE_NAME = 'dt';
const themes = ['light', 'dark'] as const;

export default async (req: Request, context: Context) => {
	const url = new URL(req.url);
	const params = url.searchParams;

	if (!params.has('theme')) {
		console.log('missing theme');
		return new Response(JSON.stringify({ error: 'Missing theme parameter' }), {
			status: 400,
			headers: {
				'content-type': 'application/json',
			},
		});
	}

	const theme = params.get('theme') as typeof themes[number];
	const auto = params.get('auto') === 'true';

	if (!themes.includes(theme)) {
		console.log('invalid theme', theme);
		return new Response(JSON.stringify({ error: `Invalid theme: ${theme}` }), {
			status: 400,
			headers: {
				'content-type': 'application/json',
			},
		});
	}

	console.log({ auto, theme, ua: req.headers.get('user-agent') });

	context.cookies.set({
		name: COOKIE_NAME,
		value: params.toString(),
		path: '/',
		secure: true,
		httpOnly: true,
		sameSite: 'Strict',
		expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
	});

	return new Response(JSON.stringify({ error: false }), {
		status: 200,
		headers: {
			'content-type': 'application/json',
		},
	});
};
