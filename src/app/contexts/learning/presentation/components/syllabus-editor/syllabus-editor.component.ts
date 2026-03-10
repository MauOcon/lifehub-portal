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

  get isViewMode(): boolean {
    return this.mode === 'view';
  }

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  get isCreateMode(): boolean {
    return this.mode === 'create';
  }
}
