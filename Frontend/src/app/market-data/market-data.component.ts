import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { LadderComponent } from '../ladder/ladder.component';
import { MarketDataService } from '../market-data.service';
import { NgFor } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-market-data',
  standalone: true,
  imports: [TableComponent,LadderComponent, NgFor],
  templateUrl: './market-data.component.html',
  styleUrl: './market-data.component.scss'
})
export class MarketDataComponent implements OnInit , OnDestroy{
  stocksData!: any
  subscription! : Subscription;

  constructor(private marketData : MarketDataService){
  }

  ngOnInit(): void {
    this.subscription = this.marketData.sendData.subscribe((msg) => {
      this.stocksData = msg.data
    });
  }

  onClick() {
    console.log(this.stocksData)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
