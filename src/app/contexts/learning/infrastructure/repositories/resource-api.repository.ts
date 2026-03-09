import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Resource } from '../../domain/models/resource.model';
import { ResourceRepository } from '../../domain/repositories/resource.repository';
import { SyllabusItem } from '../../domain/models/syllabus-item.model';

interface SyllabusApiResponse {
  hierarchicalNumber: string;
  topicName: string;
  completion: number;
  lastActivityDate: string | null;
}

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

  override getSyllabus(resourceName: string): Observable<SyllabusItem[]> {
    return this.http
      .get<SyllabusApiResponse[]>(`${this.apiUrl}/syllabus`, {
        params: { resourceName },
      })
      .pipe(
        map((items) =>
          items.map((item) => ({
            number: item.hierarchicalNumber,
            name: item.topicName,
            progress: item.completion,
            activityDate: item.lastActivityDate ? new Date(item.lastActivityDate) : null,
          })),
        ),
        tap({
          next: (data) => console.log('✓ Syllabus loaded:', data),
          error: (err) => console.error('✗ Error loading syllabus:', err),
        }),
      );
  }
}
