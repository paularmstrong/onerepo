export async function importChangesets<T>(pkg: string): Promise<T> {
	const lib = await import(pkg);
	return getDefault(lib) as T;
}

function getDefault(pkg: unknown) {
	if (typeof pkg === 'object' && Reflect.ownKeys(pkg as object).includes('default')) {
		return getDefault((pkg as { default: unknown }).default);
	}
	return pkg;
}
