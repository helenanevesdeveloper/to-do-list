# Git hooks

Enable the tracked hooks in this repository with:

```sh
git config core.hooksPath .githooks
```

This repository currently provides:

- `commit-msg`: rejects commit messages that do not follow Conventional Commits
