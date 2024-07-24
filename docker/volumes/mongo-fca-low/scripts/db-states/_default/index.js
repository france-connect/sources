print("Initializing SPs...");
load("/opt/scripts/db-states/_default/sp.js");

/* ------------------------------------------------------------------------------- */

print("Initializing IDPs...");
load("/opt/scripts/db-states/_default/idp.js");

/* ------------------------------------------------------------------------------- */

print("Initializing FCA ACCOUNTS...");
load("/opt/scripts/db-states/_default/account-fca.js");

/* ------------------------------------------------------------------------------- */

print("Initializing Scopes...");
load("/opt/scripts/db-states/_default/scopes.js");

/* ------------------------------------------------------------------------------- */

print("Initializing Claims...");
load("/opt/scripts/db-states/_default/claims.js");

/* ------------------------------------------------------------------------------- */

print("Initializing fqdnToProvider...");
load("/opt/scripts/db-states/_default/fqdn-to-provider.js");

/* ------------------------------------------------------------------------------- */

print("Initializing Data providers...");
load("/opt/scripts/db-states/_default/dp.js");
