import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SensorService } from 'src/app/main-layout/services/sensor.service';

@Component({
  selector: 'app-display-popup',
  templateUrl: './display-popup.component.html',
  styleUrls: ['./display-popup.component.scss']
})
export class DisplayPopupComponent implements OnInit {
  @Input() display = false;
  @Input() sensorId;
  @Output() closePopup: EventEmitter<boolean> = new EventEmitter<boolean>();
  displayForm: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
    private sensorService: SensorService,
    private messageService: MessageService
  ) {
    this.displayForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(50)]],
    });
   }

  ngOnInit(): void {
  }

  onSubmit() {
    this.sensorService.sendMsgToDisplay( this.sensorId, {input_data: this.displayForm.get('text')?.value?.trim() }).subscribe(res=>{
      if(res['code']===200) {
        this.messageService.add(  { severity: 'success', detail: 'Message sent', life: 2000, sticky: false })
      } else {
        this.messageService.add({ severity: 'error',  detail: 'Error occured' })
        
      }
    })
  }

  close() {
    this.display = false;
    this.closePopup.emit(this.display);
  }
}
