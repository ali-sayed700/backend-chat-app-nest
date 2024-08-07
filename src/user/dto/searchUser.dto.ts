import { IsNotEmpty } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class SearchUsersDto extends PaginationDto {
  @IsNotEmpty()
  readonly username: string;
}
