import { Module } from '@nestjs/common';
import { AudioMessageController } from './audio-message.controller';
import { AudioMessageService } from './audio-message.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AiService } from 'src/ai/ai.service';

@Module({
    imports: [PrismaModule],
    controllers: [AudioMessageController],
    providers: [AudioMessageService, AiService]
})
export class AudioMessageModule { }
