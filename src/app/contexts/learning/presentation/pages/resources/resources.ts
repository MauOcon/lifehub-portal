import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Resource } from '../../../domain/models/resource.model';
import { GetResourcesUseCase } from '../../../application/use-cases/get-resources.usecase';
import { GetResourceSyllabusUseCase } from '../../../application/use-cases/get-resource-syllabus.usecase';
import { CreateResourceSyllabusUseCase } from '../../../application/use-cases/create-resource-syllabus.usecase';
import { CreateSyllabusRequest, SyllabusTopic } from '../../../domain/models/syllabus-topic.model';

type LoadingState = 'loading' | 'success' | 'error';

interface EditableTopic {
  topicId: number;
  order: number;
  name: string;
  hierarchicalSymbol: string;
  fatherId: number;
  completion: number;
}

@Component({
  selector: 'app-resources',
  imports: [CommonModule, FormsModule],
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
})
export class Resources implements OnInit {
  private readonly getResourceUseCase = inject(GetResourcesUseCase);
  private readonly getSyllabusUseCase = inject(GetResourceSyllabusUseCase);
  private readonly createSyllabusUseCase = inject(CreateResourceSyllabusUseCase);

  resources: Resource[] = [];
  selectedResource: Resource | null = null;
  state: LoadingState = 'loading';
  errorMessage = '';
  syllabusLoading = false;
  syllabusError = '';
  isEditingMode = false;
  editableTopics: EditableTopic[] = [];
  nextTopicId = 1;

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
    
    this.isEditingMode = true;
    this.editableTopics = [];
    this.nextTopicId = 1;
  }

  addTopic(): void {
    this.editableTopics.push({
      topicId: this.nextTopicId++,
      order: this.editableTopics.length,
      name: '',
      hierarchicalSymbol: '',
      fatherId: 0,
      completion: 0
    });
  }

  removeTopic(index: number): void {
    this.editableTopics.splice(index, 1);
  }

  cancelEdit(): void {
    this.isEditingMode = false;
    this.editableTopics = [];
  }

  saveSyllabus(): void {
    if (!this.selectedResource || this.editableTopics.length === 0) return;

    const validTopics = this.editableTopics.filter(t => t.name.trim() !== '');
    if (validTopics.length === 0) return;

    const topicsMap = new Map<number, SyllabusTopic>();
    
    validTopics.forEach(topic => {
      topicsMap.set(topic.topicId, {
        topicId: topic.topicId,
        order: topic.order,
        name: topic.name,
        hierarchicalSymbol: topic.hierarchicalSymbol,
        fatherId: topic.fatherId,
        subTopics: []
      });
    });

    validTopics.forEach(topic => {
      if (topic.fatherId !== 0) {
        const parent = topicsMap.get(topic.fatherId);
        const child = topicsMap.get(topic.topicId);
        if (parent && child) {
          if (!parent.subTopics) parent.subTopics = [];
          parent.subTopics.push(child);
          topicsMap.delete(topic.topicId);
        }
      }
    });

    const rootTopics = Array.from(topicsMap.values()).filter(t => t.fatherId === 0);
    if (rootTopics.length === 0) return;

    const mainRoot: SyllabusTopic = {
      topicId: 0,
      order: 0,
      name: this.selectedResource.name,
      hierarchicalSymbol: '',
      fatherId: 0,
      subTopics: rootTopics
    };

    const request: CreateSyllabusRequest = {
      resourceName: this.selectedResource.name,
      syllabus: mainRoot
    };

    this.syllabusLoading = true;
    this.syllabusError = '';

    this.createSyllabusUseCase.execute(request).subscribe({
      next: () => {
        console.log('Syllabus created successfully');
        this.isEditingMode = false;
        this.editableTopics = [];
        this.loadSyllabus(this.selectedResource!.name);
      },
      error: (error) => {
        console.error('Error creating syllabus:', error);
        this.syllabusError = 'Error al crear el temario';
        this.syllabusLoading = false;
      }
    });
  }

  getAvailableParents(currentTopicId: number): EditableTopic[] {
    return this.editableTopics.filter(t => t.topicId !== currentTopicId);
  }

  getParentSymbol(fatherId: number): string {
    const parent = this.editableTopics.find(t => t.topicId === fatherId);
    return parent ? parent.hierarchicalSymbol : '';
  }

  private getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
    }
    return error.error?.message || 'Ocurrió un error al cargar los recursos.';
  }
}
