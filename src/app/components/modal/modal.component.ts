import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [
    CommonModule
  ],
  styleUrls: []
})
export class ModalComponent implements OnInit {

  @Input() showModal = false; // Control de modal

  constructor() { }

  ngOnInit() {
  }

}
