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
        },
        extraResources: [
          {
            from: 'build/stop_white.png',
            to: 'stop_white.png'
          },
          {
            from: 'build/stop_black.png',
            to: 'stop_black.png'
          }
        ]
      }
    }
  }
}