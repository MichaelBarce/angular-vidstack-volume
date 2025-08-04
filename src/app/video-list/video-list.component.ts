import { Component, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ResizeService } from '../resize.service'
import { UserVideo } from '../user-video';
import { VideosService } from '../videos.service';
import { ResizeState } from '../resizeState';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})

export class VideoListComponent implements OnInit {

  @Input() videos: UserVideo[] = [];
  @ViewChild('userVideoFilter', { read: ElementRef }) userVideoFilter: ElementRef | undefined;

  currentVideo?: UserVideo;
  public resizeState: ResizeState | undefined;
  public userVideos: UserVideo[] = [];
  displayedColumns: string[] = ['id', 'title', 'link'];

  constructor(
    private videosService: VideosService,
    private resizeService: ResizeService
  ) {
    console.log("video-list constructor");
  }

  ngOnInit(): void {

    this.videosService.share_videos$.subscribe((data: any) => {
      this.userVideos = data;
      console.log("dashboardComponent.share_currentUserVideoTag$");
      console.log("this.userVideos");
      console.log(this.userVideos);
    })

  }

  onRowSelectMyVideos(video: UserVideo) {
    console.log(video);
    this.currentVideo = video;
    this.videosService.setCurrentVideo(this.currentVideo);
  }

}
