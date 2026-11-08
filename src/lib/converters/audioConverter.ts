import * as lamejs from 'lamejs';

/**
 * Chuyển đổi AudioBuffer sang định dạng WAV (PCM 16-bit)
 */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels: Float32Array[] = [];
  let sample: number = 0;
  let offset = 0;
  let pos = 0;

  function setUint16(data: number) {
    out.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    out.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF identifier
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  // fmt sub-chunk
  setUint32(0x20746d66); // "fmt "
  setUint32(16); // subchunk1size (16 for PCM)
  setUint16(1); // audio format (1 = PCM)
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2); // block align
  setUint16(16); // bits per sample

  // data sub-chunk
  setUint32(0x61746164); // "data"
  setUint32(length - pos - 4); // chunk length

  // Viết dữ liệu mẫu (interleave channels)
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp [-1, 1]
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out.buffer], { type: 'audio/wav' });
}

/**
 * Chuyển đổi Float32Array [-1, 1] sang Int16Array [-32768, 32767]
 */
function floatToInt16(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output;
}

/**
 * Chuyển đổi AudioBuffer sang MP3 sử dụng LameJS
 */
export function audioBufferToMp3(buffer: AudioBuffer, kbps: number = 192): Blob {
  const channels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  
  // lamejs có thể là default export hoặc namespace export tùy bundler
  const Mp3Encoder = (lamejs as any).Mp3Encoder || (lamejs as any).default?.Mp3Encoder;
  if (!Mp3Encoder) {
    throw new Error('Không thể khởi tạo bộ mã hóa MP3 LameJS');
  }

  const mp3encoder = new Mp3Encoder(channels >= 2 ? 2 : 1, sampleRate, kbps);
  const mp3Data: Int8Array[] = [];

  const sampleBlockSize = 1152;
  const left = floatToInt16(buffer.getChannelData(0));
  const right = channels >= 2 ? floatToInt16(buffer.getChannelData(1)) : undefined;

  for (let i = 0; i < left.length; i += sampleBlockSize) {
    const leftChunk = left.subarray(i, i + sampleBlockSize);
    let mp3buf: Int8Array;
    if (channels >= 2 && right) {
      const rightChunk = right.subarray(i, i + sampleBlockSize);
      mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    } else {
      mp3buf = mp3encoder.encodeBuffer(leftChunk);
    }
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }

  const mp3buf = mp3encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }

  return new Blob(mp3Data as BlobPart[], { type: 'audio/mpeg' });
}

/**
 * Chuyển đổi AudioBuffer sang WebA / Ogg bằng MediaRecorder
 */
export async function audioBufferToMediaRecorderFormat(
  buffer: AudioBuffer, 
  targetExt: 'ogg' | 'weba'
): Promise<Blob> {
  const mimeType = targetExt === 'ogg' ? 'audio/ogg; codecs=opus' : 'audio/webm; codecs=opus';
  const supportedMime = MediaRecorder.isTypeSupported(mimeType) ? mimeType : 'audio/webm';

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  const dest = audioCtx.createMediaStreamDestination();
  source.connect(dest);

  const recorder = new MediaRecorder(dest.stream, { mimeType: supportedMime });
  const chunks: Blob[] = [];

  return new Promise((resolve, reject) => {
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      audioCtx.close();
      resolve(new Blob(chunks, { type: supportedMime }));
    };

    recorder.onerror = (e) => {
      audioCtx.close();
      reject(e);
    };

    recorder.start(100);
    source.start(0);

    // Dừng recorder khi audio phát hết
    setTimeout(() => {
      recorder.stop();
      source.stop();
    }, (buffer.duration * 1000) + 150);
  });
}

/**
 * Hàm điều phối chuyển đổi âm thanh chính
 */
export async function convertAudio(file: File, targetExt: string): Promise<Blob> {
  const target = targetExt.toLowerCase().replace(/^\./, '');
  const arrayBuffer = await file.arrayBuffer();

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  let audioBuffer: AudioBuffer;
  try {
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (err) {
    throw new Error('Định dạng âm thanh nguồn không được hỗ trợ giải mã bởi trình duyệt.');
  } finally {
    audioCtx.close();
  }

  if (target === 'wav') {
    return audioBufferToWav(audioBuffer);
  }

  if (target === 'mp3') {
    return audioBufferToMp3(audioBuffer, 192);
  }

  if (target === 'ogg' || target === 'weba') {
    try {
      return await audioBufferToMediaRecorderFormat(audioBuffer, target);
    } catch {
      // Fallback về WAV nếu MediaRecorder không hỗ trợ codec
      return audioBufferToWav(audioBuffer);
    }
  }

  throw new Error(`Chưa hỗ trợ chuyển sang định dạng âm thanh ${target}`);
}
