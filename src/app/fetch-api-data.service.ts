import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://my-flix-movie-app.herokuapp.com/';

const token = localStorage.getItem('token');
// Get username from localStorage for URLs
const username = localStorage.getItem('username');

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
 
  constructor(private http: HttpClient) {
  }
 // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
    catchError(this.handleError)
    );
  }

  // API call to user login endpoint
  public userLogin(userCredentials: any): Observable<any> {
    console.log(userCredentials);
    return this.http
      .post(apiUrl + 'login', userCredentials)
      .pipe(catchError(this.handleError));
  }

  //API call to get all movies endpoint
  getAllMovies(): Observable<any> {
    
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //  API call to get one movie endpoint
  getSingleMovie(title: any): Observable<any> {
   
    return this.http
      .get(apiUrl + `movies/${title}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // API call to get data on one director
  getDirector(name: any): Observable<any> {
   
    return this.http
      .get(apiUrl + `movies/director/${name}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // API call to genre endpoint
getGenre(): Observable<any> {
  
  return this.http
    .get( apiUrl + 'genre', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    })
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
}

// API call to user data endpoint
  // API call to get favortie movies of a user endpoint
  getUser(): Observable<any> {
 
    return this.http
      .get(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // API call to add a favorite movie to user endpoint
  addFavoriteMovie( movieId: any): Observable<any> {
  
    return this.http
      .post(apiUrl + `users/${username}/favorites/${movieId}`,{},   {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // API call to delete a movie from the users favorites list
  removeFavoriteMovie(movieID: any): Observable<any> {
  
    return this.http
      .delete(apiUrl + `users/${username}/movies/${movieID}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // API call to edit user information endpoint
editUser(updateDetails: any): Observable<any> {
   
  return this.http
    .put(apiUrl + `users/${username}`, updateDetails, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    })
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
}

// API call to delete user endpoint
deleteUser(): Observable<any> {
    
  return this.http
    .delete(apiUrl + `users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
    .pipe(map(this.extractResponseData), catchError(this.handleError));
}

private extractResponseData(res: any): any {
  const body = res;
  return body || {};
}


private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}