# Changesets

Every user-visible package change must include a changeset:

```bash
bunx changeset
```

Choose the affected packages, describe the behavior change, and use semantic
versioning. The release workflow opens a version PR and publishes merged
versions with npm provenance.
