declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"docs": {
"api/index.md": {
	id: "api/index.md";
  slug: "api";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"api/namespaces/builders.md": {
	id: "api/namespaces/builders.md";
  slug: "api/namespaces/builders";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"api/namespaces/file.md": {
	id: "api/namespaces/file.md";
  slug: "api/namespaces/file";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"api/namespaces/git.md": {
	id: "api/namespaces/git.md";
  slug: "api/namespaces/git";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"changelogs/@onerepo/builders.mdx": {
	id: "changelogs/@onerepo/builders.mdx";
  slug: "changelogs/onerepo/builders";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/file.mdx": {
	id: "changelogs/@onerepo/file.mdx";
  slug: "changelogs/onerepo/file";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/git.mdx": {
	id: "changelogs/@onerepo/git.mdx";
  slug: "changelogs/onerepo/git";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/graph.mdx": {
	id: "changelogs/@onerepo/graph.mdx";
  slug: "changelogs/onerepo/graph";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/logger.mdx": {
	id: "changelogs/@onerepo/logger.mdx";
  slug: "changelogs/onerepo/logger";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/package-manager.mdx": {
	id: "changelogs/@onerepo/package-manager.mdx";
  slug: "changelogs/onerepo/package-manager";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/plugin-docgen.mdx": {
	id: "changelogs/@onerepo/plugin-docgen.mdx";
  slug: "changelogs/onerepo/plugin-docgen";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/plugin-eslint.mdx": {
	id: "changelogs/@onerepo/plugin-eslint.mdx";
  slug: "changelogs/onerepo/plugin-eslint";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/plugin-jest.mdx": {
	id: "changelogs/@onerepo/plugin-jest.mdx";
  slug: "changelogs/onerepo/plugin-jest";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/plugin-performance-writer.mdx": {
	id: "changelogs/@onerepo/plugin-performance-writer.mdx";
  slug: "changelogs/onerepo/plugin-performance-writer";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/plugin-prettier.mdx": {
	id: "changelogs/@onerepo/plugin-prettier.mdx";
  slug: "changelogs/onerepo/plugin-prettier";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/plugin-typescript.mdx": {
	id: "changelogs/@onerepo/plugin-typescript.mdx";
  slug: "changelogs/onerepo/plugin-typescript";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/plugin-vitest.mdx": {
	id: "changelogs/@onerepo/plugin-vitest.mdx";
  slug: "changelogs/onerepo/plugin-vitest";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/subprocess.mdx": {
	id: "changelogs/@onerepo/subprocess.mdx";
  slug: "changelogs/onerepo/subprocess";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/test-cli.mdx": {
	id: "changelogs/@onerepo/test-cli.mdx";
  slug: "changelogs/onerepo/test-cli";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/@onerepo/yargs.mdx": {
	id: "changelogs/@onerepo/yargs.mdx";
  slug: "changelogs/onerepo/yargs";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"changelogs/index.mdx": {
	id: "changelogs/index.mdx";
  slug: "changelogs";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"concepts/primer.mdx": {
	id: "concepts/primer.mdx";
  slug: "concepts/primer";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"concepts/why-onerepo.mdx": {
	id: "concepts/why-onerepo.mdx";
  slug: "concepts/why-onerepo";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"core/changes.mdx": {
	id: "core/changes.mdx";
  slug: "core/changes";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"core/codeowners.mdx": {
	id: "core/codeowners.mdx";
  slug: "core/codeowners";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"core/create.mdx": {
	id: "core/create.mdx";
  slug: "core/create";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"core/dependencies.mdx": {
	id: "core/dependencies.mdx";
  slug: "core/dependencies";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"core/generate.mdx": {
	id: "core/generate.mdx";
  slug: "core/generate";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"core/graph.mdx": {
	id: "core/graph.mdx";
  slug: "core/graph";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"core/hooks.mdx": {
	id: "core/hooks.mdx";
  slug: "core/hooks";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"core/install.mdx": {
	id: "core/install.mdx";
  slug: "core/install";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"core/tasks.mdx": {
	id: "core/tasks.mdx";
  slug: "core/tasks";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"core/workspace.mdx": {
	id: "core/workspace.mdx";
  slug: "core/workspace";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"discord.mdx": {
	id: "discord.mdx";
  slug: "discord";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"docs/commands.mdx": {
	id: "docs/commands.mdx";
  slug: "docs/commands";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"docs/config.mdx": {
	id: "docs/config.mdx";
  slug: "docs/config";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"docs/getting-started.mdx": {
	id: "docs/getting-started.mdx";
  slug: "docs/getting-started";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"docs/log-output.mdx": {
	id: "docs/log-output.mdx";
  slug: "docs/log-output";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"docs/source-dependencies.mdx": {
	id: "docs/source-dependencies.mdx";
  slug: "docs/source-dependencies";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"plugins/docgen.mdx": {
	id: "plugins/docgen.mdx";
  slug: "plugins/docgen";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"plugins/docgen/example.mdx": {
	id: "plugins/docgen/example.mdx";
  slug: "plugins/docgen/example";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"plugins/eslint.mdx": {
	id: "plugins/eslint.mdx";
  slug: "plugins/eslint";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"plugins/index.mdx": {
	id: "plugins/index.mdx";
  slug: "plugins";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"plugins/jest.mdx": {
	id: "plugins/jest.mdx";
  slug: "plugins/jest";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"plugins/performance-writer.mdx": {
	id: "plugins/performance-writer.mdx";
  slug: "plugins/performance-writer";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"plugins/prettier.mdx": {
	id: "plugins/prettier.mdx";
  slug: "plugins/prettier";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"plugins/typescript.mdx": {
	id: "plugins/typescript.mdx";
  slug: "plugins/typescript";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"plugins/vitest.mdx": {
	id: "plugins/vitest.mdx";
  slug: "plugins/vitest";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"project/code-of-conduct.mdx": {
	id: "project/code-of-conduct.mdx";
  slug: "project/code-of-conduct";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"project/contributing.mdx": {
	id: "project/contributing.mdx";
  slug: "project/contributing";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"project/index.mdx": {
	id: "project/index.mdx";
  slug: "project";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"visualize.mdx": {
	id: "visualize.mdx";
  slug: "visualize";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		"i18n": Record<string, {
  id: string;
  collection: "i18n";
  data: InferEntrySchema<"i18n">;
}>;

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
