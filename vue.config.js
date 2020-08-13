module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      outputDir: 'output',
      removeElectronJunk: false,
      shortcutName: 'Capture',
      icon: 'build/icon.png',
      productName: 'AppName',
      name: 'Capture',
      nodeIntegration: true
    }
  }
}