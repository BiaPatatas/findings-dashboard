import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Severity, Status } from '@prisma/client';

export class QueryFindingsDto {
  @IsOptional() @IsEnum(Severity) severity?: Severity;
  @IsOptional() @IsEnum(Status) status?: Status;
  @IsOptional() @IsString() @MaxLength(100) search?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize: number = 20;
}