import Vue from "vue";
// const VueMaterial = require("vue-material");
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default-dark.css";
import { MdButton } from "vue-material/dist/components";
import StartStop from "./components/StartStop";
import RecorderStatus from "./components/RecorderStatus";
import { PracticeProgressVM } from "./components/PracticeProgressVM";

// Vue.use(VueMaterial);
Vue.use(MdButton);

let v = new Vue({
  el: "#app",
  template: `
    <div>
        <start-stop @recording-toggled="handleRecordingToggled" v-bind:isRecording="isRecording" v-bind:isTransitioning="isTransitioning" />
        <recorder-status v-bind:recorderState="vm.recorderState" />
    </div>
    `,
  data: {
    vm: new PracticeProgressVM(),
  },
  components: {
    StartStop,
    RecorderStatus,
  },
  methods: {
    handleRecordingToggled(isRecording: boolean) {
      this.vm.toggleRecording();
    },
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
    },
  },
});
