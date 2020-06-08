import { Either, left, right } from "fp-ts/lib/Either";
import { taskFromAsync } from "../fp-util";
import { TaskEither } from "fp-ts/lib/TaskEither";

type AudioAnalyzerEventTypes =
  | {
      type: "cqt";
      result: Uint16Array;
    }
  | {
      type: "pitches";
      result: any;
    };

function scriptUrl(scriptPath: string) {
  const publicUrl = "http://localhost:8080/public";

  return `${publicUrl}/${scriptPath}`;
}

export class AudioAnalyzerNode {
  audioWorkletNode: AudioWorkletNode;

  private constructor(context: AudioContext, wasmBytes: ArrayBuffer) {
    this.audioWorkletNode = new globalThis.AudioWorkletNode(
      context,
      "audio-processor"
    );

    this.audioWorkletNode.port.onmessage = (event) =>
      this.onmessage(event.data);

    this.audioWorkletNode.port.postMessage({
      type: "load-wasm-module",
      wasmBytes,
    });

    this.audioWorkletNode.onprocessorerror = (e) => {
      console.log(
        `An error from AudioWorkletProcessor.process() occurred: ${e}`
      );
    };
  }

  static create(context: AudioContext): TaskEither<Error, AudioAnalyzerNode> {
    // Fetch the Wasm module as raw bytes and pass to the worklet.
    return taskFromAsync(async () => {
      await context.suspend();

      // Add our audio processor worklet to the context.
      await context.audioWorklet.addModule(AudioAnalyzerNode.processorUrl);

      const wasmBytes = await AudioAnalyzerNode.fetchMusicAnalyzerWasm();

      return new AudioAnalyzerNode(context, wasmBytes);
    });
  }

  static get processorUrl(): string {
    return scriptUrl("audio-processor.js");
  }

  private static async fetchMusicAnalyzerWasm() {
    const res = await globalThis.fetch(
      scriptUrl("music-analyzer-wasm-rs/music_analyzer_wasm_rs_bg.wasm")
    );
    return res.arrayBuffer();
  }

  onmessage(eventData: AudioAnalyzerEventTypes) {
    switch (eventData.type) {
      case "cqt": {
        console.log("cqt arrived", eventData.result);
        break;
      }
      case "pitches": {
        console.log(
          `latest pitches (Hz) amount: ${eventData.result.length}, first: `,
          eventData.result[0]
        );
        break;
      }
      default:
        break;
    }
  }
}
