import { Observable } from 'rxjs';
import { Resource } from '../models/resource.model';
import { SyllabusItem } from '../models/syllabus-item.model';
import { CreateSyllabusRequest } from '../models/syllabus-topic.model';

export abstract class ResourceRepository {
  abstract getAll(): Observable<Resource[]>;
  abstract getSyllabus(resourceName: string): Observable<SyllabusItem[]>;
  abstract createSyllabus(request: CreateSyllabusRequest): Observable<void>;
}
