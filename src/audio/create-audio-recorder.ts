function scriptUrl(scriptPath: string) {
  const publicUrl = "http://localhost:8080";

  return `${publicUrl}/${scriptPath}`;
}

async function fetchMusicAnalyzerWasm() {
  const res = await fetch(
    scriptUrl("music-analyzer-wasm-rs/music_analyzer_wasm_rs_bg.wasm")
  );
  return res.arrayBuffer();
}

export async function createAudioRecorder() {
  const context = new AudioContext();

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  });

  const audioSource = context.createMediaStreamSource(stream);

  try {
    // Add our audio processor worklet to the context.
    await context.audioWorklet.addModule(scriptUrl("audio-processor.js"));

    const audioProcessor = new AudioWorkletNode(context, "audio-processor");

    // Fetch the Wasm module as raw bytes and pass to the worklet.
    const wasmBytes = await fetchMusicAnalyzerWasm();
    console.log(wasmBytes);
    audioProcessor.port.postMessage({
      type: "load-wasm-module",
      wasmBytes
    });

    audioSource.connect(audioProcessor);
  } catch (e) {
    console.trace(e);
  }
}
