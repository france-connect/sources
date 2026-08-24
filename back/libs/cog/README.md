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
