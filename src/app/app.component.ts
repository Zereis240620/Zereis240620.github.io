import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, RequiredValidator, Validators } from '@angular/forms';
import { Todo } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  todos: Todo[] = [];
  form: FormGroup = new FormGroup({
    description : new FormControl('', [Validators.required,Validators.minLength(6)])
  });
  
  constructor(private service: TodoService){}

  ngOnInit(){
    this.listarTodos();
  }
  
  listarTodos(){
    this.service.listar().subscribe(listTodo => this.todos = listTodo);
  }
  
  submit(){
    // console.log(this.form.value);
    const todo: Todo = { ... this.form.value};
    this.service
          .salvar(todo)
          .subscribe(savedTodo => {
            this.todos.push(savedTodo)
            this.form.reset()
          });
  }

  delete(todo: Todo){
    this.service.deletar(todo.id).subscribe({
      next: (response) => this.listarTodos()
    });
  }

  done(todo: Todo) {
    this.service.marcarComoConcluido(todo.id).subscribe({
      next: (todoAtualizado) => {
        todo.done = todoAtualizado.done;
        todo.doneDate =todoAtualizado.doneDate;
      }
    })
  }
}
