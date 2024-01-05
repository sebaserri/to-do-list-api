import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  description?: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  deadline?: Date;
}
