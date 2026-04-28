import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Resource } from '../../../domain/models/resource.model';
import { GetResourcesUseCase } from '../../../application/use-cases/get-resources.usecase';
import { GetResourceSyllabusUseCase } from '../../../application/use-cases/get-resource-syllabus.usecase';
import { CreateResourceSyllabusUseCase } from '../../../application/use-cases/create-resource-syllabus.usecase';
import { UpdateResourceSyllabusUseCase } from '../../../application/use-cases/update-resource-syllabus.usecase';
import { CreateSyllabusRequest, SyllabusTopic, UpdateSyllabusTopicRequest } from '../../../domain/models/syllabus-topic.model';
import { SyllabusItem } from '../../../domain/models/syllabus-item.model';
import { EditableTopic, SyllabusEditorComponent } from '../../components/syllabus-editor/syllabus-editor.component';

type LoadingState = 'loading' | 'success' | 'error';
type SyllabusMode = 'view' | 'edit' | 'create';

@Component({
  selector: 'app-resources',
  imports: [CommonModule, FormsModule, SyllabusEditorComponent],
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
})
export class Resources implements OnInit {
  private readonly getResourceUseCase = inject(GetResourcesUseCase);
  private readonly getSyllabusUseCase = inject(GetResourceSyllabusUseCase);
  private readonly createSyllabusUseCase = inject(CreateResourceSyllabusUseCase);
  private readonly updateSyllabusUseCase = inject(UpdateResourceSyllabusUseCase);

  resources: Resource[] = [];
  selectedResource: Resource | null = null;
  state: LoadingState = 'loading';
  errorMessage = '';
  syllabusLoading = false;
  syllabusError = '';
  syllabusMode: SyllabusMode = 'view';

  ngOnInit(): void {
    this.loadResources();
  }

  private loadResources(): void {
    this.state = 'loading';

    this.getResourceUseCase.execute().subscribe({
      next: (resources) => {
        this.resources = resources;
        console.log('Resources loaded:', resources);
        this.state = 'success';
      },
      error: (error) => {
        console.error('Error loading resources:', error);
        this.state = 'error';
        this.errorMessage = this.getErrorMessage(error);
      },
    });
  }

  selectResource(resource: Resource): void {
    this.selectedResource = resource;

    if (!resource.syllabus) {
      this.loadSyllabus(resource.name);
    }
  }

  private loadSyllabus(resourceName: string): void {
    this.syllabusLoading = true;
    this.syllabusError = '';

    this.getSyllabusUseCase.execute(resourceName).subscribe({
      next: (syllabus) => {
        if (this.selectedResource) {
          this.selectedResource.syllabus = syllabus;
        }
        this.syllabusLoading = false;
      },
      error: (error) => {
        console.error('Error loading syllabus:', error);
        this.syllabusError = 'Error al cargar el temario';
        this.syllabusLoading = false;
      },
    });
  }

  retry(): void {
    this.loadResources();
  }

  addSyllabus(): void {
    if (!this.selectedResource) return;
    this.syllabusMode = 'create';
  }

  editSyllabus(): void {
    this.syllabusMode = 'edit';
  }

  cancelSyllabusEdit(): void {
    this.syllabusMode = 'view';
  }

  handleSyllabusSave(topics: EditableTopic[]): void {
    if (this.syllabusMode === 'create') {
      this.handleSyllabusCreate(topics);
    } else if (this.syllabusMode === 'edit') {
      this.handleSyllabusUpdate(topics);
    }
  }

  private handleSyllabusCreate(topics: EditableTopic[]): void {
    if (!this.selectedResource || topics.length === 0) return;

    const validTopics = topics.filter((t) => t.name.trim() !== '').map(t => ({
      ...t,
      fatherId: typeof t.fatherId === 'string' ? parseInt(t.fatherId, 10) : t.fatherId
    }));
    
    if (validTopics.length === 0) return;

    const topicsMap = new Map<number, SyllabusTopic>();

    validTopics.forEach((topic) => {
      topicsMap.set(topic.topicId, {
        topicId: topic.topicId,
        order: topic.order,
        name: topic.name,
        hierarchicalSymbol: topic.hierarchicalSymbol,
        fatherId: topic.fatherId,
        subTopics: [],
      });
    });

    validTopics.forEach((topic) => {
      if (topic.fatherId !== 0) {
        const parent = topicsMap.get(topic.fatherId);
        const child = topicsMap.get(topic.topicId);
        if (parent && child) {
          if (!parent.subTopics) parent.subTopics = [];
          parent.subTopics.push(child);
        }
      }
    });

    const rootTopics = Array.from(topicsMap.values()).filter((t) => t.fatherId === 0);
    if (rootTopics.length === 0) return;

    const mainRoot: SyllabusTopic = {
      topicId: 0,
      order: 0,
      name: this.selectedResource.name,
      hierarchicalSymbol: '',
      fatherId: 0,
      subTopics: rootTopics,
    };

    const request: CreateSyllabusRequest = {
      resourceName: this.selectedResource.name,
      syllabus: mainRoot,
    };

    this.syllabusLoading = true;
    this.syllabusError = '';

    this.createSyllabusUseCase.execute(request).subscribe({
      next: () => {
        console.log('Syllabus created successfully');
        this.syllabusMode = 'view';
        this.loadSyllabus(this.selectedResource!.name);
      },
      error: (error) => {
        console.error('Error creating syllabus:', error);
        this.syllabusError = 'Error al crear el temario';
        this.syllabusLoading = false;
      },
    });
  }

  private handleSyllabusUpdate(topics: EditableTopic[]): void {
    if (!this.selectedResource) return;

    const updateRequests: UpdateSyllabusTopicRequest[] = topics.map(t => ({
      topicId: t.topicId,
      topicName: t.name,
      hierarchicalNumber: t.hierarchicalSymbol,
      fatherShareValue: t.fatherShareValue,
      progressValue: t.completion,
      isAutoCalculated: false,
    }));

    this.syllabusLoading = true;
    this.syllabusError = '';

    this.updateSyllabusUseCase.execute(this.selectedResource.resourceId, updateRequests).subscribe({
      next: (response) => {
        this.applyPartialUpdate(response);
        this.syllabusMode = 'view';
        this.syllabusLoading = false;
      },
      error: (error) => {
        console.error('Error updating syllabus:', error);
        this.syllabusError = 'Error al actualizar el temario';
        this.syllabusLoading = false;
      },
    });
  }

  private applyPartialUpdate(response: UpdateSyllabusTopicRequest[]): void {
    if (!this.selectedResource?.syllabus) return;

    const updateMap = new Map(response.map(r => [r.topicId, r]));

    this.selectedResource.syllabus = this.selectedResource.syllabus.map(item => {
      const update = updateMap.get(item.topicId);
      if (!update) return item;

      return {
        ...item,
        ...(update.topicName != null && { name: update.topicName }),
        ...(update.hierarchicalNumber != null && { number: update.hierarchicalNumber }),
        ...(update.progressValue != null && { progress: update.progressValue }),
      };
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
    }
    return error.error?.message || 'Ocurrió un error al cargar los recursos.';
  }
}
