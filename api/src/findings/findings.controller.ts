import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { FindingsService } from './findings.service';
import { QueryFindingsDto } from './dto/query-findings.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Roles, RolesGuard } from './roles.guard';

@Controller('findings')
export class FindingsController {
  constructor(private readonly service: FindingsService) {}

  @Get()
  list(@Query() q: QueryFindingsDto) {
    return this.service.list(q);
  }

  @Get('summary')
  summary() {
    return this.service.summary();
  }

  @Patch(':id/status')
  @Roles('analyst')
  @UseGuards(RolesGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(id, dto.status, 'demo-user');
  }
}