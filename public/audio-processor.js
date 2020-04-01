import "./worker-polyfills/text-encoder.js";
import init, {
  AudioSamplesProcessor
} from "./music-analyzer-wasm-rs/music_analyzer_wasm_rs.js";

class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.port.onmessage = event => this.onmessage(event.data);
  }

  async loadWasm(wasmBytes) {
    init(WebAssembly.compile(wasmBytes)).then(() => {
      console.log("wasm module compiled and ready to go");

      this.wasmSamplesProcessor = AudioSamplesProcessor.new();
    });
  }

  onmessage = eventData => {
    switch (eventData.type) {
      case "load-wasm-module": {
        this.loadWasm(eventData.wasmBytes);
        break;
      }
    }
  };

  process(inputs, outputs) {
    // By default, the node has single input and output.
    const input = inputs[0];
    const output = outputs[0];

    for (let channel = 0; channel < output.length; ++channel) {
      const inputSamples = input[channel];
      const outputSamples = output[channel];

      // output[channel].set(input[channel]);
      inputSamples.forEach((sample, index) => {
        outputSamples[index] = sample;
      });

      this.wasmSamplesProcessor.add_samples(outputSamples);

      const analyzer = this.wasmSamplesProcessor.create_analyzer();

      if (analyzer) {
        console.log("analyzer.num_samples", analyzer.num_samples);
        // const octaves = analyzer.cqt_octaves();

        // this.port.postMessage({
        //   type: "cqt",
        //   result: octaves
        // });

        analyzer.free();
      }
    }

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
