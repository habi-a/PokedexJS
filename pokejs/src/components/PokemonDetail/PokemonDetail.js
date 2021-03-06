import React, { Component } from 'react';
import './Pokemon.css';

function PokemonMoves(props) {
    var table = []
    var moves = props.moves.split(', ');

    for (let i = 0; i < moves.length; i++) {
        table.push(<li>{moves[i]} , </li>)
    }
    return table
}

function PokemonItems(props) {
    var table = []
    var items = props.items.split(', ');

    for (let i = 0; i < items.length; i++) {
        table.push(<li>{items[i]}</li>)
    }
    return table
}

function PokemonEvolutions(props) {
    var table = []

    for (let i = 0; i < props.evolutions.length; i++) {
        table.push(<li>{props.evolutions[i]}</li>)
    }
    return table
}

class PokemonDetail extends Component {
    static arrayFill(arrayToFill, valueToFill) {
        var tmp = ['no_data'];
        if (arrayToFill) {
            if (arrayToFill.length)
                tmp = [];
            for (let i = 0; i < arrayToFill.length; i++) {
                switch (valueToFill) {
                    case 'type':
                        tmp.push(arrayToFill[i].type.name);
                        break;
                    case 'move':
                        tmp.push(arrayToFill[i].move.name);
                        break;
                    case 'item':
                        tmp.push(arrayToFill[i].item.name);
                        break;
                    default:
                        break;
                }
            }
        }
        tmp = tmp.join(", ");
        return tmp;
    }


    constructor(props) {
        super(props);
        this.state = {
            error: null,
            name: '',
            description: '',
            family: '',
            imageUrl: [],
            evolutions: [],
            pokemonIndex: '',
            types: '',
            moves: '',
            items: '',
            currentIndex: 0,
            stats: {
                hp: '',
                attack: '',
                defense: '',
                speed: '',
            },
            isLoaded: false,
        }
    }


    componentDidMount() {
        fetch("https://pokeapi.co/api/v2/pokemon/" + this.props.id)
        .then(res => res.json())
        .then(
            (result) => {
                fetch(result.species.url)
                .then(res => res.json())
                .then(
                    (result_species) => {
                        fetch(result_species.evolution_chain.url)
                        .then(res => res.json())
                        .then(
                            (result_evolution) => {
                                let i = (result_species.flavor_text_entries[1].language.name === "en") ? 1 : 2;
                                let j = (result_species.genera[1].language.name === "en") ? 1 : 2;
                                let tmp_evolutions = [result_evolution.chain.species.name];
                                if (result_evolution.chain.evolves_to.length !== 0) {
                                    tmp_evolutions.push(result_evolution.chain.evolves_to[0].species.name)
                                    if (result_evolution.chain.evolves_to[0].evolves_to.length !== 0) {
                                        tmp_evolutions.push(result_evolution.chain.evolves_to[0].evolves_to[0].species.name);
                                        if (result_evolution.chain.evolves_to[0].evolves_to[0].evolves_to.length !== 0) {
                                            tmp_evolutions.push(result_evolution.chain.evolves_to[0].evolves_to[0].evolves_to[0].species.name);
                                        }
                                    }
                                }
                                this.setState({
                                    isLoaded: true,
                                    pokemonIndex: this.props.id,
                                    name: result.name,
                                    description: result_species.flavor_text_entries[i].flavor_text,
                                    family: result_species.genera[j].genus,
                                    types: PokemonDetail.arrayFill(result.types, 'type'),
                                    moves: PokemonDetail.arrayFill(result.moves, 'move'),
                                    items: PokemonDetail.arrayFill(result.items, 'item'),
                                    evolutions: tmp_evolutions,
                                    stats: {
                                        hp: result.stats[5].base_stat,
                                        attack: result.stats[4].base_stat,
                                        defense: result.stats[3].base_stat,
                                        speed: result.stats[0].base_stat
                                    },
                                    imageUrl: [
                                        result.sprites.front_default,
                                        result.sprites.back_default,
                                        result.sprites.front_female,
                                        result.sprites.back_female,
                                        result.sprites.front_shiny,
                                        result.sprites.back_shiny,
                                        result.sprites.front_shiny_female,
                                        result.sprites.back_shiny_female
                                    ]
                                });
                            },
                            (error) => {
                                this.setState({
                                    isLoaded: true,
                                    error
                                });
                            }
                        )
                    },
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        });
                    }
                )
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }

    render() {
        const { error, evolutions, currentIndex, name, pokemonIndex, description, family, stats, types, moves, items, imageUrl} = this.state;
        if (error) {
            return <div>Erreur : {error.message}</div>;
        } else {
            return (
                <div className="modal">
                    <div className="header">{name}</div>
                    <div className="id">No. {pokemonIndex}</div>
                    <div className="types">{types}</div>
                    <div className="content">
                    <br />
                    <img className="card-poke-img"
                        src={imageUrl[currentIndex]}
                        alt='no_picture'
                    />
                    <button className = "prev" onClick={() => {
                        var index = (currentIndex - 1 < 0) ? 7 : currentIndex - 1;
                        this.setState({currentIndex: index});
                    }}>&#10094;</button>
                    <button className = "next" onClick={() => {
                        var index = (currentIndex + 1 > 7) ? 0 : currentIndex + 1;
                        this.setState({currentIndex: index});
                    }}>&#10095;</button>


                    <div className="stats-poke left">
                        <div>HP</div>
                        <div>Attack</div>
                        <div>Defense</div>
                        <div>Speed</div>
                    </div>

                    <div className="stats-poke right">
                        <div>{stats.hp}</div>
                        <div>{stats.attack}</div>
                        <div>{stats.defense}</div>
                        <div>{stats.speed}</div>
                    </div>
                </div>
                <div className="separator"></div>
                    <div className="moves">
                        <p className="title">Moves : </p>
                        <p><PokemonMoves moves={moves} /></p>
                    </div>
                    <div className="separator"></div>
                    <div className="describe">
                        <p className="title">Describes : </p>
                        <p>{description}</p>
                    </div>
                    <div className="separator"></div>

                    <div className="evolutionsdiv">
                        <p className="title">Evolutions : </p>
                        <ul className="evolutions">
                            <PokemonEvolutions evolutions={evolutions} />
                        </ul>
                    </div>
                    <div className="separator"></div>


                    <div className="items">
                        <p className="title">Items : </p>
                        <PokemonItems items={items}/>
                    </div>
                    <div className="separator"></div>


                    <div className="family">
                        <p className="title">Family : </p>
                        <p>{family}</p>
                    </div>

                </div>
            );
        }
    }
}

export default PokemonDetail;
