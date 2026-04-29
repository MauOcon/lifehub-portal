import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GetGoalDetailUseCase } from '../../../application/use-cases/get-goal-detail.usecase';
import { GetLearningPathUseCase } from '../../../application/use-cases/get-learning-path.usecase';
import { SaveLearningPathUseCase } from '../../../application/use-cases/save-learning-path.usecase';
import { GoalDetail as GoalDetailModel } from '../../../domain/models/goal-detail.model';
import { LearningPathItem } from '../../../domain/models/learning-path-item.model';
import { LearningPathEditorComponent } from '../../components/learning-path-editor/learning-path-editor.component';

type LoadingState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-goal-detail',
  imports: [CommonModule, LearningPathEditorComponent],
  templateUrl: './goal-detail.html',
  styleUrl: './goal-detail.scss',
})
export class GoalDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly getGoalDetailUseCase = inject(GetGoalDetailUseCase);
  private readonly getLearningPathUseCase = inject(GetLearningPathUseCase);
  private readonly saveLearningPathUseCase = inject(SaveLearningPathUseCase);

  goal: GoalDetailModel | null = null;
  goalId = 0;
  state: LoadingState = 'loading';
  errorMessage = '';

  learningPath: LearningPathItem[] = [];
  learningPathLoading = false;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.goalId = +params['goalId'];
      this.loadGoalDetail(this.goalId);
    });
  }

  goBack(): void {
    this.router.navigate(['/lifehub/learning/goals']);
  }

  retry(): void {
    this.loadGoalDetail(this.goalId);
  }

  handleLearningPathSave(items: LearningPathItem[]): void {
    this.saveLearningPathUseCase.execute(this.goalId, items).subscribe({
      next: () => {
        this.learningPath = items;
      },
      error: (err) => {
        console.error('Error saving learning path:', err);
      },
    });
  }

  handleTopicRelationEdit(item: LearningPathItem): void {
    console.log('Topic relation edit:', item);
    // Punto 4: abrir modal de relaciones
  }

  private loadGoalDetail(goalId: number): void {
    this.state = 'loading';

    this.getGoalDetailUseCase.execute(goalId).subscribe({
      next: (goal) => {
        this.goal = goal;
        this.state = 'success';
        this.loadLearningPath(goalId);
      },
      error: (error) => {
        this.state = 'error';
        this.errorMessage = error.error?.message || 'Ocurrió un error al cargar la meta.';
      },
    });
  }

  private loadLearningPath(goalId: number): void {
    this.learningPathLoading = true;

    this.getLearningPathUseCase.execute(goalId).subscribe({
      next: (items) => {
        this.learningPath = items;
        this.learningPathLoading = false;
      },
      error: () => {
        this.learningPathLoading = false;
      },
    });
  }
}
