import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Resource } from '../../domain/models/resource.model';
import { ResourceRepository } from '../../domain/repositories/resource.repository';
import { SyllabusItem } from '../../domain/models/syllabus-item.model';
import { CreateSyllabusRequest, UpdateSyllabusTopicRequest } from '../../domain/models/syllabus-topic.model';

interface SyllabusApiResponse {
  topicId: number;
  hierarchicalNumber: string;
  topicName: string;
  completion: number;
  lastActivityDate: string | null;
  fatherId: number;
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
            topicId: item.topicId,
            number: item.hierarchicalNumber,
            name: item.topicName,
            progress: item.completion,
            activityDate: item.lastActivityDate ? new Date(item.lastActivityDate) : null,
            fatherId: item.fatherId,
          })),
        ),
        tap({
          next: (data) => console.log('✓ Syllabus loaded:', data),
          error: (err) => console.error('✗ Error loading syllabus:', err),
        }),
      );
  }

  override createSyllabus(request: CreateSyllabusRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/syllabus`, request).pipe(
      tap({
        next: () => console.log('✓ Syllabus created'),
        error: (err) => console.error('✗ Error creating syllabus:', err),
      })
    );
  }

  override updateSyllabusTopics(resourceId: number, topics: UpdateSyllabusTopicRequest[]): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${resourceId}/syllabus/topics`, topics).pipe(
      tap({
        next: () => console.log('✓ Syllabus topics updated'),
        error: (err) => console.error('✗ Error updating syllabus topics:', err),
      })
    );
  }
}
