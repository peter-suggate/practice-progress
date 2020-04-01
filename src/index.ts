import Vue from "vue";
import StartStop from "./components/StartStop";
import RecorderStatus from "./components/RecorderStatus";
import { PracticeProgressVM } from "./components/PracticeProgressVM";

let v = new Vue({
  el: "#app",
  template: `
    <div>
        <start-stop @recording-toggled="handleRecordingToggled" v-bind:isRecording="isRecording" v-bind:isTransitioning="isTransitioning" />
        <recorder-status v-bind:recorderState="vm.recorderState" />
    </div>
    `,
  data: {
    vm: new PracticeProgressVM()
  },
  components: {
    StartStop,
    RecorderStatus
  },
  methods: {
    handleRecordingToggled(isRecording: boolean) {
      this.vm.toggleRecording();
    }
  },
  computed: {
    isRecording(): boolean {
      return this.vm.recorderState === "running";
    },
    isTransitioning(): boolean {
      return (
        this.vm.recorderState === "starting" ||
        this.vm.recorderState === "stopping"
      );
    }
  }
});
