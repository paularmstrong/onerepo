export interface IPackageManager {
	install(): Promise<void>;
	add(packages: string | Array<string>, opts?: { dev?: boolean }): Promise<void>;
	remove(packages: string | Array<string>): Promise<void>;
	publish(): Promise<void>;
}
