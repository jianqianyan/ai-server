import { Siliconflow } from "./manufacturer/siliconflow";

export interface Manufacturer {
  modelName: string;
  onmessage: (str: string) => void;
  onend: () => void;
}

type ManufacturerConstructor = new (...args: any[]) => Manufacturer;

const list: Record<string, ManufacturerConstructor> = {
  siliconflow: Siliconflow
};

export class AiService {
  server: Manufacturer;

  constructor(name: string, options: string[]) {
    const Constructor = list[name];
    if (Constructor) {
      this.server = new Constructor(...options);
    } else {
      throw new Error(`Unknown manufacturer: ${name}`);
    }
  }
}