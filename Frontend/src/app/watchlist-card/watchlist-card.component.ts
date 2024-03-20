import { Component , Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AuthDataService } from '../auth-data.service';
import { WatchlistDataService } from '../watchlist-data.service';
import { MarketDataService } from '../market-data.service';

@Component({
  selector: 'app-watchlist-card',
  standalone: true,
  imports: [MatIcon, MatButtonModule],
  templateUrl: './watchlist-card.component.html',
  styleUrl: './watchlist-card.component.scss'
})
export class WatchlistCardComponent {

  @Input() name!: string;
  @Input() price!: number;
  constructor( private authData : AuthDataService,
    private marketData : MarketDataService) {

  }

  onDelete() {
    this.authData.deleteSymbol(this.name).subscribe((result)=> {
      console.log(result)
      this.authData.getWatchlist().subscribe((result) => {
        this.marketData.sendMessage({symbols:result.watchlist})
      })
    })
  }
}
