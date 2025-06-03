import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationViewComponent } from './conversation-view.component';

describe('ConversationViewComponent', () => {
  let component: ConversationViewComponent;
  let fixture: ComponentFixture<ConversationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConversationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
