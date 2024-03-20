import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LocalService } from '../local.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { MarketDataComponent } from '../market-data/market-data.component';
import { MarketDataService } from '../market-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterOutlet , MatButtonModule, MarketDataComponent , RouterOutlet,NgIf, UserFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy  {
  // Authenticated : boolean = false ;

  constructor(public localService : LocalService , private router : Router,
    private marketData : MarketDataService){
    
  }

  ngOnInit(): void {
    this.marketData.connect("ws://127.0.0.1:3001/ws");
  }

  logOut() : void {
    this.localService.removeToken()
    this.localService.removeEmail()
    this.router.navigate([""]);
  }

  checkUser() : void {
    if(this.localService.isAuthenticated()){
      this.router.navigate(["/watchlist"]);
    }else {
      this.router.navigate(["/login"]);
    }
  }

  ngOnDestroy(): void {
    console.log("from component")
    this.marketData.closeConnection();
  }
}
