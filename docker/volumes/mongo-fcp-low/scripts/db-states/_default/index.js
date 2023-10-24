print("Initializing SPs...");
load("/opt/scripts/db-states/_default/sp.js");

/* ------------------------------------------------------------------------------- */

print("Initializing IDPs...");
load("/opt/scripts/db-states/_default/idp.js");

/* ------------------------------------------------------------------------------- */

print("Initializing ACCOUNTS...");
load("/opt/scripts/db-states/_default/account.js");

/* ------------------------------------------------------------------------------- */

print("Initializing Scopes...");
load("/opt/scripts/db-states/_default/scopes.js");

/* ------------------------------------------------------------------------------- */

print("Initializing Claims...");
load("/opt/scripts/db-states/_default/claims.js");

/* ------------------------------------------------------------------------------- */

print("Initializing notifications...");
load("/opt/scripts/db-states/_default/notifications.js");

/* ------------------------------------------------------------------------------- */

print("Initializing Legacy SPs...");
load("/opt/scripts/db-states/_default/legacy-sp.js");

/* ------------------------------------------------------------------------------- */

print("Initializing Legacy ACCOUNTS...");
load("/opt/scripts/db-states/_default/legacy-account.js");

/* ------------------------------------------------------------------------------- */

print("Initializing Legacy Partners...");
load("/opt/scripts/db-states/_default/legacy-partners.js");

/* ------------------------------------------------------------------------------- */

print("Initializing Legacy Partners SPs...");
load("/opt/scripts/db-states/_default/legacy-partners-sp.js");

/* ------------------------------------------------------------------------------- */

print("Initializing Data providers...");
load("/opt/scripts/db-states/_default/dp.js");
