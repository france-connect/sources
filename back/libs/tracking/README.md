# Tracking

## À propos

Cette librairie sert à gérer les traces métiers des applications.

Elle fournit un socle exploitable par les applications, mais ces dernières doivent injecter des comportement spécifiques lors de l'import du module.

En effet chaque application va avoir des besoins qui lui sont propres, tant au niveau des événements journalisés, que des informations présentes dans chaque entrée de journal.

**Exemples de besoins spécifiques**

> `core-fcp` a besoin de systèmatiquement journaliser un identifiant d'interaction  
> `fc-exploitation` n'a pas cette notion  
> `fc-exploitation` a parfois besoin de journaliser un numéro de ticket OTRS

## Utilisation

### Initialisation

Le module est dynamique est doit être instancié avec la méthode `register`, qui prend en paramètre une classe de service implémentant l'interface [`IAppTrackingService`](src/interfaces/app-tracking-service.interface.ts)

```typescript
// Le présent module
import { TrackingModule } from '@fc/tracking';
// Le service spécifique implémentant l'interface IAppTrackingService
import { MyAppTrackingService } from './services';
// Une dépendance de MyAppTrackingService (à titre d'exmple)
import { MySpecificDependencyService } from '@fc/my-dependency';

@Module({
  imports: [
    // Import dynamique en passant en paramètre la class
    // contenant la logique spécifique
    TrackingModule.register(MyAppTrackingService),
  ],
  exports: [
    // Il faut exporter les dépendances de MyAppTrackingService
    // Afin que le TrackingModule puisse l'instancier
    MySpecificDependencyService,
  ]
})
```

### Implémentation du `AppTrackingService`

#### Typage des log

Chaque application doit définir sa propre interface (ou classe abstraite) étendant `ITrackingLog`, avec les propriétés à journaliser pour cette application.

L'interface de base contient déjà les propriétés suivantes, requises :

- ip: string
- category: string
- event: string

**Exemple d'interface spécifique à l'application**

```typescript
import { ITrackingLog } from '@fc/tracking';

export class IMyAppTrackingLog extends ITrackingLog {
  readonly interactionId: string;
}
```

La méthode [`buildLog`](src/interfaces/app-tracking-service.interface.ts) doit renvoyer une promesse qui résoudra un objet implémentant l'interface [`ITrackingLog`](src/interfaces/tracking-log.interface.ts).

**Exemple d'implémentation du AppTrackingService**

```typescript
import { Injectable } from '@nestjs/common';
// Interfaces exposées par @fc/tracking
import {
  IEvent,
  IEventContext,
  IAppTrackingService,
} from '@fc/tracking';
// Mapping des événements de l'application
import { EventsMap } from '../events.map';
// Interface spécifique définie précédement
import { IMyAppTrackingLog } from '../interfaces';

@Injectable()
export class MyAppTrackingService implements IAppTrackingService {

  // Exposition publique de la map d'événement (voir plus bas)
  readonly EventsMap = EventsMap;

  // Méthode a implémenter
  async buildLog(
    event: IEvent,
    context: IEventContext,
  ): Promise<IMyAppTrackingLog> {
    // Votre implémentation spécifique...
  };
```

#### Mapping des événements

L'application doit fournir un mapping des évènements métiers pouvant être inscrits dans le journal.  
Ce mapping implémente l'interface [`IEventMap`](src/interfaces/event-map.interface.ts) exposée par `@fc/tracking`, voir la définition de cette dernière pour le formalisme.

Le mapping des évènements est exposé via le service IAppTrackingService décrit ci-après.

#### Service implémentant `IAppTrackingService`

L'application doit fournir un service implémentant l'interface `IAppTrackingService`.

- **`EventsMap`** : Le service doit exposer le mapping d'évènements via une propriété publique `EventsMap`.

* **`buildLog()`** :Le service doit exposer une méthode `buildLog` avec la signature suivante :

  ```typescript
  buildLog(event: IEvent, context: IEventContext): object
  ```

  L'objet renvoyé par la méthode est l'objet qui sera envoyé au journal d'événéments métier.

## Impacts / Effets de bord

### Interceptor

La librairie contient et active un [`Interceptor`](src/interceptors/tracking.interceptor.ts) NestJS qui va automatiquement journaliser les routes présentes dans le mapping (sous réserve que le flag `intercept` soit à `true`).
