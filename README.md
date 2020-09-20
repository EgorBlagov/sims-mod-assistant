# Sims 4 Mod Assistant [![Build Status](https://travis-ci.org/EgorBlagov/sims-mod-assistant.svg?branch=master)](https://travis-ci.org/EgorBlagov/sims-mod-assistant) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

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

![Main view](/assets/screenshot-1.png?raw=true)
![Graph viewer](/assets/screenshot-2.png?raw=true)

# Usage

Download application from Releases page and start.

## Video tutorial

[![Sims Mod Assistant Tutorial](https://img.youtube.com/vi/m-VSYq3zcdg/0.jpg)](https://youtu.be/m-VSYq3zcdg "Sims Mod Assistant Tutorial")

# CLI

```bash
# build
npm run build

# start
npm run start

# dev
npm run dev

# unit tests
npm run test

# lint
npm run lint
```

## Note on Dev

I was not able to make **Electron** and **Parcel** best friends, so on `npm run dev` there are several reloads of electron app

# Localization

If you want to contribute, you should do:

-   check available localizations at `/common/l10n/`
-   make a new one using an existing one as sample
-   add enum entry to `/common/l10n/index.ts`

Or you can just translate and submit an issue, I'll add new one.

# Support

-   [PayPal](https://www.paypal.com/paypalme/emblagov)
-   [Qiwi](https://qiwi.com/n/STRAL577)

# License

ISC © [Egor Blagov](https://github.com/EgorBlagov)
