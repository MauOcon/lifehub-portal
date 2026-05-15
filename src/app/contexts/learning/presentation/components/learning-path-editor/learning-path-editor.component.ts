import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningPathItem } from '../../../domain/models/learning-path-item.model';

@Component({
  selector: 'app-learning-path-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './learning-path-editor.component.html',
  styleUrl: './learning-path-editor.component.scss',
})
export class LearningPathEditorComponent {
  @Input() items: LearningPathItem[] = [];
  @Input() goalId = 0;
  @Input() hasError = false;
  @Output() onSave = new EventEmitter<LearningPathItem[]>();
  @Output() onReload = new EventEmitter<void>();
  @Output() onTopicRelationEdit = new EventEmitter<LearningPathItem>();

  editing = false;
  editableItems: LearningPathItem[] = [];
  private nextTopicId = 100;
  private existingTopicIds = new Set<number>();

  get sortedItems(): LearningPathItem[] {
    return this.buildHierarchy(this.editing ? this.editableItems : this.items);
  }

  reload(): void {
    this.onReload.emit();
  }

  startEdit(): void {
    this.editableItems = this.items.map((i) => ({ ...i }));
    this.existingTopicIds = new Set(this.items.map((i) => i.topicId));
    this.nextTopicId = Math.max(...this.items.map((i) => i.topicId), 0) + 1;
    this.editing = true;
  }

  cancelEdit(): void {
    this.editing = false;
    this.editableItems = [];
  }

  save(): void {
    const itemsToSave = this.editableItems.map((item) => ({
      ...item,
      topicId: this.existingTopicIds.has(item.topicId) ? item.topicId : 0,
    }));
    this.onSave.emit(itemsToSave);
    this.editing = false;
  }

  addRootTopic(): void {
    const rootCount = this.editableItems.filter((i) => i.fatherId === 0).length;
    this.editableItems.push({
      topicId: this.nextTopicId++,
      hierarchicalSymbol: '',
      name: '',
      fatherId: 0,
      order: rootCount + 1,
      coveragePercentage: 0,
    });
  }

  addChildTopic(parent: LearningPathItem): void {
    const childCount = this.editableItems.filter((i) => i.fatherId === parent.topicId).length;
    this.editableItems.push({
      topicId: this.nextTopicId++,
      hierarchicalSymbol: '',
      name: '',
      fatherId: parent.topicId,
      order: childCount + 1,
      coveragePercentage: 0,
    });
  }

  removeTopic(item: LearningPathItem): void {
    const children = this.editableItems.filter((i) => i.fatherId === item.topicId);
    if (children.length > 0 && !confirm(`Este tema tiene ${children.length} hijo(s). ¿Eliminar todo?`)) {
      return;
    }
    this.removeRecursive(item.topicId);
  }

  moveUp(item: LearningPathItem): void {
    const siblings = this.editableItems.filter((i) => i.fatherId === item.fatherId).sort((a, b) => a.order - b.order);
    const idx = siblings.findIndex((s) => s.topicId === item.topicId);
    if (idx > 0) {
      const prev = siblings[idx - 1];
      [item.order, prev.order] = [prev.order, item.order];
    }
  }

  moveDown(item: LearningPathItem): void {
    const siblings = this.editableItems.filter((i) => i.fatherId === item.fatherId).sort((a, b) => a.order - b.order);
    const idx = siblings.findIndex((s) => s.topicId === item.topicId);
    if (idx < siblings.length - 1) {
      const next = siblings[idx + 1];
      [item.order, next.order] = [next.order, item.order];
    }
  }

  openRelation(item: LearningPathItem): void {
    this.onTopicRelationEdit.emit(item);
  }

  getDepth(item: LearningPathItem): number {
    const source = this.editing ? this.editableItems : this.items;
    let depth = 0;
    let current = item;
    while (current.fatherId !== 0) {
      const parent = source.find((i) => i.topicId === current.fatherId);
      if (!parent) break;
      depth++;
      current = parent;
    }
    return depth;
  }

  getCoverageClass(percentage: number): string {
    if (percentage === 100) return 'coverage-full';
    if (percentage > 0 && percentage < 100) return 'coverage-partial';
    return 'coverage-none';
  }

  getCoverageIcon(percentage: number): string {
    if (percentage === 100) return '🟢';
    if (percentage > 0 && percentage < 100) return '🟡';
    return '🔴';
  }

  hasChildren(item: LearningPathItem): boolean {
    const source = this.editing ? this.editableItems : this.items;
    return source.some((i) => i.fatherId === item.topicId);
  }

  private removeRecursive(topicId: number): void {
    const children = this.editableItems.filter((i) => i.fatherId === topicId);
    children.forEach((c) => this.removeRecursive(c.topicId));
    const idx = this.editableItems.findIndex((i) => i.topicId === topicId);
    if (idx !== -1) this.editableItems.splice(idx, 1);
  }

  private buildHierarchy(items: LearningPathItem[]): LearningPathItem[] {
    const result: LearningPathItem[] = [];
    const roots = items.filter((i) => i.fatherId === 0).sort((a, b) => a.order - b.order);
    for (const root of roots) {
      result.push(root);
      this.addChildren(root, items, result);
    }
    return result;
  }

  private addChildren(parent: LearningPathItem, items: LearningPathItem[], result: LearningPathItem[], visited = new Set<number>()): void {
    const children = items.filter((i) => i.fatherId === parent.topicId && i.topicId !== parent.topicId).sort((a, b) => a.order - b.order);
    for (const child of children) {
      if (visited.has(child.topicId)) continue;
      visited.add(child.topicId);
      result.push(child);
      this.addChildren(child, items, result, visited);
    }
  }
}
