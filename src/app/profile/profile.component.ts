import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';


import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  username: any = localStorage.getItem('user');
  movies: any[] = [];
  FavoriteMovies: any[] = [];
  displayElement: boolean = false

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getFavoriteMovies();
  }

  /**
   * Gets user data from api call and sets the user variable to returned JSON file
   * @returns object holding user information
   * @function getUser
   */
  getUser(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      console.log(this.user);
      return this.user;
    });
  }

  /**
   * opens the edit profile dialog from EditProfileComponent to allow user to edit their details
   */
  openEditProfileDialog(): void {
    this.dialog.open(EditProfileComponent, {
      width: '300px',
    });
  }

  /**
   * opens the dialog to display the SynopsisCarsComponent
   * @param title {string}
   * @param imagePath {any}
   * @param description {string}
   */
   openSynopsis(title: string, imagePath: any, description: string): void {
    this.dialog.open(SynopsisComponent, {
      data: {
        Title: title,
        ImagePath: imagePath,
        Description: description,
      },
      width: '500px',
      panelClass: 'synopsis-custom'
    });
  }

  
  /**
   * opens the dialog to display the DirectorCardComponent
   * @param title {string}
   * @param name {string}
   * @param bio {string}
   * @param birth {string}
   */
  openDirectorDialog(title: string, name: string, bio: string, birth: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Title: title,
        Name: name,
        Bio: bio,
        Birth: birth,
      },
      width: '500px',
      panelClass: 'director-custom'
    });
  }

  /**
   * opens the dialog to display the GenreCardComponent
   * @param title {string}
   * @param name {string}
   * @param description {string}
   */
  openGenreDialog(title: string, name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: {
        Title: title,
        Name: name,
        Description: description,
      },
      width: '500px',
      panelClass: 'genre-custom'
    });
    console.log('Name: ' + name)
  }


  /**
   * deletes the user profile, redirects to welcome screen
   * @function deleteProfile
   * @return status for user has been removed
   */
  deleteProfile(): void {
    if (
      confirm(
        'Are you sure you want to delete your account? This cannnot be undone.'
      )
    ) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You have successfully deleted your account!',
          'OK',
          {
            duration: 2000,
          }
        );
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      });
    }
  }

  /**
   * gets a user's FavoriteMovies
   * @function getFavoriteMovies
   */
   getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.movies.forEach((movie: any) => {
        if (this.user.FavoriteMovies.includes(movie._id)) {
          this.FavoriteMovies.push(movie);
        }
      });
    });    
  }

  /**
   * deletes a user FavoriteMovie
   * @function deleteFavoriteMovies
   */
  deleteFavoriteMovies(MovieID: string, Title: string): void {
    this.fetchApiData.removeFavoriteMovie(MovieID).subscribe((res: any) => {
      this.snackBar.open(`Successfully removed ${Title} from favorite movies.`, 'OK', {
        duration: 4000, verticalPosition: 'top'
      });
      setTimeout(function () {
        window.location.reload();
      }, 4000);
    });
  }
}