import mongoose from "mongoose";
import { UserModel } from "../user/user.model";
import { task_entity as Todo } from "./todo.entity";
import { TodoModel } from "./todo.model";
import { AddTodoDto } from "./todo.dto";
import { NotFoundError } from "../../errors/not-found";
import { BadRequestError } from "../../errors/bad-request";

export class TodoService {
  async showTodo(userId: string, completed: boolean): Promise<Todo[]> {
    const option: any = {
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    };
    if (!completed) option.completed = { $ne: true };
    let todos = await TodoModel.find(option)
      .sort({ dueDate: 1 })
      .populate("createdBy")
      .populate("assignedTo");
    return todos;
  }

  async addTodo(TodoObject: AddTodoDto, userId: string): Promise<Todo> {
    const newTodo = await TodoModel.create({
      ...TodoObject,
      createdBy: userId, // Assegna direttamente l'ID dell'utente
    });
    return newTodo.populate("createdBy assignedTo");
  }

  async checkTodo(userId, todoId: string, completed: boolean) {
    let todo;
    try {
      todo = await TodoModel.findById(todoId);
      if (!todo) throw new NotFoundError();
    } catch (err) {
      throw new NotFoundError();
    }

    const createdById = todo.createdBy.toString();
    const assignedToId = todo.assignedTo ? todo.assignedTo.toString() : null;
    if (createdById !== userId && assignedToId !== userId) throw new NotFoundError();
    todo.completed = completed;
    await todo.save();
    return todo;
  }

  async assignTodo(id: string, assignedTo: mongoose.Types.ObjectId, userId: string) {
    // Validate mongoId
    if (!mongoose.Types.ObjectId.isValid(assignedTo)) throw new BadRequestError();
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError();
    // Find todo
    const todo = await TodoModel.findById(id);
    if (!todo) throw new NotFoundError();
    // Find user
    const assignedToUser = await UserModel.findById(assignedTo);
    if (!assignedToUser) throw new BadRequestError();
    if (todo.createdBy.toString() === userId) todo.assignedTo = assignedToUser.id;
    else throw new NotFoundError();
    // Save
    await todo.populate("createdBy assignedTo");
    if (todo.isModified("assignedTo")) await todo.save();
    return todo;
  }

  async getByTitle(title: string, userId: string) {
    const regex = new RegExp(title, "i"); // 'i' indica una ricerca non case-sensitive
    const todo = await TodoModel.find({ title: regex, createdBy: userId })
      .populate("createdBy")
      .populate("assignedTo");
    return todo;
  }

  async deleteTodo(todoId: string, userId: string) {
    const user = await UserModel.findById(userId);
    const todo = await TodoModel.findOne({ _id: todoId });
    if (!todo) throw new NotFoundError();
    await TodoModel.deleteOne({ _id: todoId });
    return todo;
  }

  async updateTodo(userId: string, todoData: Todo) {
    //Validation todo
    const todo = await TodoModel.findById(todoData.id);
    if (!todo) throw new NotFoundError();
    //Validation user
    const createdById = todo.createdBy.toString().trim();
    const assignedToId = todo.assignedTo?.toString().trim();
    if (createdById !== userId && assignedToId !== userId) throw new NotFoundError();
    //Update
    todo.title = todoData.title;
    todo.dueDate = todoData.dueDate;
    todo.completed = todoData.completed;
    if (todoData.assignedTo?.id === "") todo.assignedTo = undefined;
    else todo.assignedTo = todoData.assignedTo;
    await todo.save();
  }
}
export default new TodoService();

//Crea una nuova classe di errore, la lancio nel servizio (new not_found_error) e la gestisco nel catch
