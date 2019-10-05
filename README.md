# puppeteer-event-popper
GitHub Action to use Puppeteer to publish event description to Eventpop

## How to use

1. Deploy an instance of ![event-popper](https://github.com/dtinth/event-popper) to Netlify.

   This gives you a REST API that you can use to deploy event descriptions to Eventpop,
   so that you don’t need to put in your Eventpop credentials in your CD pipeline.

2. Create an HTML file. That file should declare a global JavaScript function called `getEventpopDescription()`
   which should return the HTML content to be deployed.
   It may optionally return a Promise, in which this script will await for the result.

   See [example/index.html](example/index.html) for a bare-bones example.

3. Go to your GitHub Repository settings &rarr; Secrets.
   Add the following secrets:

   - `EVENT_POPPER_API_KEY`
   - `EVENT_POPPER_URL`

4. Add the following workflow:

    ```yaml
    name: Deploy event description to Eventpop
    on:
      push:
        branches:
          - master
    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v1
        - uses: docker://dtinth/puppeteer-event-popper:latest
          with:
            args: description.html
          env:
            EVENT_POPPER_API_KEY: ${{ secrets.EVENT_POPPER_API_KEY }}
            EVENT_POPPER_URL: ${{ secrets.EVENT_POPPER_URL }}
    ```