import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
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

  public videoId: string = "youtube/qDuKsiwS5xw";

  ngOnInit() {

    const player = document.querySelector('media-player')!;

    player.addEventListener('play', () => {
      console.log('Video started playing');
    });

    player.addEventListener('pause', () => {
      console.log('Video is paused');
    });

    player.addEventListener('ended', () => {
      console.log('Video ended');
      const data = player.src;
      this.onPlayerEnd.emit(data);
    });

  }

  play(video: string) {
    const player = document.querySelector('media-player')!;
    player.src=video;
    player.play();
  }

}
