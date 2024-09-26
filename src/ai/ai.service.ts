import { Injectable, OnModuleInit } from '@nestjs/common';
import { NeuralNetwork } from 'brain.js';
import * as fs from 'fs';
import { PorterStemmerEs } from 'natural';

@Injectable()
export class AiService implements OnModuleInit {
    private net: NeuralNetwork<{}, {}>;

    private tokenize = (text: string): string[] => {
        return text.toLowerCase().split(/\W+/).filter(x => x != '');
    }
    private stem = (listWord: string[]): string[] => {
        return listWord.map(word => {
            return PorterStemmerEs.stem(word);
        });
    }


    async onModuleInit() {
        const netConfig = {
            hiddenLayers: [3]
        }
        this.net = new NeuralNetwork(netConfig);

        const modelPath = 'src/ai/models/trained-model.json';

        if (fs.existsSync(modelPath)) {
            const modelData = fs.readFileSync(modelPath, 'utf-8');
            this.net.fromJSON(JSON.parse(modelData));
            console.log('Modelo cargado exitosamente');
        } else {
            await this.trainModel();
        }
    }

    async trainModel() {

        const trainingPath = 'src/ai/data/training-data.json';
        const trainingData = fs.readFileSync(trainingPath, 'utf-8');
        const trainingDataJson = JSON.parse(trainingData);
        const corpus = trainingDataJson.map((item: { input: string, output: string }) => {
            return {
                input: this.stem(this.tokenize(item.input)).reduce((prev, current) => {
                    prev[current] = 1;
                    return prev;
                }, {}),
                output: {
                    [item.output]: 1
                }
            };
        });
        const result = this.net.train(corpus);
        console.log(result);
        fs.writeFileSync('src/ai/models/trained-model.json', JSON.stringify(this.net.toJSON()));
        console.log('Modelo entrenado y guardado exitosamente');
    }

    run(inputText: string) {
        const input = this.stem(this.tokenize(inputText)).reduce((prev, current) => {
            prev[current] = 1;
            return prev;
        }, {});
        const answer = this.net.run(input);
        const result = Object.entries(answer).find(([key, value]: [string, number]) => value > 0.7);
        return result ? result[0] : 'none';
    }
}
