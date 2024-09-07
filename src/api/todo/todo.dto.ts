import { IsMongoId, IsString, IsOptional, IsDateString } from "class-validator";
import mongoose from "mongoose";
import { IsNotPastDate } from "../../utils/decorators/checkDate"; //Custom

export class AddTodoDto {
  @IsString()
  title: string;

  @IsDateString()
  @IsOptional()
  @IsNotPastDate({ message: "The due date must be in the past" })
  dueDate?: Date;

  @IsMongoId()
  @IsOptional()
  assignedTo: mongoose.Types.ObjectId;

  // @IsMongoId()
  // createdBy: mongoose.Types.ObjectId;
}

export class CheckTodoDto {
  @IsMongoId()
  id: string;
}
