import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
// import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path : 'dashboard' , component : DashboardComponent },
    { path : 'register' , component : RegisterComponent},
    { path : 'login' , component : LoginComponent},
    { path : 'watchlist' , component : WatchlistComponent},
    { path : '' ,redirectTo:'dashboard', pathMatch: 'full'},
];
