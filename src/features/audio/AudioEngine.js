/**
 * Berea Audio Engine using Web Speech API & Studio Narration
 * Extended in Phase 8 for arbitrary text TTS (notes, AI responses, diagram descriptions, verses)
 */

class BereaAudioEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.utterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentRate = 1.0;
    this.currentText = '';
    this.listeners = [];

    // Load saved rate preference
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('berea_tts_rate');
      if (saved) this.currentRate = parseFloat(saved) || 1.0;
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb =>
      cb({
        isPlaying: this.isPlaying,
        isPaused: this.isPaused,
        rate: this.currentRate,
        text: this.currentText,
      })
    );
  }

  speak(text, rate = null) {
    if (!this.synth) return;

    this.stop();
    if (!text || !text.trim()) return;

    this.currentText = text.trim();
    if (rate !== null) this.currentRate = rate;

    this.utterance = new SpeechSynthesisUtterance(this.currentText);
    this.utterance.rate = this.currentRate;
    this.utterance.pitch = 1.0;

    // Pick preferred reverent voice
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(
      v =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Daniel') ||
          v.name.includes('Samantha') ||
          v.name.includes('Karen'))
    );
    if (preferredVoice) {
      this.utterance.voice = preferredVoice;
    }

    this.utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.currentText = '';
      this.notify();
    };

    this.utterance.onerror = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.currentText = '';
      this.notify();
    };

    this.synth.speak(this.utterance);
    this.isPlaying = true;
    this.isPaused = false;
    this.notify();
  }

  speakText(text, rate = null) {
    this.speak(text, rate);
  }

  pause() {
    if (this.synth && this.isPlaying && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.isPlaying = false;
      this.notify();
    }
  }

  resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.isPlaying = true;
      this.notify();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
      this.isPaused = false;
      this.currentText = '';
      this.notify();
    }
  }

  setRate(rate) {
    this.currentRate = rate;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('berea_tts_rate', String(rate));
    }
    if (this.utterance) {
      this.utterance.rate = rate;
    }
    this.notify();
  }
}

export const audioEngine = new BereaAudioEngine();
