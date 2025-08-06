import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Output, ViewChild, computed } from '@angular/core';
import { VideosService } from '../videos.service';
import { UserVideo } from '../user-video';
import 'vidstack/player';
import 'vidstack/player/ui';
import 'vidstack/player/layouts/plyr';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent {
  @Output() onPlayerEnd = new EventEmitter<any>();
  @ViewChild('mediaPlayer', { static: false }) mediaPlayerRef!: ElementRef;
  @ViewChild('volumeSlider', { static: false }) volumeSliderRef!: ElementRef;

  currentVideo: UserVideo = { id: 0, title: '', link: '', isPlaying: false };
  videos = computed(() => this.videosService.videosSignal());
  player: any;
  initialVolume = 1;
  lastVolume = -1;
  isVideoEnded = false;
  
  constructor(private videosService: VideosService) {}

ngAfterViewInit() {
  const player = this.mediaPlayerRef.nativeElement;
  this.player = player;

  const storedVolume = parseFloat(localStorage.getItem('volume') || '1');
  this.initialVolume = isNaN(storedVolume) ? 1 : storedVolume;
  this.lastVolume = this.initialVolume;

  setTimeout(() => {
    if(this.videos().length > 0) {
      this.videos()[0].isPlaying = true;
    }
  })

  this.currentVideo = this.videos()[0]; 

  player.addEventListener('can-play', () => {
    setTimeout(() => {
      player.dispatchEvent(
        new CustomEvent('media-volume-change-request', { detail: this.initialVolume })
      );
    }, 300);

    const firstVideo = this.videos()[0];
    if (firstVideo) {
      this.currentVideo = firstVideo;
      this.play(firstVideo.link);
    }
  }, { once: true });

  const slider = this.volumeSliderRef.nativeElement;
  slider.addEventListener('value-change', (event: CustomEvent) => {
    let percent = event.detail;
    let decimal = parseFloat((percent / 100).toFixed(2));
    
    localStorage.setItem('volume', decimal.toString());
  });

  player.addEventListener('ended', () => {
    console.log('ended')
    this.isVideoEnded = true;
    const data = { src: player.src, id: this.currentVideo.id };
    this.onPlayerEnd.emit(data);
  });
}


play(video: string) {
  this.player.setAttribute('src', video);
  const currentVolume = parseFloat(localStorage.getItem('volume') || '1');
  
  const tryPlay = () => {
    setTimeout(() => {
      this.isVideoEnded = false;
      this.player.volume = currentVolume;
      this.player
        .play()
        .catch((err: any) => console.error('🚫 Autoplay blocked:', err));
    });
  };

  if (this.player.readyState >= 3) {
    tryPlay();
  } else {
    this.player.addEventListener('can-play', tryPlay, { once: true });
  }
}
}