import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from '@angular/forms';

import { MomentService } from 'src/app/services/moment.service';
import { MessagesService } from 'src/app/services/messages.service';

import { Moment } from 'src/app/Moment';
import { Comment } from 'src/app/Comment';

import { environment } from 'src/environments/environment';

import { faTimes, faEdit, faE } from '@fortawesome/free-solid-svg-icons';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-moment',
  templateUrl: './moment.component.html',
  styleUrls: ['./moment.component.css'],
})
export class MomentComponent {
  moment?: Moment;
  baseApiUrl = environment.baseApiUrl;

  faTimes = faTimes;
  faEdit = faEdit;

  commentForm!: FormGroup;

  constructor(
    private momentService: MomentService,
    private route: ActivatedRoute,
    private router: Router,
    private messagesServices: MessagesService,
    private comentService: CommentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.momentService
      .getMoment(id)
      .subscribe((item) => (this.moment = item.data));

    this.commentForm = new FormGroup({
      text: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
    });
  }

  get text() {
    return this.commentForm.get('text')!;
  }

  get username() {
    return this.commentForm.get('username')!;
  }

  async removeHandler(id: number) {
    await this.momentService.removeMoment(id).subscribe();

    this.messagesServices.add('Momento excluído com sucesso!');
    this.router.navigate(['/']);
  }

  async onSubmit(formDirect: FormGroupDirective) {
    if (this.commentForm.invalid) {
      return;
    }

    const data: Comment = this.commentForm.value;

    data.momentId = Number(this.moment?.id);
    await this.comentService
      .createComment(data)
      .subscribe((comment) => this.moment!.comments!.push(comment.data));

    this.messagesServices.add('Comentário adicionado!');
    this.commentForm.reset();

    formDirect.resetForm();
  }
}
