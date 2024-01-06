import { createHash } from 'node:crypto';

export type SigningStatus = 'valid' | 'invalid' | 'unsigned';

/**
 * This code is adapted from fbjs: https://github.com/facebook/fbjs/blob/c47b64a43f307bb8e56bc44215982ab74fd9d150/packages/signedsource/index.js
 * Licensed under the MIT license
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
const generated = '@' + 'generated';
const token = '<<SignedSource::*O*zOeWoEQle#+L!plEphiEmie@IsG>>';
const pattern = new RegExp(`${generated} (?:SignedSource<<([a-f0-9]{32})>>)`);

const TokenNotFoundError = new Error(`SignedSource.signFile(...): Cannot sign file without token: ${token}`);

function hash(data: string) {
	const md5sum = createHash('md5');
	md5sum.update(data, 'utf8');
	return md5sum.digest('hex');
}

export const signingToken = `${generated} ${token}`;

/**
 * Signs a source file which contains a signing token. Signing modifies only the signing token, so the token should be placed inside a comment in order for signing to not change code semantics.
 */
export function signFile(contents: string) {
	if (!contents.includes(token)) {
		if (isSigned(contents)) {
			// Signing a file that was previously signed.
			contents = contents.replace(pattern, `${signingToken}`);
		} else {
			throw TokenNotFoundError;
		}
	}
	return contents.replace(token, `SignedSource<<${hash(contents)}>>`);
}

/**
 * Checks whether a file is signed *without* verifying the signature.
 */
export function isSigned(contents: string) {
	return pattern.exec(contents) !== null;
}

/**
 * Verify the signature in a signed file.
 */
export function verifySignature(contents: string): SigningStatus {
	const matches = pattern.exec(contents);
	if (!matches) {
		return 'unsigned';
	}
	const actual = matches[1];
	// Replace signature with `newToken` and hash to see if it matches the hash
	// in the file. For backwards compatibility, also try `oldToken`.
	const unsigned = contents.replace(pattern, `${signingToken}`);
	const isSigned = hash(unsigned) === actual;

	return isSigned ? 'valid' : 'invalid';
}
