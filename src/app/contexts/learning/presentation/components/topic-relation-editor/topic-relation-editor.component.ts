import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningPathItem } from '../../../domain/models/learning-path-item.model';
import { TopicResourceRelation } from '../../../domain/models/topic-resource-relation.model';
import { Resource } from '../../../domain/models/resource.model';
import { SyllabusItem } from '../../../domain/models/syllabus-item.model';
import { GetResourcesUseCase } from '../../../application/use-cases/get-resources.usecase';
import { GetResourceSyllabusUseCase } from '../../../application/use-cases/get-resource-syllabus.usecase';

@Component({
  selector: 'app-topic-relation-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topic-relation-editor.component.html',
  styleUrl: './topic-relation-editor.component.scss',
})
export class TopicRelationEditorComponent implements OnChanges {
  @Input() visible = false;
  @Input() goalName = '';
  @Input() topic: LearningPathItem | null = null;
  @Input() currentRelations: TopicResourceRelation[] = [];
  @Output() onSave = new EventEmitter<TopicResourceRelation[]>();
  @Output() onClose = new EventEmitter<void>();

  private readonly getResourcesUseCase = inject(GetResourcesUseCase);
  private readonly getSyllabusUseCase = inject(GetResourceSyllabusUseCase);

  editableRelations: TopicResourceRelation[] = [];
  resources: Resource[] = [];
  selectedResource: Resource | null = null;
  syllabusItems: SyllabusItem[] = [];
  resourcesLoading = false;
  syllabusLoading = false;
  private nextRelationId = 100;

  get totalCoverage(): number {
    return this.editableRelations.reduce((sum, r) => sum + r.coveragePercentage, 0);
  }

  get coverageClass(): string {
    if (this.totalCoverage === 100) return 'coverage-full';
    if (this.totalCoverage > 0 && this.totalCoverage < 100) return 'coverage-partial';
    if (this.totalCoverage > 100) return 'coverage-over';
    return 'coverage-none';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.editableRelations = this.currentRelations.map((r) => ({ ...r }));
      this.nextRelationId = Math.max(...this.currentRelations.map((r) => r.relationId), 0) + 1;
      this.selectedResource = null;
      this.syllabusItems = [];
      this.loadResources();
    }
  }

  close(): void {
    this.onClose.emit();
  }

  save(): void {
    this.onSave.emit(this.editableRelations);
  }

  removeRelation(index: number): void {
    this.editableRelations.splice(index, 1);
  }

  selectResource(resource: Resource): void {
    this.selectedResource = resource;
    this.loadSyllabus(resource.name);
  }

  isAlreadyRelated(syllabusItem: SyllabusItem): boolean {
    return this.editableRelations.some((r) => r.resourceTopicId === syllabusItem.topicId);
  }

  addRelation(syllabusItem: SyllabusItem): void {
    if (!this.topic || !this.selectedResource || this.isAlreadyRelated(syllabusItem)) return;

    this.editableRelations.push({
      relationId: this.nextRelationId++,
      learningPathTopicId: this.topic.topicId,
      resourceTopicId: syllabusItem.topicId,
      resourceTopicName: syllabusItem.number + ' ' + syllabusItem.name,
      resourceName: this.selectedResource.name,
      coveragePercentage: 0,
    });
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }

  private loadResources(): void {
    if (this.resources.length > 0) return;
    this.resourcesLoading = true;
    this.getResourcesUseCase.execute().subscribe({
      next: (resources) => {
        this.resources = resources;
        this.resourcesLoading = false;
      },
      error: () => {
        this.resourcesLoading = false;
      },
    });
  }

  private loadSyllabus(resourceName: string): void {
    this.syllabusLoading = true;
    this.syllabusItems = [];
    this.getSyllabusUseCase.execute(resourceName).subscribe({
      next: (items) => {
        this.syllabusItems = items;
        this.syllabusLoading = false;
      },
      error: () => {
        this.syllabusLoading = false;
      },
    });
  }
}
