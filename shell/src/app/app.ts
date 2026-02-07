import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../shared-lib/src/components/navbar/navbar.component';
import { ToastComponent } from '../../../shared-lib/src/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = 'shell';

  constructor() {
    console.log('[Shell AppComponent] Constructor called - ToastComponent should be imported');
  }

  ngOnInit() {
    console.log('[Shell AppComponent] ngOnInit - app.html should render <app-toast>');
  }
}


