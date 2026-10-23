# COG Labels Library

## `data` Directory

This directory contains the complete INSEE datasets used to display the labels for French COG cities and countries.

## CSV Storage

The INSEE city and country datasets are stored as CSV files. They are loaded when the application starts.

## Configuration

The datasets are injected through the application's dependency injection container using the following configuration tokens (`Symbol`s):

- `COG_CITY`
- `COG_COUNTRY`

> These tokens are also used to associate the datasets with their corresponding validation logic when creating the CSV parsing service.

## City Lookups

- `getLabelFromCog(cog)` reads the `com` index to display a label.
- `getCitiesByNcc(ncc, dep?)` uses `CsvService.filter()` to search by INSEE name and, optionally, department. It returns one entry per distinct COG, so a commune and its delegated chief town do not create a false ambiguity. This lookup does not create an index.

`NCC` is the uppercase, unaccented name, usually without its leading article, with spaces in place of hyphens and apostrophes. For example, `L'Isle-Jourdain` becomes `ISLE JOURDAIN`. Some overseas names retain their article (`LA FOA`, `LA PASSION CLIPPERTON`), so the wallet resolver searches with and without it and combines the matches. Several COGs can share a name. The wallet resolver combines matches across both forms and deduplicates their `LAST_COMPARENT` codes. It returns that final code only when exactly one distinct final parent remains; otherwise the birthplace stays empty.

`filter()` is synchronous, like the existing resolver: the CSV has already been loaded at startup. It keeps the same conjunctive criteria matching as `find()`, but returns all matching rows.

### Birth COG and final current parent

Every extended row has a `LAST_COMPARENT` column, loaded and validated by `CityDto`. The generator computes it by following current administrative parents until a `TYPECOM=COM` row is found. An existing commune points to itself.

The wallet resolver returns this final current COG, regardless of the birthdate. Historical names and COGs remain lookup aliases. For Fontenay-aux-Roses, both `75032` and `92032` lead to `LAST_COMPARENT=92032`, so the result is `92032` for births before or after 1968. This rule replaces the historical-COG expectation of TA08; TA08 and TA09 now expect the same current code.

For example, former code `44060` has `COMPARENT=49382` and `LAST_COMPARENT=49160`. Its current delegated counterpart `49382` also has `LAST_COMPARENT=49160`. Both resolve to `49160`. Likewise, La Chapelle-Achard resolves to Les Achards (`85152`), and Paris 1er arrondissement resolves to Paris (`75056`). Several candidate rows are not ambiguous when they share the same final parent. Different final parents remain ambiguous.

`COMPARENT` remains INSEE's parent on current rows and the first current code reached through movements on historical rows. The resolver does not traverse these links: the generator already supplies `LAST_COMPARENT`. `DEP` keeps its existing meaning and is not replaced with the final parent's department.

The library's `getCitiesByNcc()` still returns rows with their original `COM`, and `getLabelFromCog()` still uses the existing `com` index. Only the wallet resolver selects the final parent for its result.

### PID department convention

