import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { CreateLostPetDto } from './dtos/lost-pet.dto';
import { generateLostPetTemplate } from './templates/lost-pet.template';
import { BodyResponse } from './dtos/body-response.dto';
import { LostPetsService } from './lost-pets.service';
import { AuthGuard } from 'src/auth/auth.guard';


@UseGuards(AuthGuard)
@Controller('lost-pets')
export class LostPetsController {
    
    constructor(
        private emailService:EmailService,
        private lostPetService: LostPetsService
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
}
