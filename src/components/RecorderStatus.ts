import Vue from "vue";

export default Vue.extend({
  template: `
      <div>
          <span>{{recorderState}}</span>
      </div>
    `,
  props: { recorderState: String },
  methods: {
    toggleRecording() {
      this.$emit("recording-toggled", !this.recorderState);
    }
  }
});
