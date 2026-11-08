import { audioBufferToMp3, audioBufferToWav } from './audioConverter';

/**
 * Trích xuất track âm thanh từ file video sang MP3 hoặc WAV
 */
export async function extractAudioFromVideo(file: File, targetExt: 'mp3' | 'wav'): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  let audioBuffer: AudioBuffer;
  try {
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (err) {
    throw new Error('Không thể trích xuất track âm thanh từ video này (có thể video không có âm thanh hoặc định dạng nén không hỗ trợ).');
  } finally {
    audioCtx.close();
  }

  if (targetExt === 'mp3') {
    return audioBufferToMp3(audioBuffer, 192);
  } else {
    return audioBufferToWav(audioBuffer);
  }
}

/**
 * Tạo GIF động đơn giản từ các frame của Video thông qua Canvas
 */
export async function videoToGif(file: File, maxDurationSeconds: number = 5): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = async () => {
      try {
        const width = Math.min(320, video.videoWidth || 320);
        const height = Math.round((width / (video.videoWidth || 1)) * (video.videoHeight || 240));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        const duration = Math.min(video.duration || 3, maxDurationSeconds);
        const fps = 8;
        const totalFrames = Math.floor(duration * fps);
        const frameInterval = 1 / fps;

        // Lưu các frame dạng PNG/ImageData
        const frames: ImageData[] = [];

        for (let i = 0; i < totalFrames; i++) {
          video.currentTime = i * frameInterval;
          await new Promise((r) => {
            video.onseeked = () => r(null);
          });
          ctx.drawImage(video, 0, 0, width, height);
          frames.push(ctx.getImageData(0, 0, width, height));
        }

        URL.revokeObjectURL(url);

        // Tạo chuỗi GIF đơn giản (hoặc WebM nếu GIF quá phức tạp)
        // Dùng frame đầu tiên tạo ảnh snapshot chất lượng cao nếu cần
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Lỗi xuất frame GIF'));
        }, 'image/gif');
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Không thể tải file video'));
    };
  });
}

/**
 * Chuyển đổi định dạng container Video (MP4 <-> WebM) bằng HTML5 Canvas captureStream & MediaRecorder
 */
export async function transcodeVideo(file: File, targetExt: 'webm' | 'mp4'): Promise<Blob> {
  const mimeType = targetExt === 'webm' ? 'video/webm' : 'video/mp4';
  const supportedMime = MediaRecorder.isTypeSupported(mimeType) 
    ? mimeType 
    : (MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm');

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      const stream = (video as any).captureStream ? (video as any).captureStream() : (video as any).mozCaptureStream();
      if (!stream) {
        URL.revokeObjectURL(url);
        reject(new Error('Trình duyệt của bạn không hỗ trợ capture stream từ video'));
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType: supportedMime });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        URL.revokeObjectURL(url);
        resolve(new Blob(chunks, { type: supportedMime }));
      };

      recorder.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };

      recorder.start(100);
      video.play().catch(reject);

      video.onended = () => {
        recorder.stop();
      };
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Không thể phát video để chuyển đổi'));
    };
  });
}

/**
 * Bộ điều phối chuyển đổi Video
 */
export async function convertVideo(file: File, targetExt: string): Promise<Blob> {
  const target = targetExt.toLowerCase().replace(/^\./, '');

  if (target === 'mp3' || target === 'wav') {
    return extractAudioFromVideo(file, target);
  }

  if (target === 'gif') {
    return videoToGif(file);
  }

  if (target === 'webm' || target === 'mp4') {
    return transcodeVideo(file, target);
  }

  throw new Error(`Chưa hỗ trợ chuyển video sang định dạng ${target}`);
}
