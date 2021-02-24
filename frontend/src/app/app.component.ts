import { Component } from '@angular/core';
import { ChatService } from './chat/chat.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

enum Role {
  client = 'client',
  employee = 'employee'
}

class User {
  id: number;
  name: string;
  role: Role;

  constructor(
    id?: number, 
    name?: string, 
    role?: Role
  ) { 
    this.id = id;
    this.name = name;
    this.role = role;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public roles = ['client', 'employee'];
  public contexts = [
    'context1',
    'context2',
    'context3',
    'context4',
    'context5'
  ];

  public thisUser = new User(1, 'employee1', Role.employee);

  public users = [
    new User(1, 'employee1', Role.employee),
    new User(2, 'employee2', Role.employee),
    new User(3, 'employee3', Role.employee),
    new User(4, 'client1', Role.client),
    new User(5, 'client2', Role.client),
    new User(6, 'client3', Role.client),
  ];

  constructor(
    private chatService: ChatService,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  onSubmitThisUser() {
    this.chatService.init(this.thisUser, this.contexts);
  }

  addUser() {
    this.users.push(new User());
  }

  removeLastUser() {
    this.users.pop();
  }

  onSubmitUsers() {
    const usersUrl = 'http://localhost:3000/users';
    console.log(this.users);
    this.http.post(usersUrl, this.users)
      .subscribe({
        next : () => {
          this.openSnackBar("Users refreshed.");
        },
        error: () => {
          this.openSnackBar("Failed to refresh users.");
        }
      });
  }

  toogleChat(): void {
    this.chatService.toogleChat();
  }

  private openSnackBar(message: string): void {
    this._snackBar.open(message, "OK", {
      duration: 0,
    });
  }
}
