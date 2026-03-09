import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../../../domain/models/resource.model';
import { GetResourcesUseCase } from '../../../application/use-cases/get-resources.usecase';
import { GetResourceSyllabusUseCase } from '../../../application/use-cases/get-resource-syllabus.usecase';

type LoadingState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-resources',
  imports: [CommonModule],
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
})
export class Resources implements OnInit {
  private readonly getResourceUseCase = inject(GetResourcesUseCase);
  private readonly getSyllabusUseCase = inject(GetResourceSyllabusUseCase);

  resources: Resource[] = [];
  selectedResource: Resource | null = null;
  state: LoadingState = 'loading';
  errorMessage = '';
  syllabusLoading = false;
  syllabusError = '';

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

  private getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
    }
    return error.error?.message || 'Ocurrió un error al cargar los recursos.';
  }
}
