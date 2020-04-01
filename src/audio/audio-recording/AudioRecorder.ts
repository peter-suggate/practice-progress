import { Option, fold } from "fp-ts/lib/Option";

export type AudioRecorderState =
  | "starting"
  | "stopping"
  | "stopped"
  | "running"
  | "uninitialized";

export type TransitioningAudioRecorder = {
  status: "starting" | "stopping";
};

export type StoppedAudioRecorder = {
  context: AudioContext;
  status: "stopped";
};

export type StartedAudioRecorder = {
  context: AudioContext;
  status: "running";
};

export type AudioRecorder =
  | StoppedAudioRecorder
  | StartedAudioRecorder
  | TransitioningAudioRecorder;

export type MaybeAudioRecorder = Option<AudioRecorder>;

export function audioRecorderState(
  recorder: MaybeAudioRecorder
): AudioRecorderState {
  return fold<AudioRecorder, AudioRecorderState>(
    () => "uninitialized",
    recorder => recorder.status
  )(recorder);
}
