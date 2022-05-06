# Formatting

## Foreword

Most of the formatting is and SHOULD be handled by automatic utilities as `eslint` and `prettier`. Most rules are therefor enforced on each `merge request` by a `CI` on the internal gitlab. Debates on those rules SHOULD append outside the scope of features tickets. A new/updated rule MUST be applied at once on the code base to prevent conflicting rules that will result in inconsistences. The developers SHOULD enforce the automated rules on their IDE.

This document contains the rules and exceptions that are not automated (propositions for automation are welcomed).

## Rules

### Code structure

A code block SHOULD depict a unique mean, may it be a business or a technical one. Blocks are separated by a unique empty line.

As the appreciation COULD remain subjective, the review MAY have the last word.

```typescript
/**
 * 😍 Cool 😍
 */

class Account {
  async login({ username, password: inputPassword }: Credentials) {
    // 1. The account entries are retrieved from the database and asserted as defined.
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

    // 2. The inputted password is hashed and checked against the database.
    const passwordMatch = await this.crypto.verifyHash(
      accountPassword,
      inputPassword
    );
    if (!passwordMatch) {
      throw LoginException("password");
    }

    // 3. The last connection date is updated.
    try {
      await this.account.update({ $set: { lastConnection: new Date() } });
    } catch (e) {
      throw LoginException("last-connexion-update");
    }

    // 4. The account entries are returned 
    return { id, username, lastConnection };
  }
}

function initScoreboard(scoreboard: Scoreboard, scores: Score[]) {
  // 1. Scoreboard is initialized
  scoreboard.name = "Tetris, the greatest NES scores";
  scoreboard.columns = ["Rank", "Name", "Score"];
  scoreboard.color = "#24445c";
  scoreboard.size = 100;

  // 2. Scores are pushed to the scoreboard
  const first100Scores = scores.slice(0, 100);
  scoreboard.scores.push(scores);
}
```

```typescript
/**
 * 😱 Not cool 😱
 */

// Compact code is less readable
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

// Scattered / Floppy code lacks of a mean
function initScoreboard(scoreboard: Scoreboard, scores: Score[]) {
  // 1. The name is initialized
  scoreboard.name = "Tetris, the greatest NES scores";

  // 2. The columns are initialized
  scoreboard.columns = ["Rank", "Name", "Score"];

  // 3. The color is initialized
  scoreboard.color = "#24445c";

  // 4. The size is initialized
  scoreboard.size = 100;

  // 5. The top 100 is initialized
  const first100Scores = scores.slice(0, scoreboard.size);

  // 6. The scores are pushed to the board
  scoreboard.scores.push(scores);
}
```
