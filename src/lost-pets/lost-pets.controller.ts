import { Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { CreateLostPetDto } from './dtos/lost-pet.dto';
import { generateLostPetTemplate } from './templates/lost-pet.template';
import { BodyResponse } from './dtos/body-response.dto';
import { LostPetsService } from './lost-pets.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';


@UseGuards(AuthGuard)
@Controller('lost-pets')
export class LostPetsController {
    
    constructor(
        private emailService:EmailService,
        private lostPetService: LostPetsService,
        private storageService: StorageService
    ){}

    @Get()
    async getAllLostPets(){
        const response : BodyResponse = {
            status: 200,
            error: false,
            errorMessage: undefined,
            data: undefined
        }
        try{
            const lostPets = await this.lostPetService.getAllPets();
            response.data = lostPets;
            return response;
        }
        catch(e){
            response.status = 500;
            response.error = true;
            response.errorMessage = "Ocurrio un error";
            return response;
        }
    }

    @Post()
    async createLostPet(
        @Body() createLostPetDto: CreateLostPetDto
    ){
        const response : BodyResponse = {
            status: 200,
            error: false,
            errorMessage: undefined,
            data: undefined
        }
        try{
            const template = generateLostPetTemplate(createLostPetDto);
            await this.emailService.sendEmail(template);
            const lostPet = await this.lostPetService.createLostPet(createLostPetDto);
            response.data = lostPet;
            return response;
        }
        catch(e){
            response.status = 500;
            response.error = true;
            response.errorMessage = "Ocurrio un error";
            return response;
        }
    }

    @Post(':id/image')
    @UseInterceptors(FileInterceptor('image', {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/'))
    }))
    async uploadLostPetImage(
        @Param('id',ParseIntPipe) id: number,
        @UploadedFile() file: any
    ){
        const url = await this.storageService.uploadFile(file,'pets');
        return {
            url: url
        };
    }
}
