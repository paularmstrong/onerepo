import * as subprocess from '@onerepo/subprocess';
import * as file from '@onerepo/file';
import { readChange } from '../read-change';

describe('readChange', () => {
	beforeEach(() => {
		vi.spyOn(subprocess, 'run').mockResolvedValue(['abc123', '']);
	});

	test('returns null if invalid format', async () => {
		vi.spyOn(file, 'read').mockResolvedValue('asdf');
		await expect(readChange('asdf.md')).resolves.toBeNull();
	});

	test('returns null if yaml parsing fails', async () => {
		vi.spyOn(file, 'read').mockResolvedValue('---\n*(^\n---\n\nasdf');
		await expect(readChange('asdf.md')).resolves.toBeNull();
	});

	test('returns data and contents', async () => {
		vi.spyOn(file, 'read').mockResolvedValue('---\ntype: minor\n---\n\nasdf');
		await expect(readChange('asdf.md')).resolves.toEqual({
			type: 'minor',
			content: 'asdf',
			ref: 'abc123',
			filepath: 'asdf.md',
		});
	});
});
