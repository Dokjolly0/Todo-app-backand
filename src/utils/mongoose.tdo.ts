import { IsMongoId } from "class-validator";
import mongoose from "mongoose";

export class MongooseDto {
  @IsMongoId()
  id: mongoose.Types.ObjectId;
}
