import { Controller, Get, Post, Body, Patch, Param, Delete,  UseInterceptors, UploadedFile} from '@nestjs/common';
import { MaintenanceService } from './maintenance.service.js';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto.js';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const maintenanceUpload = FileInterceptor('photo', {
  storage: diskStorage({
    destination: './uploads/maintenances',
    filename: (req, file, callback) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      callback(null, `${uniqueName}${extname(file.originalname)}`)
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(new Error('Seules les images sont autorisées'), false)
    }

    callback(null, true)
  },
})

@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @UseInterceptors(maintenanceUpload)
  create(@Body() createMaintenanceDto: CreateMaintenanceDto,  @UploadedFile() file: Express.Multer.File) {
    return this.maintenanceService.create(createMaintenanceDto, file?.filename ?? '',);
  }

  @Get()
  findAll() {
    return this.maintenanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(maintenanceUpload)
  update(@Param('id') id: string, @Body() updateMaintenanceDto: UpdateMaintenanceDto,  @UploadedFile() file: Express.Multer.File,) {
    return this.maintenanceService.update(+id, updateMaintenanceDto, file?.filename);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.maintenanceService.remove(+id);
  }
}
