import { Component, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef, computed } from '@angular/core';
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
  @Output() onSelectVideo = new EventEmitter<any>();
  @ViewChild('userVideoFilter', { read: ElementRef }) userVideoFilter: ElementRef | undefined;

  currentVideo?: UserVideo;
  public resizeState: ResizeState | undefined;
  videosSignal = computed(() => this.videosService.videosSignal());
  displayedColumns: string[] = ['id', 'title', 'link'];

  constructor(
    private videosService: VideosService,
  ) { }

  ngOnInit(): void { }

  onRowSelectMyVideos(video: UserVideo) {
    const data = { src: video.link, id: video.id };
    this.onSelectVideo.emit(data);
  }

}
