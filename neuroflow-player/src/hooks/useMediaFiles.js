import { useState, useCallback } from 'react';
import * as musicMetadata from 'music-metadata-browser';

export function useMediaFiles() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scanFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!('showDirectoryPicker' in window)) {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'audio/*,video/*';
        input.webkitdirectory = true;

        return new Promise((resolve) => {
          input.onchange = async (e) => {
            const files = Array.from(e.target.files);
            const media = await processFiles(files);
            setLoading(false);
            resolve(media);
          };
          input.oncancel = () => {
            setLoading(false);
            resolve({ tracks: [], videos: [] });
          };
          input.click();
        });
      }

      const dirHandle = await window.showDirectoryPicker();
      const files = await getAllFiles(dirHandle);
      const media = await processFiles(files);
      setLoading(false);
      return media;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
      setLoading(false);
      return { tracks: [], videos: [] };
    }
  }, []);

  const addFiles = useCallback(async () => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'audio/*,video/*';

      input.onchange = async (e) => {
        const files = Array.from(e.target.files);
        const media = await processFiles(files);
        resolve(media);
      };
      input.oncancel = () => resolve({ tracks: [], videos: [] });
      input.click();
    });
  }, []);

  return { scanFiles, addFiles, loading, error };
}

async function getAllFiles(dirHandle, path = '') {
  const files = [];
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      const file = await entry.getFile();
      if (isMediaFile(file.name)) {
        files.push(file);
      }
    } else if (entry.kind === 'directory') {
      const subFiles = await getAllFiles(entry, `${path}${entry.name}/`);
      files.push(...subFiles);
    }
  }
  return files;
}

function isMediaFile(name) {
  const ext = name.split('.').pop().toLowerCase();
  const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'opus', 'webm'];
  const videoExts = ['mp4', 'mkv', 'avi', 'mov', 'webm', 'm4v', 'flv', '3gp'];
  return [...audioExts, ...videoExts].includes(ext);
}

function isVideoFile(name) {
  const ext = name.split('.').pop().toLowerCase();
  return ['mp4', 'mkv', 'avi', 'mov', 'webm', 'm4v', 'flv', '3gp'].includes(ext);
}

async function processFiles(files) {
  const tracks = [];
  const videos = [];

  for (const file of files) {
    const url = URL.createObjectURL(file);
    const isVideo = isVideoFile(file.name);

    let metadata = {
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Unknown Artist',
      album: 'Unknown Album',
      artwork: null,
      duration: 0
    };

    try {
      if (!isVideo) {
        const meta = await musicMetadata.parseBlob(file);
        metadata.title = meta.common.title || metadata.title;
        metadata.artist = meta.common.artist || metadata.artist;
        metadata.album = meta.common.album || metadata.album;
        metadata.duration = meta.format.duration || 0;

        if (meta.common.picture && meta.common.picture.length > 0) {
          const pic = meta.common.picture[0];
          const blob = new Blob([pic.data], { type: pic.format });
          metadata.artwork = URL.createObjectURL(blob);
        }
      }
    } catch (e) {
      // metadata parsing failed, use defaults
    }

    const item = {
      id: `${file.name}-${file.size}-${file.lastModified}`,
      ...metadata,
      url,
      file,
      type: isVideo ? 'video' : 'audio',
      size: file.size,
      format: file.name.split('.').pop().toUpperCase()
    };

    if (isVideo) {
      videos.push(item);
    } else {
      tracks.push(item);
    }
  }

  return { tracks, videos };
}
