import { StoppedAudioRecorder, StartedAudioRecorder } from "./AudioRecorder";
import * as TE from "fp-ts/lib/TaskEither";

export async function resumeAudioRecorder(
  recorder: StoppedAudioRecorder
): Promise<StartedAudioRecorder> {
  const { context } = recorder;

  if (context.state !== "suspended") {
    throw Error(
      `Cannot resume audio recording unless the audio context is suspended. Current state is ${context.state}`
    );
  }

  await context.resume();

  return {
    context,
    type: "running",
  };
}

export const resumeAudioRecorderTask = (recorder: StoppedAudioRecorder) =>
  TE.tryCatch(
    () => resumeAudioRecorder(recorder),
    (e) => e
  );

export async function suspendAudioRecorder(
  recorder: StartedAudioRecorder
): Promise<StoppedAudioRecorder> {
  const { context } = recorder;

  if (context.state !== "running") {
    throw Error(
      `Cannot stop audio recording unless the audio context is currently running. Current state is ${context.state}`
    );
  }

  await context.suspend();

  return {
    context,
    type: "stopped",
  };
}

export const suspendAudioRecorderTask = (recorder: StartedAudioRecorder) =>
  TE.tryCatch(
    () => suspendAudioRecorder(recorder),
    (e) => e
  );
