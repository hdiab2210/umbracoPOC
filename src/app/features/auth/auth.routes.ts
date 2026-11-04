import { Routes } from '@angular/router';
import { Login } from './pages/login/login.component';
import { Signup } from './pages/signup/signup.component';


export const AUTH_ROUTES: Routes = [
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
];