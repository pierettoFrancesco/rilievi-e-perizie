import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab3PageRoutingModule } from './tab3-routing.module';

import { Tab3Page } from './tab3.page';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab3PageRoutingModule,
    MatIconModule
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
