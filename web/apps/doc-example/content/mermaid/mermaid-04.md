---
title: Mermaid 04
layout: layouts/page.mermaid.njk
eleventyNavigation:
  order: 4
  key: Mermaid 04
  parent: Mermaid
showBreadcrumb: true
---

```mermaid
sequenceDiagram

    actor U as Usager
    participant FS as Fournisseur de service
    participant FD as Fournisseur de données
    participant FC as FranceConnect


    U->>FS: GET/POST ...

    FS->>FD: GET /resource (access token + plateforme)
    FD->>FC : POST /checktoken (access token + authN FD)

    alt access token valide + authN FD valide

        FC-->>FD : HTTP 200 - identity + scopes + client + acr

    else access token invalide

      FC-->>FD : HTTP 200 + error

   else erreur imprévue

      FC-->>FD : HTTP 500

    end
```
