declare global {
  interface Window {
    Vimeo?: {
      Player: new (element: HTMLIFrameElement | string, options?: any) => VimeoPlayer;
    };
  }
}

interface VimeoPlayer {
  play(): Promise<void>;
  pause(): Promise<void>;
  setVolume(volume: number): Promise<number>;
  setLoop(loop: boolean): Promise<boolean>;
  on(event: string, callback: (data?: any) => void): void;
  off(event: string, callback?: (data?: any) => void): void;
}

export {};