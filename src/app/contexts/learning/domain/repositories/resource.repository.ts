import { Observable } from 'rxjs';
import { Resource } from '../models/resource.model';
import { SyllabusItem } from '../models/syllabus-item.model';

export abstract class ResourceRepository {
  abstract getAll(): Observable<Resource[]>;
  abstract getSyllabus(resourceName: string): Observable<SyllabusItem[]>;
}
