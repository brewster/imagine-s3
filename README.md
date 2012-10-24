# Imagine-S3

S3 storage for [Imagine](https://github.com/brewster/imagine).

## Installation

If you haven't already done so, make sure to install `imagine-s3` in
your Imagine folder:

``` bash
$ npm install imagine-s3
```

Then place the following into your `config.json` file for
Imagine:

``` javascript
"storage": "imagine-s3",

"imagine-s3": {
  "key": "KEY",
  "secret": "SECRET",
  "bucket": "BUCKET"
}
```
Replace `KEY`, `SECRET` and `BUCKET` with your corresponding info.

## License

Imagine-S3 is distributed under the MIT License. See
[LICENSE](https://github.com/brewster/imagine-s3/blob/master/LICENSE) for more
details.
