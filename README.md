# rutan-game-utils

> A development repository for a utility package for game development.

## Development

```sh
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Check formatting and types, and run configured linters
pnpm lint

# Run unit tests
pnpm test

# Build and test the packed packages as a consumer
pnpm test:packages
```

To run a command for one package, use a filter from the repository root:

```sh
pnpm --filter @rutan/frame-tween build
pnpm --filter @rutan/frame-tween test
```
