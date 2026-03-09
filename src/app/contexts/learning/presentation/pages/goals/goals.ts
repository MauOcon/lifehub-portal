import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetGoalsUseCase } from '../../../application/use-cases/get-goals.usecase';
import { Goal } from '../../../domain/models/goal.model';

type LoadingState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-goals',
  imports: [CommonModule],
  templateUrl: './goals.html',
  styleUrl: './goals.scss',
})
export class Goals implements OnInit {
  private readonly getGoalsUseCase = inject(GetGoalsUseCase);

  goals: Goal[] = [];
  state: LoadingState = 'loading';
  errorMessage = '';

  ngOnInit(): void {
    this.loadGoals();
  }

  private loadGoals(): void {
    this.state = 'loading';

    this.getGoalsUseCase.execute().subscribe({
      next: (goals) => {
        this.goals = goals;
        this.state = 'success';
      },
      error: (error) => {
        this.state = 'error';
        this.errorMessage = this.getErrorMessage(error);
      },
    });
  }

  retry(): void {
    this.loadGoals();
  }

  private getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
    }
    return error.error?.message || 'Ocurrió un error al cargar las metas.';
  }
}
