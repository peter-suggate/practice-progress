import { Option, fold } from "fp-ts/lib/Option";

export type StoppedAudioRecorder = { type: "stopped"; context: AudioContext };
export type StartedAudioRecorder = { type: "running"; context: AudioContext };

export type AudioRecorder =
  | {
      type: "starting";
      message:
        | "Connecting to media"
        | "Fetching and compiling analysis modules";
    }
  | { type: "stopping" }
  | StoppedAudioRecorder
  | StartedAudioRecorder
  | { type: "uninitialized" }
  | { type: "error"; message: string };

export type MaybeAudioRecorder = Option<AudioRecorder>;

export function audioRecorderStatus(recorder: MaybeAudioRecorder): string {
  return fold<AudioRecorder, string>(
    () => "uninitialized",
    (recorder) => recorder.type
  )(recorder);
}
