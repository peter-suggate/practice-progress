import Vue from "vue";

export default Vue.extend({
  template: `
      <div class="md-body-2">
          <span>{{recorderState}}</span>
          <span>{{recorderStateDetails}}</span>
      </div>
    `,
  props: { recorderState: String, recorderStateDetails: String },
  methods: {
    toggleRecording() {
      this.$emit("recording-toggled");
    },
  },
});
