import { TestBed, inject } from '@angular/core/testing';

import { GoogleSignInService } from './google-sign-in.service';

describe('GoogleSignInService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleSignInService]
    });
  });

  it('should be created', inject([GoogleSignInService], (service: GoogleSignInService) => {
    expect(service).toBeTruthy();
  }));
});
