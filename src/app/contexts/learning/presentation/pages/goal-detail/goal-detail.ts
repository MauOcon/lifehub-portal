import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GetGoalDetailUseCase } from '../../../application/use-cases/get-goal-detail.usecase';
import { GetLearningPathUseCase } from '../../../application/use-cases/get-learning-path.usecase';
import { SaveLearningPathUseCase } from '../../../application/use-cases/save-learning-path.usecase';
import { GetTopicRelationsUseCase } from '../../../application/use-cases/get-topic-relations.usecase';
import { SaveTopicRelationsUseCase } from '../../../application/use-cases/save-topic-relations.usecase';
import { GoalDetail as GoalDetailModel } from '../../../domain/models/goal-detail.model';
import { LearningPathItem } from '../../../domain/models/learning-path-item.model';
import { TopicResourceRelation } from '../../../domain/models/topic-resource-relation.model';
import { LearningPathEditorComponent } from '../../components/learning-path-editor/learning-path-editor.component';
import { TopicRelationEditorComponent } from '../../components/topic-relation-editor/topic-relation-editor.component';

type LoadingState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-goal-detail',
  imports: [CommonModule, LearningPathEditorComponent, TopicRelationEditorComponent],
  templateUrl: './goal-detail.html',
  styleUrl: './goal-detail.scss',
})
export class GoalDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly getGoalDetailUseCase = inject(GetGoalDetailUseCase);
  private readonly getLearningPathUseCase = inject(GetLearningPathUseCase);
  private readonly saveLearningPathUseCase = inject(SaveLearningPathUseCase);
  private readonly getTopicRelationsUseCase = inject(GetTopicRelationsUseCase);
  private readonly saveTopicRelationsUseCase = inject(SaveTopicRelationsUseCase);

  goal: GoalDetailModel | null = null;
  goalId = 0;
  state: LoadingState = 'loading';
  errorMessage = '';

  learningPath: LearningPathItem[] = [];
  learningPathLoading = false;

  // Modal de relaciones
  relationModalVisible = false;
  selectedTopic: LearningPathItem | null = null;
  topicRelations: TopicResourceRelation[] = [];

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
      error: (err) => console.error('Error saving learning path:', err),
    });
  }

  handleTopicRelationEdit(item: LearningPathItem): void {
    this.selectedTopic = item;
    this.getTopicRelationsUseCase.execute(item.topicId).subscribe({
      next: (relations) => {
        this.topicRelations = relations;
        this.relationModalVisible = true;
      },
      error: () => {
        this.topicRelations = [];
        this.relationModalVisible = true;
      },
    });
  }

  handleRelationSave(relations: TopicResourceRelation[]): void {
    if (!this.selectedTopic) return;

    this.saveTopicRelationsUseCase.execute(this.selectedTopic.topicId, relations).subscribe({
      next: () => {
        // Actualizar cobertura del tema en la ruta
        const topic = this.learningPath.find((t) => t.topicId === this.selectedTopic!.topicId);
        if (topic) {
          topic.coveragePercentage = relations.reduce((sum, r) => sum + r.coveragePercentage, 0);
        }
        this.relationModalVisible = false;
      },
      error: (err) => console.error('Error saving relations:', err),
    });
  }

  handleRelationClose(): void {
    this.relationModalVisible = false;
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
