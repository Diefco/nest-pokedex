import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name) // inyectar modelos en este servicio con nest
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({}); // delete * from pokemons;

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    // Opcion 1. Promise.all a un array de promesas.
    // 1.1. Crear un array; que tendra promesas
    // const insertPromisesArray = [];

    // Opcion 2.
    // 2.1. creamos un array
    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      //Opcion 0: Se guarda en BD uno a uno.
      // const pokemon = await this.pokemonModel.create({ name, no });

      // 1.2. Agregamos promesas sin ejecutar al array de promesas
      // insertPromisesArray.push(this.pokemonModel.create({ name, no }));

      // 2.2. Agregamos los datos que quiero agregar al array
      pokemonToInsert.push({ name, no }); // [{name:bulbasaur, no: 1}]
    });

    // 1.3. Ejecutamos todas las promesas con Promise.all
    // await Promise.all(insertPromisesArray);

    // 2.3. usamos insertMany * Recomendada
    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed Executed';
  }
}
