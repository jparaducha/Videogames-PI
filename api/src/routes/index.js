const { Router } = require('express');
const { Genres, Videogame } = require('../db');

const { YOUR_API_KEY,
    DB_HOST,
    DB_USER,
    DB_PASSWORD} = process.env;

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const morgan = require('morgan');
const { Op } = require('sequelize');
const axios = require('axios');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use(morgan('dev'));

var getDatabaseInfo = async function(name){

    return await Videogame.findAll({
        where : {
            name: {
                [Op.iLike] : `%${name}%`
            }
        },
        include : {
            model : Genres
        }
    })
}

var getDBbyUUID = async function(id){
    return await Videogame.findOne({
        where : {
            uuid : id
        },
        include : {
            model : Genres,
            attributes : ["name"],
            through : { attributes: []}
        }
    })
}



router.get('/games', async function(req,res){

    const { name } = req.query;

    try {
    var videogamesData1;
    if(name) {
        videogamesData1 = await axios.get(`https://api.rawg.io/api/games?key=${YOUR_API_KEY}&search=${name}`);
    }else{
    videogamesData1 = await axios.get(`https://api.rawg.io/api/games?key=${YOUR_API_KEY}&search=`);
    }
    // console.log('vgData1.data.results:', videogamesData1.data.results);

    let array = Object.values(videogamesData1.data.results);
    let videogamesData = await  Promise.all(array.map(i=>{ // promise.all para cumplir con todos los mapeos del arreglo o con ninguno  ¿¿¿??? ;s
        return {
            name : i.name,
            image_background : i.image_background,
            released : i.released,
            rating : i.rating,
            score : i.score,
            metacritic : i.metacritic,
            platforms : i.platforms.map(i=> i.platform.name),
        }
    }))

    let dbGames = await getDatabaseInfo(name);
    let apiGames = videogamesData;
    const info = dbGames.concat(apiGames);
    

    // console.log('array vgData es:', videogamesData);
    info ? res.json(info): res.status(404).send('No se encontraron juegos');
    }
    catch(e)
    {
        console.log(e)
    }
})

router.get('/games/:id', async (req,res)=>{

    const { id } = req.params;
    if(id.length>10){
        var resultadoDB = await getDBbyUUID(id);

        var juego = {
            name : resultadoDB.name,
            image_background: resultadoDB.image_background,
            released : resultadoDB.released,
            rating : resultadoDB.rating,
            // ratings : resultadoDB.ratings,
            score : resultadoDB.score,
            metacritic : resultadoDB.metacritic,
            platforms : resultadoDB.platforms,
            genres : resultadoDB.genres.map(i=> i.name)
        }

    }else{
        juego = {'XD': 'XD'}
    }

    res.json(juego);
})


router.get('/genres', async (req,res)=>{

    const genresList = [
        {
            id: 1,
            name: 'Action'
        },
        {
            id: 2,
            name: 'Indie'
        },
        {
            id: 3,
            name: 'Adventure'
        },
        {
            id: 4,
            name: 'RPG'
        },
        {
            id: 5,
            name: 'Strategy'
        },
        {
            id: 6,
            name: 'Shooter'
        },
        {
            id: 7,
            name: 'Casual'
        },
        {
            id: 8,
            name: 'Simulation'
        },
        {
            id: 9,
            name: 'Puzzle'
        },
        {
            id: 10,
            name: 'Arcade'
        },
        {
            id: 11,
            name: 'Platformer'
        },
        {
            id: 12,
            name: 'Racing'
        },
        {
            id: 13,
            name: 'Massively Multiplayer'
        },
        {
            id: 14,
            name: 'Sports'
        },
        {
            id: 15,
            name: 'Family'
        },
        {
            id:16,
            name: 'Fighting'
        },
        {
            id: 17,
            name: 'Board Games'
        },
        {
            id: 18,
            name: 'Educational'
        },
        {
            id: 19,
            name: 'Cards'
        },
    ]

    for(let i = 0; i<genresList.length; i++){
        let ele = genresList[i];
        Genres.findOrCreate({
            where : {
                name : ele.name
            },
            defaults :{
                id : ele.id,
                name : ele.name
            }
        })
    }
    
    generos = await Genres.findAll();

    res.json(generos);
})



router.post('/games', async (req,res)=>{


    try{
    const {
        name, 
      image_background,
      released ,
      rating ,
      platforms ,
      score,
      metacritic,
    genres} = req.body;


      let vGame = await Videogame.create({
        name, 
        image_background,
        released ,
        rating ,
        platforms ,
        score,
        metacritic,
      })
      console.log('juego creado: vgame.datavlues', vGame.dataValues);

      let genresDb = await Genres.findAll({
          where : {
              name : genres
          }
      })

      vGame.addGenres(genresDb);


      res.send(`Juego ${name} creado exitosamente`);



    }
    catch(e){
        console.log('No se pudo agregar el juego\n\n\n\n',e );
    }
    }
)


module.exports = router;
