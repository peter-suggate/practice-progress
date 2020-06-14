import { none, some, fold, map, chain, Option } from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { pipe } from "fp-ts/lib/pipeable";
import { Observable } from "rxjs";
import {
  MaybeAudioRecorder,
  AudioRecorder,
  audioRecorderStatus,
  audioRecorderStatusDetails,
  AudioRecorderEventTypes,
} from "../audio/recorder";
import { fakeAudioRecorderSetup } from "../audio/recorder/fake";

export class PracticeProgressVM {
  recorder: MaybeAudioRecorder = none;

  audioRecorderSetup = fakeAudioRecorderSetup;

  get analyzer(): Option<Observable<AudioRecorderEventTypes>> {
    return pipe(
      this.recorder,
      chain((recorder) =>
        recorder.type === "running" ? some(recorder.analyzer$) : none
      )
    );
  }

  // Records the transitioning state so that the UI updates
  private updateRecorder<RecorderState extends AudioRecorder>() {
    return TE.map<RecorderState, RecorderState>((recorder) => {
      this.recorder = some(recorder);
      return recorder;
    });
  }

  async createRecorderAndStart() {
    const createAudioRecorder = pipe(
      this.audioRecorderSetup.create({
        onStatusChange: (status: AudioRecorder) => {
          this.recorder = some(status);
        },
      }),
      TE.fold(
        (e) => {
          console.trace(e);

          this.recorder = none;

          return T.of(undefined);
        },
        (recorder) => {
          this.recorder = some(recorder);

          // recorder.analyzer$.su;
          return T.of(recorder);
        }
      )
    );

    const recorder = await createAudioRecorder();

    if (recorder) {
      await pipe(
        this.audioRecorderSetup.resume(recorder),
        TE.fold(
          (e) => {
            console.trace(e);

            this.recorder = none;

            return T.of(undefined);
          },
          (recorder) => {
            this.recorder = some(recorder);

            return T.of(undefined);
          }
        )
      )();
    }
  }

  get recorderState(): string {
    return audioRecorderStatus(this.recorder);
  }

  get recorderStateDetails(): string {
    return audioRecorderStatusDetails(this.recorder);
  }

  async toggleRecording() {
    fold<AudioRecorder, void>(
      () => {
        this.createRecorderAndStart();
      },
      async (recorder) => {
        switch (recorder.type) {
          case "running":
            await pipe(
              this.audioRecorderSetup.suspend(recorder),
              // Record the transitioning state so that the UI updates
              this.updateRecorder()
            )();
            break;
          case "stopped":
            await pipe(
              this.audioRecorderSetup.resume(recorder),
              // Record the transitioning state so that the UI updates
              this.updateRecorder()
            )();
            break;
          default:
            break;
        }
      }
    )(this.recorder);
  }
}
