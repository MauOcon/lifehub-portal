import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Resource } from '../../domain/models/resource.model';
import { ResourceRepository } from '../../domain/repositories/resource.repository';

@Injectable({
  providedIn: 'root',
})
export class ResourceApiRepository extends ResourceRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/learn/resources';

  override getAll(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.apiUrl).pipe(
      tap({
        next: (data) => console.log('✓ Resources:', data),
        error: (err) => console.error('✗ Error:', err),
      }),
      tap((data) => console.log('Parsed count:', data.length)),
    );
  }
}
