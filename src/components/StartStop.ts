import Vue from "vue";

export default Vue.extend({
  template: `
      <div>
          <button @click="toggleRecording">{{actionText}}</button>
      </div>
    `,
  props: [],
  data() {
    return {
      isRecording: false
    };
  },
  methods: {
    toggleRecording() {
      this.isRecording = !this.isRecording;

      this.$emit("recording-toggled", this.isRecording);
    }
  },
  computed: {
    actionText(): string {
      return this.isRecording ? "Stop" : "Start";
    }
  }
});
