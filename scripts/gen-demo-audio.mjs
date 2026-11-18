#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
function writeWav(file, freqA, freqB) {
  const sampleRate = 22050;
  const duration = 45;
  const numSamples = sampleRate * duration;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = Math.min(1, t / 2) * Math.min(1, (duration - t) / 3);
    const sample = Math.max(
      -1,
      Math.min(
        1,
        (Math.sin(2 * Math.PI * freqA * t) * 0.12 +
          Math.sin(2 * Math.PI * freqB * t) * 0.08) *
          env
      )
    );
    buffer.writeInt16LE((sample * 32767) | 0, 44 + i * 2);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buffer);
}
writeWav("public/demos/forest-echoes.wav", 110, 164.81);
writeWav("public/demos/night-drive.wav", 98, 146.83);
console.log("demo audio ready");
