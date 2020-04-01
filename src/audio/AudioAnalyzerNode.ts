import { Either, left, right } from "fp-ts/lib/Either";

type AudioAnalyzerEventTypes = {
  type: "cqt";
  result: Uint16Array;
};

function scriptUrl(scriptPath: string) {
  const publicUrl = "http://localhost:8080";

  return `${publicUrl}/${scriptPath}`;
}

export class AudioAnalyzerNode {
  audioWorkletNode: AudioWorkletNode;

  private constructor(context: AudioContext, wasmBytes: ArrayBuffer) {
    this.audioWorkletNode = new globalThis.AudioWorkletNode(
      context,
      "audio-processor"
    );

    this.audioWorkletNode.port.onmessage = event => this.onmessage(event.data);

    this.audioWorkletNode.port.postMessage({
      type: "load-wasm-module",
      wasmBytes
    });
  }

  static async create(
    context: AudioContext
  ): Promise<Either<Error, AudioAnalyzerNode>> {
    // Fetch the Wasm module as raw bytes and pass to the worklet.
    try {
      // Add our audio processor worklet to the context.
      await context.audioWorklet.addModule(AudioAnalyzerNode.processorUrl);

      const wasmBytes = await AudioAnalyzerNode.fetchMusicAnalyzerWasm();

      const node = new AudioAnalyzerNode(context, wasmBytes);

      return right(node);
    } catch (error) {
      console.error(error);

      return left(error);
    }
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
      default:
        break;
    }
  }
}
