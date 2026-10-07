# Video Diary

A mobile app for saving five-second moments from videos on your device. Pick a video, choose where the clip starts, add a name and description, and keep the cropped clip in a local diary. You can play saved clips, edit their details, and delete them.

Built with Expo SDK 57, React Native, TypeScript, and Expo Router.

## Screenshots

The screenshots below follow the app flow in order.

<table>
  <tr>
    <td align="center">1. Empty diary<br><img src="docs/screenshots/empty.png" alt="Empty Video Diary screen" width="220"></td>
    <td align="center">2. Select a video<br><img src="docs/screenshots/select-a-video-empty.png" alt="Video selection before choosing a file" width="220"></td>
    <td align="center">3. Video selected<br><img src="docs/screenshots/select-a-video-selected.png" alt="Selected video preview" width="220"></td>
  </tr>
  <tr>
    <td align="center">4. Choose five seconds<br><img src="docs/screenshots/choose-5.png" alt="Five-second timeline selection" width="220"></td>
    <td align="center">5. Add details<br><img src="docs/screenshots/add-details.png" alt="Name and description form" width="220"></td>
    <td align="center">6. Video list<br><img src="docs/screenshots/video-list.png" alt="Saved clips list" width="220"></td>
  </tr>
  <tr>
    <td align="center">7. Video details<br><img src="docs/screenshots/video-details-page.png" alt="Saved video details and playback" width="220"></td>
    <td align="center">8. Edit details<br><img src="docs/screenshots/edit-details.png" alt="Edit video name and description" width="220"></td>
    <td align="center">9. Delete confirmation<br><img src="docs/screenshots/delete-video.png" alt="Confirm deletion of a saved video" width="220"></td>
  </tr>
</table>

## Setup

### Requirements

- Node.js 22.13 or newer and npm
- An Android device or emulator, or an iOS device or simulator on macOS
- A native development build of this app. Video trimming uses native code, so Expo Go cannot run the complete app.

### Install and run

```bash
npm ci
npx expo run:android
```

Use `npx expo run:ios` instead on macOS for iOS. The `run` command builds and installs the development app. After the first build, start the development server with:

```bash
npm run start
```

Open the installed development app on the device. Rebuild it after adding or changing a native dependency. The generated `android/` and `ios/` directories are ignored by Git; native configuration belongs in `app.json` and Expo config plugins.

### Expo Go branch

I also created `feature/expo-go` to let reviewers explore the app in Expo Go. It keeps the same main screens and the five-second selection preview, but **it does not export a cropped clip**. `expo-trim-video` needs native code that Expo Go does not include, so this branch saves the full source video instead. Use `main` and a development build to test actual five-second cropping. The Expo Go branch uses Expo SDK 54, so use an Expo Go app version compatible with that SDK.

```bash
git switch feature/expo-go
npm ci
npm run start
```

Open the QR code in Expo Go. Switch back with `git switch main` when you want to test real cropping, then run `npm ci` again because the branches use different Expo versions.

## Usage

1. Tap **Crop your first video** on an empty diary, or tap **+** from the video list.
2. Tap **Select video** and choose a video from your device. The source video must be at least five seconds long.
3. Tap **Continue**. Drag or tap the timeline to choose the start of a fixed five-second clip. You can also move the start by one second with the nudge buttons.
4. Tap **Next**, enter a name and an optional description, then tap **Crop video**.
5. Tap a saved clip in the list to play it and view its details. Use **Edit details** to change its name or description, or **Delete video** and confirm to remove it.

Names are required and limited to 40 characters; descriptions are limited to 200 characters.

## How it works

- **Video processing:** `expo-image-picker` selects the source, `expo-video` previews and plays it, and `expo-trim-video` exports the selected five-second range. The cropped video and thumbnail are stored in the app's document directory with `expo-file-system`.
- **SQLite persistence:** I used `expo-sqlite` rather than keeping the diary only in memory. It stores each clip's name, description, file names, duration, start time, and creation date in `video-diary.db`, so the list survives app restarts. A versioned migration creates the table and index. The home screen reads clips in pages of 30, ordered newest first. The actual video and thumbnail files live in the app's document directory; SQLite stores their file names.
- **Zod validation:** I use one shared Zod schema for both creating and editing video details. It requires a name of up to 40 characters and allows an optional description of up to 200 characters. `react-hook-form` shows validation errors in the form.
- **Edit and delete:** I added an edit details sheet on the video details screen. Changes to the name and description are written to SQLite and reflected in the list and details view. Deletion asks for confirmation, then removes the database record and its stored media files.
- **State and async work:** Zustand keeps the temporary crop flow state. TanStack Query handles list and detail reads, trimming and save mutations, and refreshes after changes.
- **UI:** Expo Router handles navigation, NativeWind handles styling, and React Native Reanimated animates the crop and edit sheets.

### Scaling the SQLite video list

I designed the list so it does not load every saved video as the diary grows. The repository fetches **30 videos at a time** using a cursor made from `created_at` and `id`; the next page continues after the last row already shown. A composite index on `(created_at DESC, id DESC)` supports that ordering, including when multiple videos have the same timestamp. The home screen renders pages with React Native `FlatList` and requests another page only near the end. It gets the total video count and total duration from a separate SQL aggregate query instead of loading every row just to calculate them. SQLite also runs in WAL mode, and the database schema has a versioned migration path for future changes.

## Folder structure

I deliberately organized the small app by technical responsibility rather than putting every screen, hook, database query, and component into separate feature folders. There are only three routes, while pieces such as `MetadataForm`, video playback, validation, and storage are shared across flows. Keeping shared code in `components/`, `hooks/`, `db/`, `lib/`, and `schemas/` gives each piece one clear location without duplicating it across feature folders. Screen-specific components are still grouped under `components/home/`, `components/crop/`, and `components/videos/`; if the app grows into more independent features, those groups can be moved into feature folders later.

```text
assets/                  App icons and bundled visual assets
docs/screenshots/        Screenshots used in this README
src/
  app/                   Expo Router screens and root navigation layout
    index.tsx            Diary list and empty state
    crop/index.tsx       Three-step video cropping flow
    videos/[id].tsx      Saved clip details
  components/            Reusable UI, crop, home, and video components
  constants.ts           Clip length, metadata limits, and layout constants
  db/                    SQLite provider, migrations, and video queries
  hooks/                 Video queries and crop-flow hooks
  lib/                   Video picking, trimming, files, thumbnails, utilities
  schemas/               Zod metadata schema
  stores/                Zustand crop draft
  theme/                 Colors
  types/                 Shared TypeScript types
app.json                 Expo app configuration and plugins
package.json             Dependencies and scripts
```

## Checks

```bash
npm run lint
npm run typecheck
```

For Expo SDK guidance, see the [SDK 57 reference](https://docs.expo.dev/versions/v57.0.0/) and [development build instructions](https://docs.expo.dev/develop/development-builds/use-development-builds/).
