import "./worker-polyfills/text-encoder.js";
import init, {
  AudioSamplesProcessor,
} from "./music-analyzer-wasm-rs/music_analyzer_wasm_rs.js";

class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.port.onmessage = (event) => this.onmessage(event.data);

    this.iteration = 0;
  }

  async loadWasm(wasmBytes) {
    init(WebAssembly.compile(wasmBytes)).then(() => {
      console.log("wasm module compiled and ready to go");

      this.wasmSamplesProcessor = AudioSamplesProcessor.new();

      this.pitchDetector = this.wasmSamplesProcessor.create_pitch_detector(
        "McLeod"
      );
    });
  }

  onmessage = (eventData) => {
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

    const updatesPerSecond = 44100 / 128;
    const desiredUpdatesPerSecond = 10;
    const iterationsPerUpdate = Math.ceil(
      updatesPerSecond / desiredUpdatesPerSecond
    );

    for (let channel = 0; channel < output.length; ++channel) {
      const inputSamples = input[channel];
      const outputSamples = output[channel];

      // output[channel].set(input[channel]);
      inputSamples.forEach((sample, index) => {
        outputSamples[index] = sample;
      });

      this.wasmSamplesProcessor.add_samples_chunk(outputSamples);

      if (
        this.pitchDetector &&
        this.wasmSamplesProcessor.has_sufficient_samples() &&
        this.iteration % iterationsPerUpdate === 0
      ) {
        try {
          this.wasmSamplesProcessor.set_latest_samples_on(this.pitchDetector);

          const pitches = this.pitchDetector.pitches();

          if (pitches.length > 0) {
            this.port.postMessage({
              type: "pitches",
              result: pitches.map((p) => ({
                hz: p.frequency,
                clarity: p.clarity,
                t: p.t,
              })),
            });

            pitches.forEach((p) => p.free());
          }
        } catch (e) {
          console.error(e);
        }
        // if (this.iteration % 16 === 0) {
        //   const octaves = analyzer.cqt_octaves();
        // }
        // this.port.postMessage({
        //   type: "cqt",
        //   result: octaves
        // });

        // analyzer.free();
      }
    }

    this.iteration++;

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
