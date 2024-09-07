import mongoose from "mongoose";
import { UserModel } from "../user/user.model";
import { task_entity as Todo } from "./todo.entity";
import { TodoModel } from "./todo.model";
import { AddTodoDto } from "./todo.dto";
import { NotFoundError } from "../../errors/not-found";
import { NotMongoIdError } from "../../errors/not-mongoId";
import { BadRequestError } from "../../errors/bad-request";

export class TodoService {
  //Funzione per filtrare todo completi e non completi
  async showTodo(userId: string, completed: boolean): Promise<Todo[]> {
    const option: any = {
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    };
    if (!completed) option.completed = { $ne: true };
    let todos = await TodoModel.find(option)
      .sort({ dueDate: 1 })
      .populate("createdBy")
      .populate("assignedTo"); //console.log(todos);
    return todos;
  }

  //Partial è un tipo di TypeScript che crea un nuovo tipo con tutti i campi di un altro tipo impostati come obbligatori.
  async addTodo(TodoObject: AddTodoDto, userId: string): Promise<Todo> {
    const newTodo = await TodoModel.create({
      ...TodoObject,
      createdBy: userId, // Assegna direttamente l'ID dell'utente
    });
    const now = new Date;
    return newTodo.populate("createdBy assignedTo"); // Esegui popolazione e restituisci il risultato
  }

  // Vale sia per Check che per Uncheck
  async checkTodo(userId, todoId: string, completed: boolean) {

    let todo;
    try { 
      todo = await TodoModel.findById(todoId); 
      if (!todo) throw new NotFoundError();
    }
    catch (err) { throw new NotFoundError(); }

    const createdById = todo.createdBy.toString();
    const assignedToId = todo.assignedTo ? todo.assignedTo.toString() : null;
    if (createdById !== userId && assignedToId !== userId) throw new NotFoundError();
    todo.completed = completed;
    await todo.save();
    return todo;
  }

  async assignTodo(
    id: string,
    assignedTo: mongoose.Types.ObjectId,
    userId: string
  ) {
    //Validation
    if (!mongoose.Types.ObjectId.isValid(assignedTo)) throw new BadRequestError();
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError()
    const todo = await TodoModel.findById(id); //Todo
    if (!todo) throw new NotFoundError();
    //assignedTo
    const assignedToUser = await UserModel.findById(assignedTo); //Utente a cui verra assegnato il todo
    if (!assignedToUser) throw new BadRequestError();
    //Check
    if (todo.createdBy.toString() === userId)
      todo.assignedTo = assignedToUser.id;
    else throw new NotFoundError();
    //Save
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

  async searchById(todoId: string, userId: string) {
    const todo = await TodoModel.findById(todoId)
      .populate("createdBy")
      .populate("assignedTo");
    if (!todo) throw new Error("Todo non trovato");
    if (todo.createdBy.id?.toString() !== userId)
      throw new Error("Non hai accesso a questo todo");
    return todo;
  }

  async deleteTodo(todoId: string, userId: string) {
    const user = await UserModel.findById(userId);
    const todo = await TodoModel.findOne({ _id: todoId });
    if (!todo) throw new NotFoundError();
    await TodoModel.deleteOne({ _id: todoId });
    return todo;
  }

  async updateDate(todoId: string, userId: string, date: Date) {
    const todo = await TodoModel.findById(todoId);
    if (!todo) throw new NotFoundError();
    todo.dueDate = date;
    await todo.save();
    return todo;
  }
}
export default new TodoService();

//Crea una nuova classe di errore, la lancio nel servizio (new not_found_error) e la gestisco nel catch
