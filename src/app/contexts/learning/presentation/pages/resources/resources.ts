import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../../../domain/models/resource.model';
import { GetResourcesUseCase } from '../../../application/use-cases/get-resources.usecase';

type LoadingState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-resources',
  imports: [CommonModule],
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
})
export class Resources implements OnInit {
  private readonly getResourceUseCase = inject(GetResourcesUseCase);

  resources: Resource[] = [];
  selectedResource: Resource | null = null;
  state: LoadingState = 'loading';
  errorMessage = '';

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
  }

  retry(): void {
    this.loadResources();
  }

  private getMockResources(): Resource[] {
    return [
      {
        position: 1,
        name: 'Effective Java',
        location: 'Biblioteca personal',
        progress: 45,
        activityDate: new Date('2024-01-15'),
        // syllabus: [
        //   {
        //     number: '1',
        //     name: 'Chapter 1: An introduction to Java',
        //     progress: '100%',
        //     activityDate: new Date('2024-01-10'),
        //   },
        //   {
        //     number: '1.1',
        //     name: 'Basic concepts',
        //     progress: '100%',
        //     activityDate: new Date('2024-01-11'),
        //   },
        //   {
        //     number: '1.2',
        //     name: 'Advanced topics',
        //     progress: '50%',
        //     activityDate: new Date('2024-01-15'),
        //   },
        //   { number: '2', name: 'Chapter 2: Design Patterns', progress: '0%', activityDate: null },
        // ],
      },
      {
        position: 2,
        name: 'Clean Code',
        location: 'Kindle',
        progress: 0,
        activityDate: new Date('2024-01-01'),
      },
    ];
  }

  private getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
    }
    return error.error?.message || 'Ocurrió un error al cargar los recursos.';
  }
}
