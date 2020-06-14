import Vue from "vue";
import VueRx from "vue-rx";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default-dark.css";
import { MdButton } from "vue-material/dist/components";
import StartStop from "./components/StartStop";
import ActiveNote from "./components/ActiveNote";
import RecorderStatus from "./components/RecorderStatus";
import { PracticeProgressVM } from "./components/PracticeProgressVM";

Vue.use(VueRx);
Vue.use(MdButton);

let v = new Vue({
  el: "#app",
  template: `
    <div>
        <start-stop @recording-toggled="handleRecordingToggled" v-bind:isRecording="isRecording" v-bind:isTransitioning="isTransitioning" />
        <recorder-status v-bind:recorderState="vm.recorderState" />
        <active-note v-if="isRecording" v-bind:vm="vm" />
    </div>
    `,
  data: {
    vm: new PracticeProgressVM(),
  },
  components: {
    StartStop,
    RecorderStatus,
    ActiveNote,
  },
  methods: {
    handleRecordingToggled() {
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
