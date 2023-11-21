#language: fr
@eidasBridge @eidasBridgeConfig
Fonctionnalité: Eidas Bridge Configuration
  # En tant que partenaire eIDAS,
  # je veux connaître la liste des scopes supportés par le noeud eIDAS français
  # afin d'intégrer le noeud français avec ma plateforme

  Scénario: Eidas Bridge Configuration - scopes supportés
    Quand je navigue sur la page openid configuration de eidas-bridge
    Alors le scope "offline_access" n'est pas supporté
    Et le scope "address" est supporté
    Et le scope "phone" est supporté
    Et le scope "openid" est supporté
    Et le scope "given_name" est supporté
    Et le scope "family_name" est supporté
    Et le scope "birthdate" est supporté
    Et le scope "gender" est supporté
    Et le scope "birthplace" est supporté
    Et le scope "birthcountry" est supporté
    Et le scope "email" est supporté
    Et le scope "preferred_username" est supporté
    Et le scope "profile" est supporté
