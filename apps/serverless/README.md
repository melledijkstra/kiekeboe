
# Deno Serverless Development

## Prerequisites
Before you start, ensure you have the following tools installed:

- Deno: https://docs.deno.com/runtime/getting_started/installation/

## Deploying to Google Cloud

```shell
gcloud run deploy python-http-function \
--source . \
--function unsplash_function \
--base-image python312 \
--region europe-southwest1 \
--allow-unauthenticated
```

## Local development

You will need to set any environment variables used by the script

```shell
reload functions-framework --target unsplash_function --debug
```