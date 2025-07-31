import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationNewModalComponent } from './conversation-new-modal.component';

describe('ConversationNewModalComponent', () => {
  let component: ConversationNewModalComponent;
  let fixture: ComponentFixture<ConversationNewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationNewModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConversationNewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
