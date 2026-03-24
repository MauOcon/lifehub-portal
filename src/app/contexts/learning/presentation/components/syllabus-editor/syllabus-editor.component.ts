import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
export class SyllabusEditorComponent implements OnChanges {
  @Input() mode: 'view' | 'edit' | 'create' = 'view';
  @Input() syllabus: SyllabusItem[] = [];
  @Input() showEditButton = false;

  @Output() onSave = new EventEmitter<EditableTopic[]>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<void>();

  editableTopics: EditableTopic[] = [];
  private originalTopics: EditableTopic[] = [];
  nextTopicId = 1;
  modifiedFields = new Set<string>();

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

  get hasChanges(): boolean {
    return this.modifiedFields.size > 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] && this.isEditMode && this.syllabus.length > 0) {
      this.loadSyllabusForEdit();
    }
  }

  private loadSyllabusForEdit(): void {
    this.editableTopics = this.syllabus.map((item, index) => ({
      topicId: item.topicId ?? index + 1,
      order: index,
      name: item.name,
      hierarchicalSymbol: item.number,
      fatherId: item.fatherId,
      completion: item.progress
    }));
    this.originalTopics = this.editableTopics.map(t => ({ ...t }));
    this.nextTopicId = this.editableTopics.length + 1;
    this.modifiedFields.clear();
  }

  onFieldChange(topicId: number, field: string): void {
    const key = `${topicId}-${field}`;
    const current = this.editableTopics.find(t => t.topicId === topicId);
    const original = this.originalTopics.find(t => t.topicId === topicId);

    if (!original) {
      this.modifiedFields.add(key);
      return;
    }

    if (current && original[field as keyof EditableTopic] !== current[field as keyof EditableTopic]) {
      this.modifiedFields.add(key);
    } else {
      this.modifiedFields.delete(key);
    }
  }

  isModified(topicId: number, field: string): boolean {
    return this.modifiedFields.has(`${topicId}-${field}`);
  }

  edit(): void {
    this.onEdit.emit();
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
    if (this.isEditMode) {
      const modified = this.editableTopics.filter(t =>
        this.modifiedFields.has(`${t.topicId}-name`) ||
        this.modifiedFields.has(`${t.topicId}-hierarchicalSymbol`) ||
        this.modifiedFields.has(`${t.topicId}-completion`)
      );
      this.onSave.emit(modified);
    } else {
      this.onSave.emit(this.editableTopics);
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
