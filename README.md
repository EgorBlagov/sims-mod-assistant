# Sims 4 Mod Assistant

Small electron app intended to help Sims players and content makers to find and move duplicates and possible conflicts among mods.

# Features

-   Find exact duplicates (copy-paste files with different names)
-   Parses mod contents and find probable catalog conflicts

# Known issues

-   If you find thousands of duplicates or invalid files, app will stuck on few seconds (due to big list rendering). I'm considering several solutions for it.

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
