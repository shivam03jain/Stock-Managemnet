import { Component ,Input} from '@angular/core';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  displayedColumns : string[] = ['bidQuantity' , 'bid' , 'ask' , 'askQuantity'];
  @Input() dataSource! : any;
  // @Input() ticker : string = '';

  constructor() {
    
  }
}