The [PID rulebook](https://github.com/eu-digital-identity-wallet/eudi-doc-attestation-rulebooks-catalog/blob/main/rulebooks/pid/pid-rulebook.md#314-attribute-place_of_birth) defines `region` as an administrative area name, not a French department code. The mock wallet currently mixes numeric departments and region names.

The discussion in [US #2688](https://gitlab.dev-franceconnect.fr/france-connect/fc/-/work_items/2688) explicitly defers department-based resolution until France Identité's PID convention and matching rules are defined. The library supports the department filter, but the wallet resolver deliberately does not pass `place_of_birth.region` to it. `Hargicourt` and `Saint-Pierre` therefore remain unresolved by the wallet when multiple COGs match. Direct library lookups with `02`/`80` or `975` can distinguish them.

## Updating the INSEE Vintage (`communes-extended-cog.csv`)

Both bridges use `Cog_CITY_FILE=/var/databases/communes-extended-cog.csv`. The versioned file lives in `docker/volumes/eidas/databases/insee/`; `docker/volumes/wallet-bridge/databases` is a symlink to the eIDAS databases directory.

### 1. Download a single vintage

Download and extract the annual archive from the [official INSEE COG page](https://www.insee.fr/fr/information/8740222). Keep these four files from the same release:

- `v_commune_<year>.csv`: existing communes and their administrative subdivisions;
- `v_mvt_commune_<year>.csv`: historical movements;
- `v_commune_comer_<year>.csv`: overseas collectivities' communes and territorial subdivisions;
- `v_commune_outremer_depuis_1943.csv`: overseas code/name history, with validity periods. Unlike the movements file, it has no before/after codes or parent links.

The general communes and movements files already cover the DOM (971–974 and 976). COMER and overseas history are additional inputs, not separate runtime databases.

The generator only requires the INSEE columns it reads, so unrelated format changes do not break the update. It writes a fixed set of columns: `TYPECOM`, `COM`, `DEP`, `NCC`, `LIBELLE`, `COMPARENT` and `LAST_COMPARENT`. It keeps COGs and departments as strings, including leading zeros and Corsican `2A`/`2B` codes.

### 2. Generate the consolidated file

From `back/`, with the repository dependencies installed:

```bash
yarn generate-insee:extended-city \
  /path/to/v_commune_2026.csv \
  /path/to/v_mvt_commune_2026.csv \
  /path/to/v_commune_comer_2026.csv \
  /path/to/v_commune_outremer_depuis_1943.csv
```

The file is written to `docker/volumes/eidas/databases/insee/communes-extended-cog.csv`, which wallet-bridge reads through its symlink. An optional fifth argument writes it elsewhere.

This command is separate from `generate-insee:city`, which builds the fc-apps search file using La Poste postal codes. It reuses the CSV helpers and INSEE interfaces already available in this library.

The consolidation rules are:

1. Keep all rows from the current communes file. Fill empty `DEP` fields (notably `COMA`/`COMD`) from their COG: two characters, or three for codes starting with `97`/`98`.
2. Ignore creation movements with an empty `COM_AV` and codes whose final movement has no destination (in 2026: `97123` Saint-Barthélemy and `97127` Saint-Martin, which became overseas collectivities). The movements file does not link those former codes to their current COMER codes; do not infer a link through an empty code. Add each historical `(COM_AV, NCC_AV)` pair absent from the current file, once. Keep its former COG and name fields, including aliases whose COG still exists today. This extends Hugues's missing-COG proposal in [#2841](https://gitlab.dev-franceconnect.fr/france-connect/fc/-/work_items/2841) to cover the name changes required by #2688.
3. Find the latest movement for each code by `DATE_EFF`. On equal dates, prefer a destination code present in the current file, then `TYPECOM_AP=COM`, then a destination different from the source: these are our own weights, not INSEE codes. Use destination code order as the final tie-breaker.
4. Follow successive destination codes until one exists in the current file and store it in `COMPARENT`. Fail on a cycle or an unknown endpoint. For an alias of a current COG, `COMPARENT` is that COG. The original `COM` remains in the dataset; the wallet resolver returns `LAST_COMPARENT`.
5. Preserve `TYPECOM_AV` on historical rows. Set `DEP` from the **original COG**, to preserve the historical department (e.g. `14513 PONT FARCY` keeps `14`). This is an implementation choice; the ticket does not specify the department rule.
6. Map COMER `COM_COMER` to `COM`, `COMER` to `DEP`, set `TYPECOM=COM`, and copy `NCC` and `LIBELLE`. For these rows, `DEP` represents the collectivity rather than a department.
7. Add overseas historical names only when their COG still belongs to an overseas commune/subdivision in the current inputs (97/98 prefixes). Copy the current `TYPECOM` and `DEP`, keep the historical `NCC` and `LIBELLE`, and set `COMPARENT` to that same COG. Deduplicate against current names and general movements. This includes `98901 CLIPPERTON` without introducing a second code for that name.
8. Compute `LAST_COMPARENT` for every row using current administrative links. Prefer the current `COM` row over a `COMD` row sharing its code; do not stop at a historical alias pointing to itself. Fail before writing the output if a parent is missing or current parent links form a cycle. A final `COM` points to itself in `LAST_COMPARENT`.
9. Write historical rows before current rows, and current `COM` rows after subdivisions. The existing `com` index retains the last row: historical aliases and delegated chief towns must not replace the current commune labels used by eIDAS.

The overseas history also contains former foreign territories whose codes overlap with metropolitan communes. Do not join that whole file on COG alone. Disappeared overseas codes are excluded: in particular, Mayotte's former `985xx` codes and Clipperton's `98799` are not reconstructed from name similarity. Doing so would make currently unique names ambiguous without a validated recoding rule.

For 2026, the result contains **42,079 rows**: 37,496 current rows, 4,487 general historical name pairs (including 2,180 aliases of still-current COGs), 95 COMER rows, and one additional overseas name alias (`98901 CLIPPERTON`). The general historical additions contain **2,248 distinct disappeared COGs**. Counts exclude the empty source code used for creation movements and the two terminal deletions without destinations.

All 42,079 rows have a final parent that exists as a current `COM`; 4,426 rows have `LAST_COMPARENT` different from `COM`.

### 3. Verify and deploy

```bash
# From back/
yarn test --runInBand libs/csv libs/cog libs/eudi-cog
```

The generator tests cover simultaneous movements, successive disappearances, unchanged-code renamings, department changes, COMER mapping, duplicate names, required and missing columns, the default output and unresolved chains. They also cover historical/current parent chains, same-code delegated chief towns regardless of input order, historical self-code aliases, municipal arrondissements, missing parents and cycles without overwriting an existing output. `insee-dataset.spec.ts` loads the committed CSV through `CityDto`, checks that no row is rejected, and exercises the birth COG resolver on one case per category and the current eIDAS labels.

Check the generated diff and rerun the command with the same inputs: the result must be identical. When updating a vintage, review the concrete expectations in the dataset test against the official changes.

Deploy the new CSV and update `Cog_CITY_FILE` for **both** bridges, then restart them: the dataset is only loaded at startup. The former `commune.csv` is no longer the configured city source. Run the `@pidBirthPlace` BDD suite on FC and FC+. It covers one merged commune (La Chapelle-Achard) and one overseas commune (Papeete), and Fontenay-aux-Roses before and after its COG change; the other cases are covered by unit tests.

Historical aliases can introduce additional homonyms. They remain unresolved when more than one final current COG matches. Birthdate matching is not used; the generator retains its four input files and no validity-period columns are required.

## Generate the `country.csv` Support File

```bash
docker-stack generate-insee:country [path/to/country-insee-csv]
```

## Generate the `city.csv` Support File

> ⚠️ The La Poste CSV file is not provided in the expected format. Before using it, replace the semicolon (`;`) separators with commas (`,`).

```bash
docker-stack generate-insee:city [path/to/commune-insee-csv] [path/to/laposte-csv]
```

## Building the ISO → COG Country Mapping

The mapping is generated from two separate sources.

### 1. Extract ISO codes from the official INSEE COG dataset

The primary source is the official INSEE COG dataset, available at:

https://www.data.gouv.fr/datasets/code-officiel-geographique-cog?resource_id=2ada949d-c383-4bbc-95f0-c01a3391d822

This dataset contains the French COG country codes, the corresponding ISO codes, and several additional fields that are not required.

Extract only the following columns:

- COG country code
- ISO 3166-1 alpha-2 code

However, this dataset does **not** include ISO codes for certain overseas territories and other territories that do not have their own COG country code.

> Some entries in INSEE dataset are territories under another entry sovereignty.
>
> Some of them have no ISO code in the dataset but actually have a code in ISO 3166-1.  
> Those rows often have multiple ISO codes for one COG.
>
> 2 rows re use the same ISO code that the mainland, for territories : PT and ES.  
> Those specific entries have to be treated like the ones without any ISO code

### 2. Identify the missing ISO codes

Download a complete list of ISO 3166-1 country codes, for example from:

https://www.iban.com/country-codes

From this list, create a file containing only the ISO 3166-1 alpha-2 codes.

Similarly, create a file containing only the ISO codes extracted from the INSEE dataset.

Sort both files alphabetically so that the codes appear in the same order, then use `diff` to identify the ISO codes that are present in the official ISO list but missing from the INSEE dataset.

```bash
diff -u code-insee-iso-only.csv codes-iso-only.csv \
  | grep -oE '\+([A-Z]){2}$' \
  > missing-iso.csv
```

At the time of writing, this produces **36 missing ISO codes**.

### 3. Associate each missing ISO code with its sovereign state

For each of these 36 ISO codes, determine:

- the corresponding territory;
- its sovereign state.

This information can be obtained from sources such as the Wikipedia page listing ISO 3166 country codes:

https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes

Finally, add a second column to `missing-iso.csv` containing the **COG code of the sovereign state** corresponding to each missing ISO code.
