load("/opt/scripts/db-states/_default/index.js");

/* ------------------------------------------------------------------------------- */

print("############################### Initializing IDPs as Production...");
load("/opt/scripts/db-states/display-idp-as-in-prod/idp.js");
print("> Production IDPs initialized");
