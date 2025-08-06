import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { UserVideo } from '../app/user-video';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  private currentVideo: UserVideo | null = null;

  videos: UserVideo[] = [];
  videosSignal = signal<UserVideo[]>([]);
  currentVideoSignal = signal<UserVideo | null>(null);

  constructor(private http: HttpClient) {
    this.fetchVideos();
  }

  fetchVideos() {
    this.http.get<UserVideo[]>('assets/videos.json')
      .subscribe(data => {
        this.videos = data;
        this.currentVideoSignal.set(data[0]);
        this.videosSignal.set(data);
      });
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
