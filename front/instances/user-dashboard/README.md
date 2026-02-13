# FC/USER-DASHBOARD

## Developemment Docker

```sh
docker-stack-legacy up ud
docker-stack-legacy dep-all
docker-stack-legacy start-all
# Browse to https://ud.docker.dev-franceconnect.fr/
```

## Login to the user-dashboard

> User : `test user for the login history`<br>
> Login : `test_TRACE_USER`<br>
> Password : `123`<br>

## Generate/Inject the business logs to Elasticsearch database

- [More details regarding the business log generator/injector](../../../quality/data/log-generator/README.md)
