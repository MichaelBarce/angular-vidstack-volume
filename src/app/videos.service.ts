import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { UserVideo } from '../app/user-video';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  private currentVideo: UserVideo | null = null;

  videos: UserVideo[] = [];

  public bs_videos$ = new BehaviorSubject<UserVideo[]>(this.videos);
  public share_videos$ = this.bs_videos$.asObservable();
  public bs_currentVideo$ = new BehaviorSubject<UserVideo | null>(this.currentVideo);
  public share_currentVideo = this.bs_currentVideo$.asObservable();

  constructor(private http: HttpClient) {
    console.log("VideosService constructor");
    this.fetchVideos();
  }


  fetchVideos() {
    console.log('fetchVideos');
    this.http.get<UserVideo[]>('assets/videos.json')
      .subscribe(data => {
        this.videos = data;
        this.bs_videos$.next(this.videos);
      });
  }

  setCurrentVideo(video: any) {
    console.log(video);
    this.bs_currentVideo$.next(video);
    this.currentVideo = video;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
