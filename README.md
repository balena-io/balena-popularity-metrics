Balena Popularity Metrics
================

This application connects to different data sources on balena environment (balena-api, balena-monitor) to fetch informations regarding balena resources and expose them for different clients ([EFP](https://github.com/balena-io/efp-standalone) being one example).

### Development

To run the development server locally just run:
```npm run dev```. Usually the default port `80` is blocked so you can also run:

```PORT=3001 npm run dev```

To run the service in port `3001`.

### Tests
Run the tests by doing `npm run test:in-container` to run application unit tests.

### API
This service expose the following endpoints:

## /ping
A simple health check that returns the current running version.

## /popularity/score
Returns the score for all the resources in balena. The score format is a value on range 0-1. This score is also a probability distribution (e.g the sum of all scores should be 1). You can also use `/popularity/score/{resources}` where `{resource}` is either `fleets` or `apps` for querying only this specific resource.

## /featured-page
This endpoint is a helpfull endpoint to choose randomly a page using the same distribution presented in `/popularity/score`. It conveniently returns information regarding one application and supports a `excludeIds` query parameter with a comma separated list of values for ids to be ignored from the distribution.


### Notes
_Regarding Caching_: This application uses an in memory caching strategy for now. In environments where this application is deployed in multiples containers running in parallel, there might be a difference between the cached values, which may cause different `scores` on different HTTP API calls. 
