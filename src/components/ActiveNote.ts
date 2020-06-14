import Vue from "vue";
import { of } from "rxjs";
import { map as map$, filter as filter$ } from "rxjs/operators";
import { AudioRecorderEventTypes } from "../audio/recorder";
import { getOrElse } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { AudioPitchEvent } from "../audio/audio-types";

export default Vue.extend({
  template: `
      <div>
          <div class="md-display-4">{{pitch}}</div>
      </div>
    `,
  props: {
    // vm: { type: {} as () => PracticeProgressVM },
    vm: Object,
  },
  // computed: {
  //   text(): string {
  //     return this.analyzer.frequency;
  //   },
  // },
  // created: () => {
  //   this.analyzer
  // },
  subscriptions: function(this) {
    return {
      pitch: pipe(
        this.$props.vm.analyzer,
        getOrElse(() =>
          of<AudioRecorderEventTypes>({
            type: "pitch",
            pitch: {
              clarity: 1,
              free: () => {},
              frequency: 440,
              is_onset: true,
              t: 0,
            },
          })
        )
      ).pipe(
        filter$((e) => e.type === "pitch"),
        map$(
          (e) => (e as AudioPitchEvent).pitch.frequency
          // note: frequencyToNote((e as AudioPitchEvent).pitch.frequency),
        )
      ),
    };
  },
});
