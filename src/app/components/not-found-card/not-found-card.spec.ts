import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundCard } from './not-found-card';

describe('NotFoundCard', () => {
  let component: NotFoundCard;
  let fixture: ComponentFixture<NotFoundCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundCard],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
