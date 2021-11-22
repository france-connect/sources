# CSMR RIE

# Pour effectuer une recette :

### 1) Démarrer la stack hybridge et les applications

```
docker-stack up hybridge-fca-low && docker-stack start-all
```

### 2) Afficher les logs du consumer

```
docker-stack log csmr-rie
```

### 3) Se rendre sur le GUI de RabbitMQ, sur la page de la queue "rie"

```
http://localhost:15672/#/queues/%2F/rie
```

### 4) Dérouler le paneau "Publish message" et poster le message suivant :

```json
{
  "pattern": "HTTP_PROXY",
  "data": {
    "headers": {
      "bar": "world"
    },
    "method": "get",
    "url": "https://www.test.com/token"
  }
}
```

### 5) Constater dans les logs du consumer la prise en charge du message.

> NB: Le Request/Response est trop complexe à tester à ce stade, on se contera donc de vérifier la prise en compte du message par le consumer.
> Variations :
> On peut constater la non prise en charge de message ne respectant pas le "pattern".
