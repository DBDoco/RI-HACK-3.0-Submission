import { Routes } from '@angular/router';
import { LoginComponent } from './pages/authentication/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/authentication/register/register.component';
import { authenticationGuard } from './guards/authentication.guard';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authenticationGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile/:id', component: ProfileComponent },
];
