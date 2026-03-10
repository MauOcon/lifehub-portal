import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SyllabusItem } from '../../../domain/models/syllabus-item.model';

export interface EditableTopic {
  topicId: number;
  order: number;
  name: string;
  hierarchicalSymbol: string;
  fatherId: number;
  completion: number;
}

@Component({
  selector: 'app-syllabus-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './syllabus-editor.component.html',
  styleUrl: './syllabus-editor.component.scss'
})
export class SyllabusEditorComponent {
  @Input() mode: 'view' | 'edit' | 'create' = 'view';
  @Input() syllabus: SyllabusItem[] = [];
  @Input() showEditButton = false;

  @Output() onSave = new EventEmitter<EditableTopic[]>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<void>();

  editableTopics: EditableTopic[] = [];
  nextTopicId = 1;

  get isViewMode(): boolean {
    return this.mode === 'view';
  }

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  get isCreateMode(): boolean {
    return this.mode === 'create';
  }

  get isEditable(): boolean {
    return this.isEditMode || this.isCreateMode;
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

  handleKeyDown(event: KeyboardEvent, index: number): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      this.addTopic();
      setTimeout(() => {
        const inputs = document.querySelectorAll('.input-symbol');
        const newInput = inputs[inputs.length - 1] as HTMLInputElement;
        if (newInput) {
          newInput.focus();
        }
      }, 0);
    }
  }

  getAvailableParents(currentTopicId: number): EditableTopic[] {
    return this.editableTopics.filter(t => t.topicId !== currentTopicId);
  }

  getParentSymbol(fatherId: number): string {
    const parent = this.editableTopics.find(t => t.topicId === fatherId);
    return parent ? parent.hierarchicalSymbol : '';
  }

  save(): void {
    this.onSave.emit(this.editableTopics);
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
