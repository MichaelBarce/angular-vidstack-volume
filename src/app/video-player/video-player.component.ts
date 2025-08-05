import { CommonModule } from '@angular/common';
import { VideosService } from '../videos.service';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import 'vidstack/player';
import 'vidstack/player/ui';
import 'vidstack/player/layouts/plyr';
import { UserVideo } from '../user-video';

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

  currentVideo: UserVideo = {
    id: 0,
    title: "",
    link: "",
  };

  constructor(private videosService: VideosService) {
    console.log("constructor: VideoPlayerComponent");
  }

  ngOnInit() {

    const player = document.querySelector('media-player')!;

    this.videosService.share_currentVideo.subscribe((data: any) => {
      this.currentVideo = data;
      console.log("dashboard.component :: ngOnInit :: share_currentVideo");
      console.log("this.currentVideo.link");
      console.log(this.currentVideo.link);
      this.play(this.currentVideo.link);
    })

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
