# Contributing to oneRepo

## Reporting issues

Use the [Bug Report issue template](https://github.com/paularmstrong/onerepo/issues/new?assignees=&labels=bug%2Ctriage&projects=&template=01-bug-report.yml).

The template will guide you through asking for extra information. Fill out as much as possible to help maintainers help you faster.

## Requesting features

Use the [Feature Request issue template](https://github.com/paularmstrong/onerepo/issues/new?assignees=&labels=%F0%9F%9A%80+feature%2Ctriage&projects=&template=06-feature-change.yml).

## Code changes

### Pre-requisites

Ensure you have the following before beginning:

- ✅ Using a supported version of Node.js (`^20.19.0 || ^22.10.0 || ^24`).
- ✅ Node.js’s [corepack](https://nodejs.org/docs/latest-v20.x/api/corepack.html#corepack) is enabled.
- ✅ The `oneRepo` CLI is [installed](/docs/getting-started/#quick-start).
- ✅ Forked and cloned the [repository](https://github.com/paularmstrong/onerepo).

### Local development

1. Use the `one` command-line interface directly from the installed command.

   The CLI will properly pass-through and run the local source, so all of your changes will instantly be available for debugging.

1. Make your code changes.
1. Do your best to make changes easy to review:
   - ✅ Add and update tests
   - ✅ Adjust tsdoc comments
   - ✅ Add documentation
   - ✅ Ensure a pre-commit hooks run and pass

1. Create your pull request against the oneRepo repository.

   Ensure that you check the box to “[Allow edits and access to secrets by maintainers](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork)”. This will allow maintainers to help, collaborate, and move your changes through quicker with fewer back-and-forth requests.

### Documentation changes

:::caution[Generated content]
Most documentation requires a full terminal in order to ensure proper formatting, linting, and more. Furthermore if documentation appears within a signed `@generated` block, it is auto-generated, either using [typedoc](https://typedoc.org/) or from [oneRepo docgen](https://onerepo.tools/plugins/docgen/).

Please follow the steps for [code changes](#local-development) before making documentation updates.
:::

1. Run the documentation application:

   ```sh
   one workspace docs start
   ```

2. After tsdoc or other code changes, collect the content to see generated updates:

   ```sh title="Collect all content"
   one workspace docs collect-content
   ```

   ```sh title="Update API reference"
   one workspace docs typedoc
   ```

#### Style guide

Always capitalize the following words unless referred to in a context outside of their meanings from the [glossary](https://onerepo.tools/concepts/primer/#glossary):

- Monorepo
- Root
- Workspace
- Graph

## License

When you submit code changes, your submissions are understood to be under the same [MIT License](https://github.com/paularmstrong/onerepo/blob/main/LICENSE.md) that covers the project.
