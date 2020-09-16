# Sims 4 Mod Assistant

Small electron app intended to help Sims players and content makers to find and move duplicates and possible conflicts among mods.

# Features

-   Finds exact duplicates (copy-paste files with different names)
-   Parses mod contents and looks for probable conflicts for:
    -   Catalog/Definition
    -   Skintone
    -   CAS
    -   Sliders
-   Groups conflicting files into lists
-   Shows visual relationship between conflicting files
-   Supports quick open of specific mod in Sims4Studio
-   Supports filtering, batch selection and moving selected mods to other directory

# Usage

Download application from Releases page and start.

# CLI

```bash
# build
npm run build

# start
npm run start

# dev
npm run dev
```

## Note on Dev

I was not able to make **Electron** and **Parcel** best friends, so on `npm run dev` there are several reloads of electron app

# License

ISC © [Egor Blagov](https://github.com/EgorBlagov)
