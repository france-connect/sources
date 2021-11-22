# Formattage

## Introduction

Sur le projet, le formattage du code est majoritairement géré automatiquement par `eslint` et `prettier`. Ces règles sont imposées sur chaque `merge request` par la `CI`. Les discussions concernant la modification de ces règles doivent avoir lieu en dehors des tickets. Si le changement est validé, il fera l'objet d'un ticket unique pour son application. Il est fortement recommandé de configurer son éditeur pour prendre en compte ces règles pendant le développement.

Il existe cependant des règles et exceptions qui ne sont pas appliquées automatiquement (les propositions d'automatisation sont bonnes à prendre pour ces règles).

## Les règles

### Aération du code

Dans la mesure du possible et raisonablement, les différents éléments entrant dans la composition d'une action précise doivent être regroupées. Ces blocs sont séparés par une ligne vide.

Voici quelques exemples. Il va de soit que l'appréciation reste subjective et peut être discutée lors de la revue de code.

```typescript
/**
 * 😍 Cool 😍
 */

class Account {
  async login({ username, password: inputPassword }: Credentials) {
    // 1. On récupère dans la base le compte et on s'assure qu'il existe
    const {
      id,
      password: accountPassword,
      lastConnection,
    } = await this.account.findOne({
      username,
    });
    if (!account) {
      throw LoginException("unknown");
    }

    // 2. On vérifie la correspondance
    const passwordMatch = await this.crypto.verifyHash(
      accountPassword,
      inputPassword
    );
    if (!passwordMatch) {
      throw LoginException("password");
    }

    // 3. On met à jour la date de dernière connexion
    try {
      await this.account.update({ $set: { lastConnection: new Date() } });
    } catch (e) {
      throw LoginException("last-connexion-update");
    }

    // 4. On retourne les informations
    return { id, username, lastConnection };
  }

  otherMethod() {
    /* ... */
  }
}

function initLeaderboard(leaderboard: Leaderboard, scores: Score[]) {
  // 1. On initialise la partie statique
  leaderboard.name = "Tetris, the greatest NES scores";
  leaderboard.columns = ["Rank", "Name", "Score"];
  leaderboard.color = "#24445c";
  leaderboard.size = 100;

  // 2. On initialise les scores
  const first100Scores = scores.slice(0, 100);
  leaderboard.scores.push(scores);
}
```

```typescript
/**
 * 😱 Pas cool 😱
 */

// Pas assez d'aération nuit à la lisibilité
class Account {
  async login({ username, password: inputPassword }: Credentials) {
    // ???
    const {
      id,
      password: accountPassword,
      lastConnection,
    } = await this.account.findOne({
      username,
    });
    if (!account) {
      throw LoginException("unknown");
    }
    const passwordMatch = await this.crypto.verifyHash(
      accountPassword,
      inputPassword
    );
    if (!passwordMatch) {
      throw LoginException("password");
    }

    // ???
    try {
      await this.account.update({ $set: { lastConnection: new Date() } });
    } catch (e) {
      throw LoginException("last-connexion-update");
    }
    return { id, username, lastConnection };
  }
  otherMethod() {
    /* ... */
  }
}

// Trop d'aération nuit à la lisibilité
function initLeaderboard(leaderboard: Leaderboard, scores: Score[]) {
  // 1. On initialise le nom
  leaderboard.name = "Tetris, the greatest NES scores";

  // 2. On initialise les colones
  leaderboard.columns = ["Rank", "Name", "Score"];

  // 3. On initialise la couleur
  leaderboard.color = "#24445c";

  // 4. On initialise la taille
  leaderboard.size = 100;

  // 5. On extrait les 100 premiers scores
  const first100Scores = scores.slice(0, leaderboard.size);

  // 6. On ajoute les scores au leaderboard
  leaderboard.scores.push(scores);
}
```
