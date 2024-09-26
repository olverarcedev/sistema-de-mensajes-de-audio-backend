import { Injectable } from '@nestjs/common';
import { AudioMessage, PrismaClient } from '@prisma/client';
import { CreateAudioMessageInterface } from './interface/create-audio-message.interface';

import * as FormData from 'form-data';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class AudioMessageService {
  constructor(private readonly prisma: PrismaClient) { }
  async getAudioMessages(): Promise<AudioMessage[]> {
    return this.prisma.audioMessage.findMany({
      include: {
        sender: true
      }
    });
  }
  async insertAudioMessage(createAudioMessageInterface: CreateAudioMessageInterface): Promise<AudioMessage> {
    const { senderId, audioSrc, textRecognized, textIntent } = createAudioMessageInterface;
    return this.prisma.audioMessage.create({
      data: {
        audioSrc, textRecognized, textIntent,
        sender: { connect: { id: senderId } },

      },
      include: {
        sender: true
      }
    });
  }
  async getTextRecognized(filepath: string): Promise<string> {
    const form = new FormData();
    const fileBuffer = fs.readFileSync(filepath);
    form.append('file', fileBuffer, { filename: 'audio.wav' });
    try {
      const response = await axios.post('http://127.0.0.1:8000/transcribe/', form, {
        headers: {
          ...form.getHeaders(),
        },
      });
      return response.data.transcription;
    } catch (error) {
      console.error('Error al transcribir el archivo:', error);
      return 'error';
    }
  }

}
