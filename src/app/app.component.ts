import { Component, ElementRef, HostListener, CUSTOM_ELEMENTS_SCHEMA, ViewChild, OnInit, AfterViewInit, OnDestroy, computed, signal } from '@angular/core';
import { MediaPlayEvent, MediaPauseEvent } from 'vidstack';
import { ResizeState } from './resizeState';
import { ResizeService } from './resize.service';
import { VideosService } from './videos.service';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { UserVideo } from './user-video';
import { VideoListComponent } from './video-list/video-list.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VideoListComponent, VideoPlayerComponent, ButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent implements OnInit {

  @ViewChild('player') player!: VideoPlayerComponent;

  public windowWidth: any;
  public windowHeight: any;
  public border: any = 5;

  public playerTop: any = 0;
  public playerLeft: any = 0;
  public playerWidth: any = 0;
  public playerHeight: any = 0;

  public listTop: any = 0;
  public listLeft: any = 0;
  public listWidth: any = 0;
  public listHeight: any = 0;

  public windowAspectRatio: any;
  public maxWidth: any = 1200;

  public resizeState = new ResizeState();
  videos = computed(() => this.videosService.videosSignal());
  currentVideoSignal = computed(() => this.videos()[0]);

  // Component state
  title = 'angular-vidstack-volume';
  displayedColumns: string[] = ['id', 'title', 'value'];
  currentVideoId = 1;
  videoSource: string | null = '';

  currentVideo: UserVideo = {
    id: 0,
    title: "",
    link: "",
    isPlaying: false
  };



  constructor(
    private videosService: VideosService,
    private resizeService: ResizeService)
  {
    this.resizeWindow();
  }

  ngOnInit(): void {
    this.resizeWindow();
  }

  onPlayerListClick(event: any) {
    const videos = this.videos();
    const currentIndex = videos.findIndex(v => v.link === event.src);
    const nextIndex = currentIndex >= videos.length ? 0 : currentIndex;
    const nextVideo = videos[nextIndex];
    videos[currentIndex -1].isPlaying = videos[currentIndex -1].isPlaying ?? false ;
    videos[nextIndex].isPlaying = true;

    this.videosService.currentVideoSignal.set(nextVideo);

    setTimeout(() => {
      this.player.play(nextVideo.link);
    }, 300); 
  }

  onplayerEnd(event: any) {
    const videos = this.videos();
    const currentIndex = videos.findIndex(v => v.link === event.src);
    const nextIndex = currentIndex + 1 >= videos.length ? 0 : currentIndex + 1;
    const nextVideo = videos[nextIndex];
    videos[currentIndex].isPlaying = false;
    videos[nextIndex].isPlaying = true;
    this.videosService.currentVideoSignal.set(nextVideo);

    setTimeout(() => {
      this.player.play(nextVideo.link);
    }, 300); 
  }
  
  onReady(event: any) {
    console.log("event: " + event);
  }

  onPause(event: MediaPlayEvent): void {
    console.log('onPause');
  }

  onPlay(event: MediaPauseEvent): void {
    console.log('onPlay');
  }

  onStarted(event: MediaPlayEvent): void {
    console.log('onStarted');
  }

  @HostListener('window:resize', ['$event'])
  resizeWindow() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    if (window.innerWidth > this.maxWidth) {
      this.windowWidth = this.maxWidth;
    }
    else {
      this.windowWidth = window.innerWidth;
    }

    this.playerTop = this.border;
    this.playerLeft = this.border;
    this.playerWidth = (this.windowWidth - (this.border * 3));
    this.playerHeight = ((this.windowWidth - (this.border * 3)) * 9 / 16);


    this.listTop = this.playerHeight + (this.border * 2);
    this.listLeft = this.border;
    this.listWidth = this.playerWidth
    this.listHeight = (window.innerHeight - this.border * 3) - this.playerHeight;

    this.resizeState.playerTop = this.playerTop;
    this.resizeState.playerLeft = this.playerLeft;
    this.resizeState.playerWidth = this.playerWidth;
    this.resizeState.playerHeight = this.playerHeight;

    this.resizeState.listTop = this.listTop;
    this.resizeState.listLeft = this.listLeft;
    this.resizeState.listHeight = this.listHeight;
    this.resizeState.listWidth = this.listWidth;

    this.resizeService.setResizeState(this.resizeState)

  }

}

