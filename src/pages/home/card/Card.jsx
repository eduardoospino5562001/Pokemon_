// Importa React y dos hooks de la librería React.
import React, { useEffect, useState } from "react";

// Importa los estilos específicos del componente desde un archivo SCSS.
import css from "./card.module.scss";

// Importa la librería axios para realizar peticiones HTTP.
import axios from "axios";

// Importa las URLs de la API de Pokémon que se han definido en otro archivo.
import {
  URL_ESPECIES,
  URL_EVOLUCIONES,
  URL_POKEMON,
} from "../../../api/apiRest";


// Componente 'Card' para mostrar datos de Pokémon.
export default function Card({ card }) {
  // Estado para datos del Pokémon.
  const [itemPokemon, setItemPokemon] = useState({});
  // Estado para especie del Pokémon.
  const [especiePokemon, setEspeciePokemon] = useState({});
  // Estado para evoluciones del Pokémon.
  const [evoluciones, setEvoluciones] = useState([]);

  // Efecto para cargar datos del Pokémon.
  useEffect(() => {
    // Función asíncrona para obtener datos de la API.
    const dataPokemon = async () => {
      // Petición GET con axios a la URL del Pokémon.
      const api = await axios.get(`${URL_POKEMON}/${card.name}`);
      // Actualiza estado con la respuesta de la API.
      setItemPokemon(api.data);
    };
    // Ejecuta la función al montar y actualizar 'card'.
    dataPokemon();
  }, [card]);

  // Efecto para cargar datos de la especie del Pokémon.
useEffect(() => {
  // Función asíncrona para obtener datos de la especie.
  const dataEspecie = async () => {
    // Divide la URL para obtener el ID del Pokémon.
    const URL = card.url.split("/");
    // Petición GET para obtener datos de la especie.
    const api = await axios.get(`${URL_ESPECIES}/${URL[6]}`);
    // Actualiza el estado con la URL de evolución y los datos.
    setEspeciePokemon({
      url_especie: api?.data?.evolution_chain,
      data: api?.data,
    });
  };
  // Ejecuta la función al montar y actualizar 'card'.
  dataEspecie();
}, [card]);


 // Este efecto se ejecuta después de que el componente se actualiza.
useEffect(() => {
  // Función para obtener la imagen oficial de un Pokémon por su ID.
  async function getPokemonImagen(id) {
    // Hacemos una petición GET para obtener los datos del Pokémon.
    const response = await axios.get(`${URL_POKEMON}/${id}`);
    // Devolvemos la URL de la imagen oficial del Pokémon.
    return response?.data?.sprites?.other["official-artwork"]?.front_default;
  }

  // Verificamos si tenemos la URL de la especie del Pokémon.

  if (especiePokemon?.url_especie) {
    // Función para obtener las evoluciones del Pokémon.
    const obtenerEvoluciones = async () => {
      // Creamos un array para guardar las evoluciones.
      const arrayEvoluciones = [];
      // Separamos la URL para obtener el ID de la especie.
      const URL = especiePokemon?.url_especie?.url.split("/");
      // Hacemos una petición GET para obtener los datos de evolución.
      const api = await axios.get(`${URL_EVOLUCIONES}/${URL[6]}`);
      // Separamos la URL para obtener el ID del Pokémon.
      const URL2 = api?.data?.chain?.species?.url?.split("/");
      // Obtenemos la imagen del Pokémon usando el ID.
      const img1 = await getPokemonImagen(URL2[6]);
      // Añadimos la imagen y el nombre del Pokémon al array de evoluciones.
      arrayEvoluciones.push({
        img: img1,
        name: api?.data?.chain?.species?.name,
      });


        // Verificion si el Pokémon tiene evoluciones.
if (api?.data?.chain?.evolves_to?.length !== 0) {
  // Obtencion de los datos de la primera evolución.
  const DATA2 = api?.data?.chain?.evolves_to[0]?.species;
  // Separacion de la URL para obtener el ID de la primera evolución.
  const ID = DATA2?.url?.split("/");
  // Obtencion de la imagen de la primera evolución.
  const img2 = await getPokemonImagen(ID[6]);

  // Añadimos la imagen y el nombre de la primera evolución al array.
  arrayEvoluciones.push({
    img: img2,
    name: DATA2?.name,
  });

  // Verificamos si hay una segunda evolución.
  if (api?.data?.chain.evolves_to[0].evolves_to.length !== 0) {
    // Obtenemos los datos de la segunda evolución.
    const DATA3 = api?.data?.chain?.evolves_to[0]?.evolves_to[0]?.species;
    // Separamos la URL para obtener el ID de la segunda evolución.
    const ID = DATA3?.url?.split("/");
    // Obtenemos la imagen de la segunda evolución.
    const img3 = await getPokemonImagen(ID[6]);

    // Añadimos la imagen y el nombre de la segunda evolución al array.
    arrayEvoluciones.push({
      img: img3,
      name: DATA3?.name,
    });
  }
}
        setEvoluciones(arrayEvoluciones);
      };

      obtenerEvoluciones();
    }
  }, [especiePokemon]);

  let pokeId = itemPokemon?.id?.toString();
  if (pokeId?.length === 1) {
    pokeId = "00" + pokeId;
  } else if (pokeId?.length === 2) {
    pokeId = "0" + pokeId;
  }
  return (
    <div className={css.card}>
      <img
        className={css.img_poke}
        src={itemPokemon?.sprites?.other["official-artwork"]?.front_default}
        alt="pokemon"
      />
      <div
        className={`bg-${especiePokemon?.data?.color?.name} ${css.sub_card}  `}
      >
        <strong className={css.id_card}>#{pokeId} </strong>
        <strong className={css.name_card}> {itemPokemon.name} </strong>
        <h4 className={css.altura_poke}> Altura: {itemPokemon.height}0 cm </h4>
        <h4 className={css.peso_poke}>Peso: {itemPokemon.weight} Kg </h4>
        <h4 className={css.habitat_poke}>
          Habitat: {especiePokemon?.data?.habitat?.name}{" "}
        </h4>

        <div className={css.div_stats}>
          {itemPokemon?.stats?.map((sta, index) => {
            return (
              <h6 key={index} className={css.item_stats}>
                <span className={css.name}> {sta.stat.name} </span>
                <progress value={sta.base_stat} max={110}></progress>
                <span className={css.numero}> {sta.base_stat} </span>
              </h6>
            );
          })}
        </div>

        <div className={css.div_type_color}>
          {itemPokemon?.types?.map((ti, index) => {
            return (
              <h6
                key={index}
                className={`color-${ti.type.name}  ${css.color_type} `}
              >
                {" "}
                {ti.type.name}{" "}
              </h6>
            );
          })}
        </div>

        <div className={css.div_evolucion}>
          {evoluciones.map((evo, index) => {
            return (
              <div key={index} className={css.item_evo}>
                <img src={evo.img} alt="evo" className={css.img} />
                <h6> {evo.name} </h6>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
