import { Component, ElementRef, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import 'vidstack/player/styles/default/theme.css';
import 'vidstack/player/styles/default/layouts/video.css';
import 'vidstack/player';
import 'vidstack/player/layouts/default';
import 'vidstack/player/ui';
import { MediaPlayEvent, MediaPauseEvent, } from 'vidstack';
import { MediaRemoteControl } from 'vidstack';
import { MediaEvents } from 'vidstack';
import { MediaStore, MediaPlayer, MediaContext, MediaAudioGainChangeEvent } from 'vidstack';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';

export interface Video {
  id: number;
  artist: string;
  link: string;
}

const Videos: Video[] = [
  { id: 1, artist: 'Collective Soul - December', link: 'youtube/6exsatE-DUk' },
  { id: 2, artist: 'Eminem - Not Afraid', link: 'youtube/j5-yKhDd64s' },
  { id: 3, artist: 'Kid Rock - All Summer Long', link: 'youtube/uwIGZLjugKA' },
];

//const remote = new MediaRemoteControl();

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [MatTableModule, MatButtonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'angular-vidstack-volume';
  displayedColumns: string[] = ['id', 'artist', 'value'];
  dataSource = Videos;
  currentVideoId: number = 1;
  videoSource: string | null = '';

  @ViewChild('media') media!: ElementRef;

  ngOnInit() {
    console.log('ngOnInit');
    this.currentVideoId = 1;
    this.playVideo(this.currentVideoId);
  }

  onPause(event: MediaPlayEvent) {
    console.log('Media paused');
  }

  onStarted(event: MediaPlayEvent) {
    console.log('Media started');
  }

  onEnded(event: MediaPlayEvent) {
    console.log('Media ended');
    if (this.currentVideoId < Videos.length) {
      this.currentVideoId++;
      this.playVideo(this.currentVideoId);
    } else {
      this.currentVideoId = 1;
      this.playVideo(this.currentVideoId);
    }
  }

  onEnd(event: MediaPlayEvent) {
    console.log('Media end');
  }

  onPlay(event: MediaPauseEvent) {
    console.log('Media played');
  }

  playSelectedVideo(Video: Video){
    console.log('Video: ', Video);
    this.playVideo(Video.id);
  }

  playVideo(id: number) {
    console.log('playVideo: ', id);
    this.currentVideoId = id;
    this.videoSource = Videos[this.currentVideoId - 1].link;
    this.media.nativeElement.play();
    //const player = document.querySelector('media-player')!;
    //player.play();
  }

}

