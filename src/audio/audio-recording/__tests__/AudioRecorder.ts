import { audioRecorderState } from "../AudioRecorder";
import { none, some } from "fp-ts/lib/Option";
import { emptyImpl } from "../../../partial-impl";

describe("getting state of current audio recorder", () => {
  it("returns 'uninitialized' when audio recorder is empty", () => {
    expect(audioRecorderState(none)).toBe("uninitialized");
  });

  it("returns current state of audio recorder when there is one", () => {
    expect(
      audioRecorderState(
        some({
          status: "starting"
        })
      )
    ).toBe("starting");

    expect(
      audioRecorderState(
        some({
          status: "stopping"
        })
      )
    ).toBe("stopping");

    expect(
      audioRecorderState(
        some({
          context: emptyImpl<AudioContext>(),
          status: "running"
        })
      )
    ).toBe("running");

    expect(
      audioRecorderState(
        some({
          context: emptyImpl<AudioContext>(),
          status: "stopped"
        })
      )
    ).toBe("stopped");
  });
});
