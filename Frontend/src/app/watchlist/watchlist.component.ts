import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { NgFor } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthDataService } from '../auth-data.service';
import { MarketDataService } from '../market-data.service';
import { WatchlistDataService } from '../watchlist-data.service';
import { TableComponent } from '../table/table.component';
import { LadderComponent } from '../ladder/ladder.component';
import { RouterLink } from '@angular/router';
import { WatchlistCardComponent } from '../watchlist-card/watchlist-card.component';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';


export interface Symbol {
  name: string;
}

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [MatChipsModule,MatFormFieldModule,MatIconModule,
     NgFor , ReactiveFormsModule , MatButtonModule, TableComponent,
     LadderComponent , MatButtonModule,RouterLink , WatchlistCardComponent , MatInputModule],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss'
})
export class WatchlistComponent implements OnInit , OnDestroy{
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  symbols: Symbol[] = [];

  watchlistData!: any;
  subscription!: Subscription;

  watchlistForm = this.fb.group({
    symbol: ["",Validators.required]
  })
  
  constructor(private fb  : FormBuilder,
    private authData : AuthDataService,
    private marketData : MarketDataService){
    }

  ngOnInit(): void {
    this.marketData.connect("ws://127.0.0.1:3001/ws");
    this.authData.getWatchlist().subscribe((result) => {
      this.marketData.sendMessage({symbols:result.watchlist})
      console.log(result)
      this.setUpdatedData()
    })
  }

  setUpdatedData(){
    this.subscription =  this.marketData.sendData.subscribe((msg) => {
      this.watchlistData = msg.data
      console.log(msg);
    });
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    this.marketData.closeConnection()
  }

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.symbols.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(symbol: Symbol): void {
    const index = this.symbols.indexOf(symbol);

    if (index >= 0) {
      this.symbols.splice(index, 1);

      this.announcer.announce(`Removed ${symbol}`);
    }
  }

  edit(symbol: Symbol, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(symbol);
      return;
    }

    // Edit existing fruit
    const index = this.symbols.indexOf(symbol);
    if (index >= 0) {
      this.symbols[index].name = value;
    }
  }

  onSubmit() {
    // let watchlist : Watchlist {
    //   email : this.localService.getEmail(),
    //   watchlist : this.watchlistData.value.symbols,
    // }

    this.authData.addSymbol(this.watchlistForm).subscribe((result) => {
      console.log(result);
      this.authData.getWatchlist().subscribe((result) => {
        this.marketData.sendMessage({symbols:result.watchlist})
        this.setUpdatedData()
      })
    })
  }
}
