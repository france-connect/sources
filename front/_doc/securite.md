# Sécurité


## Faux positifs Checkmarx

Les paquets suivants sont détectés comme vulnérables par checkmarx mais ne sont pas réellement problématiques car utilisés uniquement en dépendance de développement.


* devDependencies de react-scripts
  * immer
  * ejs
  * ansi-html
  * body-parser
  * browserslist
* outils de génération de documentation
  * marked

* Autres
  * ansi-regex (de multiples packages de développement en dépendent)