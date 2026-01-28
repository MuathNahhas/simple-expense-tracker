import { Exclude, Expose } from 'class-transformer';

export class CategoryResponseDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Exclude()
  updated_at: string;
  @Exclude()
  created_at: string;

  constructor(partial: Partial<CategoryResponseDto>) {
    Object.assign(this, partial);
  }
}
