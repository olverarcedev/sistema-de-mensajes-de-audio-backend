import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { AudioMessageService } from './audio-message.service';
import { AudioMessage } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { CreateAudioMessageInterface } from './interface/create-audio-message.interface';
import { AiService } from 'src/ai/ai.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';



@UseGuards(JwtAuthGuard)
@Controller('audio-message')

export class AudioMessageController {
    constructor(
        private readonly audioMessageService: AudioMessageService,
        private readonly aiService: AiService
    ) { }

    @Get()
    async findAll(): Promise<AudioMessage[]> {
        return await this.audioMessageService.getAudioMessages();
    }
    @Post()
    @UseInterceptors(
        FileInterceptor('message', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const fileName = `${Date.now()}${extname(file.originalname)}`;
                    cb(null, fileName);
                },
            }),
        }),
    )
    async create(
        @Request() request: Request & ({ user: { id: number } }),
        @UploadedFile() file: Express.Multer.File,
    ): Promise<AudioMessage> {
        const audioSrc = `uploads/${file.filename}`;
        const textRecognized = await this.audioMessageService.getTextRecognized(file.path);
        const textIntent = this.aiService.run(textRecognized);
        const senderId = request.user.id;
        const updatedData: CreateAudioMessageInterface = {
            senderId,
            audioSrc,
            textRecognized,
            textIntent
        };
        const audioMessage = this.audioMessageService.insertAudioMessage(updatedData);
        return audioMessage;
    }

}