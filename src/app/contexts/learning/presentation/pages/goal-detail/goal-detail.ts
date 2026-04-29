import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GetGoalDetailUseCase } from '../../../application/use-cases/get-goal-detail.usecase';
import { GoalDetail as GoalDetailModel } from '../../../domain/models/goal-detail.model';

type LoadingState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-goal-detail',
  imports: [CommonModule],
  templateUrl: './goal-detail.html',
  styleUrl: './goal-detail.scss',
})
export class GoalDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly getGoalDetailUseCase = inject(GetGoalDetailUseCase);

  goal: GoalDetailModel | null = null;
  state: LoadingState = 'loading';
  errorMessage = '';

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadGoalDetail(+params['goalId']);
    });
  }

  goBack(): void {
    this.router.navigate(['/lifehub/learning/goals']);
  }

  retry(): void {
    this.route.params.subscribe((params) => {
      this.loadGoalDetail(+params['goalId']);
    });
  }

  private loadGoalDetail(goalId: number): void {
    this.state = 'loading';

    this.getGoalDetailUseCase.execute(goalId).subscribe({
      next: (goal) => {
        this.goal = goal;
        this.state = 'success';
      },
      error: (error) => {
        this.state = 'error';
        this.errorMessage = error.error?.message || 'Ocurrió un error al cargar la meta.';
      },
    });
  }
}
