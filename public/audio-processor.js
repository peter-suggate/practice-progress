import "./worker-polyfills/text-encoder.js";
import init, {
  cqt_octaves
} from "./music-analyzer-wasm-rs/music_analyzer_wasm_rs.js";

class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.port.onmessage = event => this.onmessage(event.data);
  }

  async loadWasm(wasmBytes) {
    // const compiledModule = await WebAssembly.compile(wasmBytes);
    // this.wasmInstance = await WebAssembly.instantiate(compiledModule, {});

    init(WebAssembly.compile(wasmBytes)).then(() => {
      console.log(cqt_octaves());
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
        outputSamples[index] = identity(sample);
      });
    }

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
