# Building the InstituteOS Android App (Capacitor)

This wraps your existing React/Vite web app into a real Android app —
same code, same Firestore data, same everything. Run these commands on
your own computer, inside your `InstituteOS` project folder (the one
with `package.json`, `src/`, etc.), with Node.js already installed.

## 1. Install Capacitor

```
npm install @capacitor/core @capacitor/cli @capacitor/android
```

## 2. Add the config file

`capacitor.config.ts` is already included in this project (in the root
folder, next to `package.json`). It sets:
- **App ID**: `com.instituteos.app` — this is permanent once you publish
  to Google Play, so if you want a different one (e.g. based on your
  actual business name), edit this file *before* your first release.
- **App name**: `InstituteOS` — this is what shows under the app icon.

## 3. Build the web app

```
npm run build
```

This creates a `dist/` folder — Capacitor wraps *this* folder, so make
sure the build succeeds and `dist/` is created before continuing.

## 4. Add the Android platform

```
npx cap add android
```

This generates a full native `android/` folder in your project —
that's the actual Android Studio project.

## 5. Sync your web build into the Android project

```
npx cap sync android
```

Run this again any time you change your React code and rebuild —
it copies the latest `dist/` output into the native app.

## 6. Open in Android Studio

```
npx cap open android
```

This launches Android Studio with the project already open. From there:
- Let it finish indexing/Gradle sync (first time can take a few minutes).
- Click the green ▶ Run button with an emulator or a USB-connected
  phone selected to test it.
- When ready to publish: **Build > Generate Signed Bundle / APK**,
  follow Android Studio's signing wizard (it'll have you create a
  keystore file — save this file and its password somewhere safe,
  you need the *same* keystore for every future update).

## 7. Publish to Google Play

- Create a Google Play Developer account (console.play.google.com) —
  **$25 one-time fee**.
- Create a new app listing, fill in store details (description,
  screenshots, icon), and upload the signed `.aab` file from step 6.
- Google reviews it (usually a few hours to a couple of days), then
  it goes live.

## Every time you update your app later

```
npm run build
npx cap sync android
```

Then open Android Studio and re-run/re-publish as needed. You do NOT
need to redo steps 1, 2, or 4 — those are one-time setup.

## Notes specific to this app

- Since Firestore requests need internet access, make sure the
  emulator/phone you test on has a working internet connection.
- The app currently has no offline mode — if there's no internet,
  screens that read from Firestore will just show empty/loading,
  same as the web version does today.
- Your `firebase.js` config (the `instituteos-92470` project) is
  already inside `src/` — nothing extra needed there for Android.
