import {
  MaybeAudioRecorder,
  AudioRecorder,
  audioRecorderStatus,
} from "../audio/audio-recording/AudioRecorder";
import { createAudioRecorderTask } from "../audio/audio-recording/createAudioRecorder";
import { none, some, fold } from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import {
  resumeAudioRecorderTask,
  suspendAudioRecorderTask,
} from "../audio/audio-recording/suspendResumeAudioRecorder";
import { pipe } from "fp-ts/lib/pipeable";

export class PracticeProgressVM {
  recorder: MaybeAudioRecorder = none;

  // Records the transitioning state so that the UI updates
  private updateRecorder<RecorderState extends AudioRecorder>() {
    return TE.map<RecorderState, RecorderState>((recorder) => {
      this.recorder = some(recorder);
      return recorder;
    });
  }

  async createRecorderAndStart() {
    const createAudioRecorder = pipe(
      createAudioRecorderTask({
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

          return T.of(recorder);
        }
      )
    );

    const recorder = await createAudioRecorder();

    if (recorder) {
      await pipe(
        resumeAudioRecorderTask(recorder),
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

  async toggleRecording() {
    fold<AudioRecorder, void>(
      () => {
        this.createRecorderAndStart();
      },
      async (recorder) => {
        switch (recorder.type) {
          case "running":
            await pipe(
              suspendAudioRecorderTask(recorder),
              // Record the transitioning state so that the UI updates
              this.updateRecorder()
            )();
            break;
          case "stopped":
            await pipe(
              resumeAudioRecorderTask(recorder),
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
