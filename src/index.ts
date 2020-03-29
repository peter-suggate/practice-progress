import Vue from "vue";
import StartStop from "./components/StartStop";
import { createAudioRecorder } from "./audio/create-audio-recorder";

let v = new Vue({
  el: "#app",
  template: `
    <div>
        <start-stop @recording-toggled="handleRecordingToggled" />
    </div>
    `,
  data: {},
  components: {
    StartStop
  },
  methods: {
    handleRecordingToggled(isRecording: boolean) {
      if (isRecording) {
        createAudioRecorder()
          .then(() => console.log("started recording"))
          .catch(e => console.error("recording failed to start: ", e));
      }
    }
  }
});
