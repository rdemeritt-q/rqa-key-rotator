# rqa-key-rotator

Rotates data keys for the export service.

It asks a KMS key for a new AES-256 data key and prints the wrapped (encrypted) copy as JSON.

## Configuration

Copy `.env.template` to `.env` and set:

- `AWS_REGION`: region of the key
- `KMS_KEY_ID`: key id or alias

Credentials come from the standard AWS provider chain.

## Run

    npm ci
    node src/rotate.js

## Test

    npm test

The tests use a fake client and make no network calls.

## Docker

    docker build -t rqa-key-rotator .
    docker run --rm --env-file .env rqa-key-rotator
