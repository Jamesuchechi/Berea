/**
 * Berea Audio Engine using Web Speech API & Studio Narration
 */

class BereaAudioEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.utterance = null;
    this.isPlaying = false;
    this.currentRate = 1.0;
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb({ isPlaying: this.isPlaying, rate: this.currentRate }));
  }

  speak(text, rate = 1.0) {
    if (!this.synth) return;

    this.stop();
    this.currentRate = rate;

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = rate;
    this.utterance.pitch = 1.0;

    // Pick reverent English voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel')));
    if (preferredVoice) {
      this.utterance.voice = preferredVoice;
    }

    this.utterance.onend = () => {
      this.isPlaying = false;
      this.notify();
    };

    this.utterance.onerror = () => {
      this.isPlaying = false;
      this.notify();
    };

    this.synth.speak(this.utterance);
    this.isPlaying = true;
    this.notify();
  }

  pause() {
    if (this.synth && this.isPlaying) {
      this.synth.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  resume() {
    if (this.synth && !this.isPlaying) {
      this.synth.resume();
      this.isPlaying = true;
      this.notify();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
      this.notify();
    }
  }

  setRate(rate) {
    this.currentRate = rate;
    if (this.utterance) {
      this.utterance.rate = rate;
    }
    this.notify();
  }
}

export const audioEngine = new BereaAudioEngine();
