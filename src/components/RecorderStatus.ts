import Vue from "vue";

export default Vue.extend({
  template: `
      <div class="md-body-2">
          <span>{{recorderState}}</span>
      </div>
    `,
  props: { recorderState: String },
  methods: {
    toggleRecording() {
      this.$emit("recording-toggled", !this.recorderState);
    },
  },
});
