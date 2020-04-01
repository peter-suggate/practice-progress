import {
  createAudioRecorder,
  createAudioRecorderTask
} from "../createAudioRecorder";
import { requireLeft, requireRight } from "../../../testing/fp-testing";

it("returns error if microphone is not available", async () => {
  const recorder = await createAudioRecorderTask(async () => {
    throw Error("No mic available");
  })();

  expect(requireLeft(recorder)).toEqual(Error("No mic available"));
});

it("creates recorder in suspended state", async () => {
  const recorder = await createAudioRecorderTask()();

  expect(requireRight(recorder).status).toBe("stopped");
});
