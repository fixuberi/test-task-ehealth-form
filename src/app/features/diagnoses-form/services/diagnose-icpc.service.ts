import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

import { DiagnoseICPC } from '../models/diagnose-icpc.model';

@Injectable()
export class DiagnoseICPCService {
  private apiUrl = 'http://localhost:4200/api';

  constructor(private http: HttpClient) {}

  getDiagnosesICPC2(query: string): Observable<DiagnoseICPC[]> {
    const options = {
      params: {
        IsPublic: true,
        Search: query,
      },
    };

    return this.http.get<DiagnoseICPC[]>(`${this.apiUrl}/Dictionaries/icpc2`, options).pipe(
      catchError(() => of([])),
    );
  }
}
