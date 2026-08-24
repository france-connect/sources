# command-elastic-instance

Instance running the `elastic-transform` and `elastic-reindex` commands against
the stats Elasticsearch cluster.

## Documentation

| Document | Scope |
|---|---|
| [_doc/workflow.md](./_doc/workflow.md) | How the commands work: the transform → watcher → reindex → watcher cycle and the control index states. |
| [_doc/schedules.md](./_doc/schedules.md) | How the GitLab CI schedules drive the pipeline: image build, `auto` / `replay` modes, recurring schedules and manual replays. |
