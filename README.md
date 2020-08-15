[<img src="https://www.theparadigmdev.com/relay/img/paradigm.png" alt="Logo" width="150" height="150"></img>](https://www.theparadigmdev.com/)
# Paradigm Capture

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png" alt="Logo" width="100" height="100"></img>
<img src="https://seeklogo.com/images/V/vuetify-logo-3BCF73C928-seeklogo.com.png" alt="Logo" width="100" height="100"></img>
<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F9%2F91%2FElectron_Software_Framework_Logo.svg%2F1200px-Electron_Software_Framework_Logo.svg.png&f=1&nofb=1" alt="Logo" width="100" height="100"></img>

Proudly built with [Vue.js](https://vuejs.org/), [Vuetify](https://vuetifyjs.com), and [Electron](https://www.electronjs.org).

We use [NPM](https://npmjs.org/) (Node Package Manager) for any external libraries used.

### Guide
Once the application opens, you must select an input source. Click the "Source" button in the top left of the app. A dropdown will appear with a list of available sources. Select the one you want. Once selected, a preview will appear below the toolbar. In the top right, two options will be enabled, Screenshot and Record. Screenshot takes a picture of the selected source. Capture will disappear until the image is either saved or deleted. Record will record the selected source. Capture will minimize while recording. To stop recording, either click the stop icon in the System Tray (Windows) or Menu Bar (macOS) or restore Capture and click the stop button. On both modes, a save dialog box will appear in which you can choose the name and location to store the screenshots and recordings. Screenshots output a JPG file and Record outputs a WEBM file (for now, we want to change it to an MP4).

### Todo
- [x] Source selection
- [x] Menu bar stop button (macOS)
- [x] System tray stop button (Windows)
- [x] Change color of menu bar/system tray button based upon system theme
- [x] Screenshot
- [ ] Record audio
- [ ] Record webcam
- [ ] Select where webcam input will be placed
- [ ] Save files as .mp4
- [ ] Improve automatic updates

### Package installation
Run this command to install all dependencies.
```
npm install
```

### Compile for development
Run this command to create a temporary, hot-reload development server.
```
npm run serve
```

### Compile for production
Run this command to get a production-ready build.
```
npm run build
```

If you have any questions, comments, or concerns, please [contact support](mailto:paradigmdevelop@gmail.com).
