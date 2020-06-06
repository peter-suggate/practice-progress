import Vue from "vue";

export default Vue.extend({
  template: `
      <div>
          <md-button class="md-raised md-primary" @click="toggleRecording" v-bind:disabled="isTransitioning">{{actionText}}</md-button>
      </div>
    `,
  props: { isRecording: Boolean, isTransitioning: Boolean },
  methods: {
    toggleRecording() {
      this.$emit("recording-toggled", !this.isRecording);
    },
  },
  computed: {
    actionText(): string {
      return this.isTransitioning
        ? "initializing"
        : this.isRecording
        ? "Stop"
        : "Start";
    },
  },
});
