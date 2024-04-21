import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  constructor(public userService : UsersService){}

  ngOnInit(){
    this.userService.getUsers();
  }

  delete(id: string){
    this.userService.deleteUsers(id);
  }

  addUser(){
    this.userService.isAddUser = true;
  }
}
