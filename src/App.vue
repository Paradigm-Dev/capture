<template>
  <v-app>
    <v-system-bar v-if="process.platform != 'darwin'" app window style="-webkit-app-region: drag; -webkit-user-select: none;" color="primary">
      <v-fade-transition group leave-absolute>
        <div key="logo" v-if="!$root.notify.is" style="display: inline-flex !important;">
          <img src="./assets/logo.png" height="18" style="margin-right: 4px;">
          <span style="margin-right: 4px">Capture</span>
          <!-- <span class="font-weight-light grey--text lighten-2 mr-2 hidden-xs-only">early-access beta</span> -->
        </div>
        <span key="notification" v-if="$root.notify.is">{{ $root.notify.text }}</span>
      </v-fade-transition>
      <v-spacer></v-spacer>
      <div style="-webkit-app-region: no-drag;">
        <v-icon @click="minimize()" v-ripple class="toolbar-icon">mdi-minus</v-icon>
        <v-icon @click="maximized ? unmaximize() : maximize()" v-ripple class="toolbar-icon">mdi-crop-square</v-icon>
        <v-icon @click="close()" v-ripple class="toolbar-icon">mdi-close</v-icon>
      </div>
    </v-system-bar>

    <v-system-bar v-if="process.platform == 'darwin'" app window style="-webkit-app-region: drag;" height="38" color="primary">
      <div style="height: 12px; width: 12px; border-radius: 12px;" v-ripple @click="close()" class="red mx-1"></div>
      <div style="height: 12px; width: 12px; border-radius: 12px;" v-ripple @click="minimize()" class="yellow darken-2 mx-1"></div>
      <div style="height: 12px; width: 12px; border-radius: 12px;" v-ripple @click="maximized ? unmaximize() : maximize()" class="green mx-1"></div>
      <v-fade-transition group leave-absolute style="margin: 4px 4px 0px 10px;">
        <div key="logo" v-if="!$root.notify.is" style="display: inline-flex !important;">
          <img src="./assets/logo.png" height="18" style="margin-right: 4px;">
          <span style="margin-right: 4px">Capture</span>
          <!-- <span class="font-weight-light grey--text lighten-2 mr-2 hidden-xs-only">early-access beta</span> -->
        </div>
        <span key="notification" v-if="$root.notify.is">{{ $root.notify.text }}</span>
      </v-fade-transition>
    </v-system-bar>

		<v-main>
      <v-toolbar color="primary" dense ref="toolbar">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn :disabled="recording" @click="refreshSources()" v-on="on" :loading="sourcesLoading" text><v-icon class="mr-3" left>mdi-monitor-screenshot</v-icon>Source</v-btn>
          </template>
          <v-list dense>
            <v-list-item-group v-model="selectedSource">
              <v-list-item v-for="(source, index) in sources" :key="index" :value="source" @click="selectSource(source)">
                <v-list-item-title>{{ source.name }}</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>

        <h6 class="text-h6 text-center centralize" v-if="selectedSource">{{ selectedSource.name }}</h6>
        <v-spacer></v-spacer>

        <v-btn disabled v-if="!mediaRecorder && !selectedSource"><v-icon left>mdi-record</v-icon>Start</v-btn>
        <v-btn @click="start()" v-if="mediaRecorder && recording === false" color="secondary"><v-icon left>mdi-record</v-icon>Start</v-btn>
        <!-- <v-btn @click="mediaRecorder.pause(); paused = true" v-if="mediaRecorder && recording === true && paused == false" color="red" icon><v-icon>mdi-pause</v-icon></v-btn>
        <v-btn @click="mediaRecorder.resume(); paused = false" v-if="mediaRecorder && recording === true && paused == true" color="red" icon><v-icon>mdi-play</v-icon></v-btn> -->
        <v-btn @click="stop()" v-if="mediaRecorder && recording === true" color="red"><v-icon left>mdi-stop</v-icon>Stop</v-btn>
      </v-toolbar>

      <div v-if="selectedSource">
        <video style="width: 100vw;"></video>
      </div>

      <div v-if="!selectedSource" class="text-center my-12">
        <h4 class="text-h4">Select a source to get started</h4>
        <p class="grey--text">Click the "Source" button in the toolbar above.</p>
      </div>
		</v-main>
  </v-app>
</template>

<script>
import { desktopCapturer, remote } from 'electron'
import { writeFile } from 'fs'
const { dialog, Tray } = remote
import moment from 'moment'
import { join } from 'path'

export default {
	name: 'app',
	data() {
		return {
			win: remote.getCurrentWindow(),
      maximized: remote.getCurrentWindow().isMaximized(),
      process,
      sources: [],
      mediaRecorder: null,
      recordedChunks: [],
      selectedSource: null,
      sourcesLoading: false,
      console,
      recording: false,
      filepath: '',
      tray: null
		}
	},
  methods: {
    close() {
      this.win.close()
    },
    maximize() {
      this.win.maximize()
      this.maximized = remote.getCurrentWindow().isMaximized()
    },
    unmaximize() {
      this.win.unmaximize()
      this.maximized = remote.getCurrentWindow().isMaximized()
    },
    minimize() {
      this.win.minimize()
    },
    async refreshSources() {
      this.sourcesLoading = true
      this.sources = []

      this.sources = await desktopCapturer.getSources({
        types: ['window', 'screen']
      })

      this.sourcesLoading = false
    },
    async selectSource(source) {
      this.selectedSource = source

      const constraints = {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: source.id
          }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      let videoElement = document.querySelector('video')
      videoElement.srcObject = stream
      videoElement.play()

      const options = { mimeType: 'video/webm' }
      this.mediaRecorder = new MediaRecorder(stream, options)

      // Register Event Handlers
      this.mediaRecorder.ondataavailable = this._handleDataAvailable
      this.mediaRecorder.onstop = this._handleStop

      this.win.setSize(600, 161 + videoElement.getBoundingClientRect().height, true)
    },
    start() {
      this.mediaRecorder.start()
      this.recording = true
      this.win.hide()
      this.tray = new Tray(join('/Users/aidanliddy/Dev/capture-new/src/assets/logo.png'))
      this.tray.on('click', () => this.stop())
    },
    stop() {
      this.win.show()
      this.mediaRecorder.stop()
      this.recording = false
      this.tray.destroy()
    },
    _handleDataAvailable(e) {
      this.recordedChunks.push(e.data)
    },
    async _handleStop() {
      const blob = new Blob(this.recordedChunks, {
        type: 'video/webm'
      })

      const buffer = Buffer.from(await blob.arrayBuffer())

      const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save',
        defaultPath: `${this.selectedSource.name}-${moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}.webm`
      })

      if (filePath) {
        await writeFile(filePath, buffer, () => {})
      }

      let videoElement = document.querySelector('video')
      videoElement.srcObject = null
      this.mediaRecorder = null
      this.recording = false
      this.selectedSource = null
      this.recordedChunks = []
    }
  }
}
</script>

<style>
/* Scrollbar */

/* width */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgb(33, 33, 33);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(100, 100, 100);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(60, 60, 60);
}

/* Corner */
::-webkit-scrollbar-corner {
  background: rgb(33, 33, 33);
}

/* * {
} */

html {
  overflow-y: hidden !important;
	-webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: rgb(15, 15, 15);
}

.appbar-icon {
  border-radius: 100px;
}

.centralize {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
	text-align: center;
}

.v-toolbar__content {
  padding-right: 6px !important;
  padding-left: 6px !important;
}
</style>
