import { task_entity as Todo } from "./todo.entity";
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema<Todo>({
  //id: String,
  title: { type: String, required: true },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: { type: Date, required: false },
  completed: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

todoSchema.virtual("expired").get(function (this: Todo) {
  const data_corrente = new Date();
  return this.dueDate && this.dueDate < data_corrente;
});

todoSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id; // Rimuovi il campo _id
    delete ret.__v;
    return ret;
  },
});

export const TodoModel = mongoose.model<Todo>("Todo", todoSchema);
// 'Todo' Il nome della collezione nel database MongoDB, che è 'Todo'
// todoSchema Lo schema Mongoose 'todoSchema', che definisce la struttura dei documenti nella collezione
// <Todo> Il tipo di dati TypeScript associato al modello, che sembra essere un tipo generico 'Todo'
