# Releases and Rojo

A release ties every error and session to the code that produced it. With Rojo, Workshell also maps Roblox instance paths back to your source files, so `ServerScriptService.Combat.Weapon:42` reads as `src/server/Combat/Weapon.server.luau:42`.

## Without any setup

If you do nothing, the SDK uses `game.PlaceVersion` as the release. You still get per-release error counts and regressions, just without commits or file paths.

## With `workshell release`

Run it in CI before `rojo build`:

```sh
WORKSHELL_URL=https://workshell.example.com WORKSHELL_KEY=wsk_... \
  workshell release -project default.project.json -out src/shared/WorkshellRelease.json
```

It does three things:

1. Reads the git commit, branch, message and author.
2. Writes `WorkshellRelease.json`. Rojo syncs JSON files as ModuleScripts and the SDK picks it up automatically, so every error and session is tagged with the commit.
3. Generates a Rojo sourcemap and uploads it, so stack frames resolve to files. When a GitHub repository is connected, each frame links to that file at that exact commit.

The release name defaults to the short commit hash, with `-dirty` appended when there are uncommitted changes.

### Flags

| Flag | Default | |
| --- | --- | --- |
| `-url` | `$WORKSHELL_URL` | Workshell server URL |
| `-key` | `$WORKSHELL_KEY` | Project ingest key |
| `-signing-secret` | `$WORKSHELL_SIGNING_SECRET` | Needed if the project requires signed requests |
| `-version` | short commit | Release name |
| `-project` | `default.project.json` | Rojo project used to generate the sourcemap |
| `-sourcemap` | | Use an existing `rojo sourcemap` JSON file instead of running Rojo |
| `-out` | | Where to write the `WorkshellRelease.json` module |
| `-place-version` | | The Roblox place version this release was published as |
| `-dry-run` | `false` | Print what would be sent instead of uploading |

## What releases show

The **Releases** page lists every version your servers have run, with its commit, the issues it introduced, and its error-free session rate. An issue resolved in one release that appears again later is marked as a [regression](/features/issues#regressions).

You can also set the release yourself with the `release` option of `Workshell.init`.
