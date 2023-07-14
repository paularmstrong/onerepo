import parse from '@changesets/parse';
import changelogFunctions from './index';

const getReleaseLine = changelogFunctions.getReleaseLine;

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock('@changesets/get-github-info', (): typeof import('@changesets/get-github-info') => {
	const data = {
		commit: 'a085003',
		user: 'paularmstrong',
		pull: 1613,
		repo: 'paularmstrong/onerepo',
	};
	const links = {
		user: `[@${data.user}](https://github.com/${data.user})`,
		pull: `[#${data.pull}](https://github.com/${data.repo}/pull/${data.pull})`,
		commit: `[\`${data.commit}\`](https://github.com/${data.repo}/commit/${data.commit})`,
	};
	return {
		async getInfo({ commit, repo }) {
			expect(commit).toBe(data.commit);
			expect(repo).toBe(data.repo);
			return {
				pull: data.pull,
				user: data.user,
				links,
			};
		},
		async getInfoFromPullRequest({ pull, repo }) {
			expect(pull).toBe(data.pull);
			expect(repo).toBe(data.repo);
			return {
				commit: data.commit,
				user: data.user,
				links,
			};
		},
	};
});

const getChangeset = (content: string, commit: string | undefined) => {
	return [
		{
			...parse(
				`---
  pkg: "minor"
  ---

  something
  ${content}
  `,
			),
			id: 'some-id',
			commit,
		},
		'minor',
		{ repo: data.repo },
	] as const;
};

const data = {
	commit: 'a085003',
	user: 'paularmstrong',
	pull: 1613,
	repo: 'paularmstrong/onerepo',
};

describe('changeset-changelog', () => {
	describe.each([data.commit, 'wrongcommit', undefined])('with commit from changeset of %s', (commitFromChangeset) => {
		describe.each(['pr', 'pull request', 'pull'])('override pr with %s keyword', (keyword) => {
			test.each(['with #', 'without #'] as const)('%s', async (kind) => {
				expect(
					await getReleaseLine(
						...getChangeset(`${keyword}: ${kind === 'with #' ? '#' : ''}${data.pull}`, commitFromChangeset),
					),
				).toEqual(
					`\n\n- something [#1613](https://github.com/paularmstrong/onerepo/pull/1613) ([@paularmstrong](https://github.com/paularmstrong))\n`,
				);
			});
		});

		test('override commit with commit keyword', async () => {
			expect(await getReleaseLine(...getChangeset(`commit: ${data.commit}`, commitFromChangeset))).toEqual(
				`\n\n- something [#1613](https://github.com/paularmstrong/onerepo/pull/1613) ([@paularmstrong](https://github.com/paularmstrong))\n`,
			);
		});
	});

	describe.each(['author', 'user'])('override author with %s keyword', (keyword) => {
		test.each(['with @', 'without @'] as const)('%s', async (kind) => {
			expect(
				await getReleaseLine(...getChangeset(`${keyword}: ${kind === 'with @' ? '@' : ''}other`, data.commit)),
			).toEqual(
				`\n\n- something [#1613](https://github.com/paularmstrong/onerepo/pull/1613) ([@other](https://github.com/other))\n`,
			);
		});
	});

	test('with multiple authors', async () => {
		expect(
			await getReleaseLine(
				...getChangeset(['author: @paularmstrong', 'author: @mitchellhamilton'].join('\n'), data.commit),
			),
		).toMatchInlineSnapshot(`
    "

    - something [#1613](https://github.com/paularmstrong/onerepo/pull/1613) ([@paularmstrong](https://github.com/paularmstrong), [@mitchellhamilton](https://github.com/mitchellhamilton))
    "
  `);
	});
});
