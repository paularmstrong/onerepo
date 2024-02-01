/**
 * This code is adapted from strip-json-comments: https://github.com/sindresorhus/strip-json-comments/tree/main
 *
 * Licensed under the MIT license
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 */

const strip = (str: string, start?: number, end?: number) => str.slice(start, end).replace(/\S/g, '');

const isEscaped = (jsonString: string, quotePosition: number) => {
	let index = quotePosition - 1;
	let backslashCount = 0;

	while (jsonString[index] === '\\') {
		index -= 1;
		backslashCount += 1;
	}

	return Boolean(backslashCount % 2);
};

export default function stripJsonComments(jsonString: string) {
	const singleComment = Symbol('singleComment');
	const multiComment = Symbol('multiComment');

	if (typeof jsonString !== 'string') {
		throw new TypeError(`Expected argument \`jsonString\` to be a \`string\`, got \`${typeof jsonString}\``);
	}

	let isInsideString: boolean = false;
	let isInsideComment: symbol | false = false;
	let offset = 0;
	let buffer = '';
	let result = '';
	let commaIndex = -1;

	for (let index = 0; index < jsonString.length; index++) {
		const currentCharacter = jsonString[index];
		const nextCharacter = jsonString[index + 1];

		if (!isInsideComment && currentCharacter === '"') {
			// Enter or exit string
			const escaped = isEscaped(jsonString, index);
			if (!escaped) {
				isInsideString = !isInsideString;
			}
		}

		if (isInsideString) {
			continue;
		}

		if (!isInsideComment && currentCharacter + nextCharacter === '//') {
			// Enter single-line comment
			buffer += jsonString.slice(offset, index);
			offset = index;
			isInsideComment = singleComment;
			index++;
		} else if (isInsideComment === singleComment && currentCharacter + nextCharacter === '\r\n') {
			// Exit single-line comment via \r\n
			index++;
			isInsideComment = false;
			buffer += strip(jsonString, offset, index);
			offset = index;
			continue;
		} else if (isInsideComment === singleComment && currentCharacter === '\n') {
			// Exit single-line comment via \n
			isInsideComment = false;
			buffer += strip(jsonString, offset, index);
			offset = index;
		} else if (!isInsideComment && currentCharacter + nextCharacter === '/*') {
			// Enter multiline comment
			buffer += jsonString.slice(offset, index);
			offset = index;
			isInsideComment = multiComment;
			index++;
			continue;
		} else if (isInsideComment === multiComment && currentCharacter + nextCharacter === '*/') {
			// Exit multiline comment
			index++;
			isInsideComment = false;
			buffer += strip(jsonString, offset, index + 1);
			offset = index + 1;
			continue;
		} else if (!isInsideComment) {
			if (commaIndex !== -1) {
				if (currentCharacter === '}' || currentCharacter === ']') {
					// Strip trailing comma
					buffer += jsonString.slice(offset, index);
					result += strip(buffer, 0, 1) + buffer.slice(1);
					buffer = '';
					offset = index;
					commaIndex = -1;
				} else if (
					currentCharacter !== ' ' &&
					currentCharacter !== '\t' &&
					currentCharacter !== '\r' &&
					currentCharacter !== '\n'
				) {
					// Hit non-whitespace following a comma; comma is not trailing
					buffer += jsonString.slice(offset, index);
					offset = index;
					commaIndex = -1;
				}
			} else if (currentCharacter === ',') {
				// Flush buffer prior to this point, and save new comma index
				result += buffer + jsonString.slice(offset, index);
				buffer = '';
				offset = index;
				commaIndex = index;
			}
		}
	}

	return result + buffer + (isInsideComment ? strip(jsonString.slice(offset)) : jsonString.slice(offset));
}
