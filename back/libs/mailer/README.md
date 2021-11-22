# Librairie Mailer

## Objectifs

- Récupérer le template du mail à envoyer à partir de son nom
- Envoyer le mail en utilisant le transporteur configuré

## Description

### Récupération du template et génération du mail

Les dossiers de template sont définis via la variable d'environnement Mailer_TEMPLATES_PATHS. Cette variable contient un tableau (JSON) de chemins d'accès aux templates pour l'application actuelle.

Ces chemins sont à définir dans un ordre précis car en cas de présence d'un template valide dans plusieurs d'entre eux, seul le dernier chemin valide sera retenu et renvoyé.

**Exemple :**

Prenons l'architecture suivante...

```
apps/
  my-app/
    mail-templates/
      toto42.ejs
instances/
  my-app-instance/
    mail-templates/
      toto42.ejs
```

...et la variable d'environnement tel que...

```
Mailer_TEMPLATES_PATHS=["/apps/my-app/mail-templates", "instances/my-app-instance/mail-templates"]
```

...alors pour le template "toto42", le chemin retourné sera `instances/my-app-instance/mail-templates/toto42.ejs`.

_Nota-bene: On utilise ici une structure de type "apps" et "instances" pour permettre la surcharge du template de "apps" par celui d'"instances"_

### Envoi de mails

_**A rédiger quand on intègrera "dolist" (le nouveau prestataire de mail)**_
