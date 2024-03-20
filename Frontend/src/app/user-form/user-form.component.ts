import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MarketDataService } from '../market-data.service';
import { Subscription } from 'rxjs';

export interface Symbol {
  name: string;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule,MatIconModule,MatFormFieldModule, MatChipsModule,
     MatInputModule,MatButtonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent{
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  private socketSubscription!: Subscription;
  symbols : Symbol[] = [];

  marketData = this.formBuilder.group({
    symbols :  [],
  })

  constructor(private formBuilder : FormBuilder,
    private marketDataservice : MarketDataService,) {
      
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

  onSubmit() : void {
    this.sendMessage();  
  }

  sendMessage(): void {
    this.marketDataservice.sendMessage(this.marketData.value);
  }
}
