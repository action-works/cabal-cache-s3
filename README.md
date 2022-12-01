# cache

This action allows caching dependencies to S3 to improve workflow execution time.

<a href="https://github.com/action-works/cabal-cache-s3/actions?query=workflow%3ATests"><img alt="GitHub Actions status" src="https://github.com/action-works/cabal-cache-s3/workflows/Tests/badge.svg?branch=main&event=push"></a>

## Documentation

The Github Action supports caching Haskell dependencies to S3.  To support forks, it also allows pulling dependencies from HTTP.
This makes it possible for forks to enjoy readonly cache via S3's static website hosting or AWS Cloud Front.

The following is an example steps for caching Haskell project in Github Actions:

```yaml
- name: Cabal cache over S3
  uses: action-works/cabal-cache-s3@v1
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  with:
    region: us-west-2
    dist-dir: dist-newstyle
    store-path: ${{ steps.setup-haskell.outputs.cabal-store }}
    threads: 16
    archive-uri: ${{ secrets.BINARY_CACHE_URI }}
    skip: "${{ secrets.BINARY_CACHE_URI == '' }}"

- name: Cabal cache over HTTPS
  uses: action-works/cabal-cache-s3@v1
  with:
    dist-dir: dist-newstyle
    store-path: ${{ steps.setup-haskell.outputs.cabal-store }}
    threads: 16
    archive-uri: https://cache.haskellworks.io/archive
    skip: "${{ secrets.BINARY_CACHE_URI != '' }}"
```

### Support for non-AWS S3 backends

See [backblaze.yml](https://github.com/haskell-works/cabal-cache/blob/main/.github/workflows/backblaze.yml)
for an example.

## Contributing
We would love for you to contribute to `action-works/cabal-cache-s3`, pull requests are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)
