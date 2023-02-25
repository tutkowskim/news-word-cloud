import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordMapComponent } from './word-map.component';

describe('WordMapComponent', () => {
  let component: WordMapComponent;
  let fixture: ComponentFixture<WordMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
