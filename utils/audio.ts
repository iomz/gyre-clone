export function playRadioNoise(duration = 2) {
  const audioCtx = new AudioContext();

  // Create a buffer of random samples
  const bufferSize = audioCtx.sampleRate * duration; // e.g., 2 seconds
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  // Fill with random values between -1 and 1
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  // Play the buffer
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  // Optional: apply a filter to make it more “radio-like”
  const filter = audioCtx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 18000; // high frequencies
  filter.Q.value = 0.7;

  noise.connect(filter).connect(audioCtx.destination);
  noise.start();
  noise.stop(audioCtx.currentTime + duration);
}
