import React, { createContext, useContext, useReducer, useRef, useCallback, useEffect } from 'react';

const PlayerContext = createContext();

const initialState = {
  tracks: [],
  videos: [],
  currentTrack: null,
  currentIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  repeatMode: 'off', // off, one, all
  isShuffled: false,
  shuffledIndices: [],
  queue: [],
  playbackRate: 1,
  isVideoMode: false,
  equalizer: {
    enabled: false,
    preset: 'flat',
    bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  effects: {
    reverb: false,
    delay: false,
    spatial: 'stereo',
    binaural: false
  },
  neuroSync: {
    mood: 'calm',
    stressLevel: 30,
    adaptiveMode: false
  },
  visualizerType: 'wave',
  miniPlayerVisible: false,
  isLoading: false,
  error: null
};

function playerReducer(state, action) {
  switch (action.type) {
    case 'SET_TRACKS':
      return { ...state, tracks: action.payload };
    case 'SET_VIDEOS':
      return { ...state, videos: action.payload };
    case 'SET_CURRENT_TRACK':
      return {
        ...state,
        currentTrack: action.payload.track,
        currentIndex: action.payload.index,
        isPlaying: true,
        currentTime: 0,
        isVideoMode: action.payload.track?.type === 'video'
      };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload, isMuted: action.payload === 0 };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    case 'SET_REPEAT':
      const modes = ['off', 'one', 'all'];
      const nextIndex = (modes.indexOf(state.repeatMode) + 1) % 3;
      return { ...state, repeatMode: modes[nextIndex] };
    case 'TOGGLE_SHUFFLE':
      if (!state.isShuffled) {
        const indices = Array.from({ length: state.tracks.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return { ...state, isShuffled: true, shuffledIndices: indices };
      }
      return { ...state, isShuffled: false, shuffledIndices: [] };
    case 'SET_EQUALIZER':
      return { ...state, equalizer: { ...state.equalizer, ...action.payload } };
    case 'SET_EFFECTS':
      return { ...state, effects: { ...state.effects, ...action.payload } };
    case 'SET_NEURO_SYNC':
      return { ...state, neuroSync: { ...state.neuroSync, ...action.payload } };
    case 'SET_VISUALIZER':
      return { ...state, visualizerType: action.payload };
    case 'SET_PLAYBACK_RATE':
      return { ...state, playbackRate: action.payload };
    case 'SET_MINI_PLAYER':
      return { ...state, miniPlayerVisible: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef(new Audio());
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const gainRef = useRef(null);
  const eqFiltersRef = useRef([]);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const gain = ctx.createGain();
      gainRef.current = gain;

      const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
      const filters = frequencies.map((freq, i) => {
        const filter = ctx.createBiquadFilter();
        filter.type = i === 0 ? 'lowshelf' : i === 9 ? 'highshelf' : 'peaking';
        filter.frequency.value = freq;
        filter.gain.value = 0;
        filter.Q.value = 1;
        return filter;
      });
      eqFiltersRef.current = filters;

      if (!sourceRef.current) {
        try {
          const source = ctx.createMediaElementSource(audioRef.current);
          sourceRef.current = source;
          
          source.connect(filters[0]);
          for (let i = 0; i < filters.length - 1; i++) {
            filters[i].connect(filters[i + 1]);
          }
          filters[filters.length - 1].connect(gain);
          gain.connect(analyser);
          analyser.connect(ctx.destination);
        } catch (e) {
          console.log('Audio source already connected');
        }
      }
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  const playTrack = useCallback((track, index) => {
    initAudioContext();
    
    if (track.url) {
      if (track.type === 'video') {
        if (videoRef.current) {
          videoRef.current.src = track.url;
          videoRef.current.play().catch(() => {});
        }
      } else {
        audioRef.current.src = track.url;
        audioRef.current.play().catch(() => {});
      }
    }
    
    dispatch({ type: 'SET_CURRENT_TRACK', payload: { track, index } });

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title || 'Unknown',
        artist: track.artist || 'Unknown Artist',
        album: track.album || 'Unknown Album',
        artwork: track.artwork ? [{ src: track.artwork, sizes: '512x512' }] : []
      });

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current.play();
        dispatch({ type: 'SET_PLAYING', payload: true });
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current.pause();
        dispatch({ type: 'SET_PLAYING', payload: false });
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious());
      navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        audioRef.current.currentTime = details.seekTime;
      });
    }
  }, [initAudioContext]);

  const playNext = useCallback(() => {
    const allMedia = [...state.tracks, ...state.videos];
    if (allMedia.length === 0) return;
    
    let nextIndex;
    if (state.isShuffled) {
      const shufflePos = state.shuffledIndices.indexOf(state.currentIndex);
      const nextShufflePos = (shufflePos + 1) % state.shuffledIndices.length;
      nextIndex = state.shuffledIndices[nextShufflePos];
    } else {
      nextIndex = (state.currentIndex + 1) % allMedia.length;
    }
    
    playTrack(allMedia[nextIndex], nextIndex);
  }, [state.tracks, state.videos, state.currentIndex, state.isShuffled, state.shuffledIndices, playTrack]);

  const playPrevious = useCallback(() => {
    const allMedia = [...state.tracks, ...state.videos];
    if (allMedia.length === 0) return;
    
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    
    let prevIndex;
    if (state.isShuffled) {
      const shufflePos = state.shuffledIndices.indexOf(state.currentIndex);
      const prevShufflePos = (shufflePos - 1 + state.shuffledIndices.length) % state.shuffledIndices.length;
      prevIndex = state.shuffledIndices[prevShufflePos];
    } else {
      prevIndex = (state.currentIndex - 1 + allMedia.length) % allMedia.length;
    }
    
    playTrack(allMedia[prevIndex], prevIndex);
  }, [state.tracks, state.videos, state.currentIndex, state.isShuffled, state.shuffledIndices, playTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    
    const onTimeUpdate = () => dispatch({ type: 'SET_TIME', payload: audio.currentTime });
    const onDurationChange = () => dispatch({ type: 'SET_DURATION', payload: audio.duration });
    const onEnded = () => {
      if (state.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (state.repeatMode === 'all' || state.currentIndex < state.tracks.length - 1) {
        playNext();
      } else {
        dispatch({ type: 'SET_PLAYING', payload: false });
      }
    };
    const onError = (e) => {
      console.error('Audio error:', e);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to play track' });
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [state.repeatMode, state.currentIndex, state.tracks.length, playNext]);

  useEffect(() => {
    audioRef.current.volume = state.isMuted ? 0 : state.volume;
  }, [state.volume, state.isMuted]);

  useEffect(() => {
    audioRef.current.playbackRate = state.playbackRate;
  }, [state.playbackRate]);

  useEffect(() => {
    if (state.equalizer.enabled && eqFiltersRef.current.length > 0) {
      state.equalizer.bands.forEach((val, i) => {
        if (eqFiltersRef.current[i]) {
          eqFiltersRef.current[i].gain.value = val;
        }
      });
    }
  }, [state.equalizer]);

  const togglePlay = useCallback(() => {
    initAudioContext();
    if (state.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    dispatch({ type: 'TOGGLE_PLAY' });
  }, [state.isPlaying, initAudioContext]);

  const seekTo = useCallback((time) => {
    audioRef.current.currentTime = time;
    dispatch({ type: 'SET_TIME', payload: time });
  }, []);

  const value = {
    state,
    dispatch,
    audioRef,
    videoRef,
    analyserRef,
    audioContextRef,
    playTrack,
    playNext,
    playPrevious,
    togglePlay,
    seekTo,
    initAudioContext
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
