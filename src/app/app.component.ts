import { Component, ElementRef, HostListener, CUSTOM_ELEMENTS_SCHEMA, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MediaPlayEvent, MediaPauseEvent } from 'vidstack';
import { ResizeState } from './resizeState';
import { ResizeService } from './resize.service';
import { VideosService } from './videos.service';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { UserVideo } from './user-video';
import { VideoListComponent } from './video-list/video-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VideoListComponent, VideoPlayerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent implements OnInit {

  @ViewChild('player') player!: VideoPlayerComponent;

  public windowWidth: any;
  public windowHeight: any;
  public border: any = 25;

  public playerTop: any = 0;
  public playerLeft: any = 0;
  public playerWidth: any = 0;
  public playerHeight: any = 0;

  public listTop: any = 0;
  public listLeft: any = 0;
  public listWidth: any = 0;
  public listHeight: any = 0;

  public windowAspectRatio: any;
  public maxWidth: any = 800;

  public resizeState = new ResizeState();
  videos: UserVideo[] = [];


  // Component state
  title = 'angular-vidstack-volume';
  displayedColumns: string[] = ['id', 'title', 'value'];
  currentVideoId = 1;
  videoSource: string | null = '';

  currentVideo: UserVideo = {
    id: 0,
    title: "",
    link: "",
  };

  constructor(
    private videosService: VideosService,
    private resizeService: ResizeService)
    {
    console.log("constructor");
    this.resizeWindow();
  }

  ngOnInit(): void {
    console.log('ngOnInit()');

    this.videosService.share_videos$.subscribe((data: any) => {
      this.videos = data;
      console.log("this.share_videos$");
      console.log(data);
    })

    this.videosService.share_currentVideo.subscribe((data: any) => {
      this.currentVideo = data;
      console.log("dashboard.component :: ngOnInit :: share_currentVideo");
      console.log("this.currentVideo.link");
      console.log(this.currentVideo.link);
      this.player.play(this.currentVideo.link);
    })

    this.resizeWindow();
  }

  onplayerEnd(event: any) {
    console.log("onplayerEnd");
    console.log("event: " + event);

    console.log("this.currentVideo");
    console.log(this.currentVideo);
    console.log("this.userVideos");
    console.log(this.videos);

    var nextVideoIndex: number = 0;

    //the video id begins with 1... but the indexes are 0 based.
    if (this.currentVideo.id >= this.videos.length) {
      nextVideoIndex = 1;
    } else {
      nextVideoIndex = this.currentVideo.id + 1;
    }
    //subtract 1 when referencing an array index
    var nextVideo = this.videos[nextVideoIndex - 1];
    this.videosService.setCurrentVideo(nextVideo);
  }

  // Event handlers
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
    console.log("resize Window");

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
    this.playerWidth = (this.windowWidth - (this.border * 2));
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

