# Capacity

Workshell stores everything in one SQLite database with a single writer. That keeps it simple to run and to back up, and it is fast, but it is one machine. Redis makes the ingest queue durable; it does not make the database scale horizontally.

## Measured

On one machine (an 8-core Ryzen 7 5700X), 100 simulated game servers sent 1.1 million items over 9 minutes while six dashboard pages were polled throughout:

| | p95 |
| --- | --- |
| Issues, logs and sessions | about 11 ms or less |
| Overview | about 230 ms |
| Server health | about 360 ms |
| Performance (scans a day of traces) | about 760 ms |

Ingest kept up the whole time: everything was written within 2 seconds of the last send, and nothing errored.

A separate test sent 200,000 copies of one crash from 200 servers. Because issues keep [20 full events per release](/features/issues#bad-updates-don-t-flood-the-dashboard), the database grew by under 5 MB.

## What grows

- **Logs and spans** are usually the largest tables. Lower the log retention period if the database grows faster than you'd like.
- **Analytics-style pages** (performance, server health) scan raw rows, so they slow down as a project's history grows into tens of millions of rows.
- **Errors** stay small during incidents, thanks to the per-issue cap.

## Before a big launch

Load-test with traffic shaped like your game's, including dashboard use during ingestion. The simulator in the repository (`cmd/workshell-sim`) sends realistic mock servers, players and cheaters, and can backfill days of history quickly.
