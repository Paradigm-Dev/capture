module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      outputDir: 'output',
      removeElectronJunk: false,
      nodeIntegration: true,
      icon: 'build/icon.png',
      builderOptions: {
        productName: 'Capture',
        dmg: {
          artifactName: 'Capture-v${version}.${ext}',
          title: 'Capture'
        },
        nsis: {
          artifactName: 'Capture-v${version}.${ext}',
          deleteAppDataOnUninstall: true,
          shortcutName: 'Capture'
        }
      }
    }
  }
}