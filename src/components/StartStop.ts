import Vue from "vue";

export default Vue.extend({
  template: `
      <div>
          <button @click="toggleRecording" v-bind:disabled="isTransitioning">{{actionText}}</button>
      </div>
    `,
  props: { isRecording: Boolean, isTransitioning: Boolean },
  methods: {
    toggleRecording() {
      this.$emit("recording-toggled", !this.isRecording);
    }
  },
  computed: {
    actionText(): string {
      return this.isTransitioning
        ? "initializing"
        : this.isRecording
        ? "Stop"
        : "Start";
    }
  }
});
