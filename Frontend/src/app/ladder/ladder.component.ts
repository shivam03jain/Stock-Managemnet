import { DecimalPipe, NgClass } from '@angular/common';
import { Component , Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-ladder',
  standalone: true,
  imports: [NgClass, DecimalPipe,MatTableModule],
  templateUrl: './ladder.component.html',
  styleUrl: './ladder.component.scss'
})
export class LadderComponent {
  @Input() dataSource : any = []
  @Input() price! : number;

  displayedColumns: string[] = ['bidQuantity', 'price', 'askQuantity'];

  constructor(){
    
  }

  ngOnInit(): void {
    this.setLadderData()
  }

  setLadderData() : void {
    // console.log(this.dataSource)
  }
}
