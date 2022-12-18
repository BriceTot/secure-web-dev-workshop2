require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then((result)=>{
    const { Schema } = mongoose;

    const blogSchema = new Schema({
        filmType: String,
        filmProducerName: String,
        endDate: Date,
        filmName: String,
        district: String,
        geolocation: {
            coordinates: [Number],
            type: String
        },
        sourceLocationId: String,
        filmDirectorName: String,
        address: String,
        startDate: Date,
        year: Number,
    },
    { typeKey: '$type' }
    );

    const Location = mongoose.model('Location', blogSchema);

    async function PopulateDBLocations(filmingLocations){
        let filmingLocationDoc
        let promiseChunk=[]
        for (const filmingLocation of filmingLocations) {
            filmingLocationDoc= new Location({filmType : filmingLocation.fields.type_tournage,
                filmProducerName : filmingLocation.fields.nom_producteur, endDate : new Date(filmingLocation.fields.date_fin),
                filmName : filmingLocation.fields.nom_tournage, district : filmingLocation.fields.ardt_lieu,
                geolocation : { coordinates : [filmingLocation.geometry.coordinates[0], filmingLocation.geometry.coordinates[1]],
                    type : filmingLocation.geometry.type},
                sourceLocationId: filmingLocation.fields.id_lieu, filmDirectorName : filmingLocation.fields.nom_realisateur,
                address : filmingLocation.fields.adresse_lieu, startDate : new Date(filmingLocation.fields.date_debut),
                year : Number(filmingLocation.fields.annee_tournage)})
            promiseChunk.push(filmingLocationDoc.save())
        }
        await Promise.all(promiseChunk) //permet d'attendre que tous les enregistrements soient effectués
        console.log("population done")
    }

    async function QueryID(ID){
        console.log(await Location.findById(ID).exec());
    }

    async function QueryFilmName(searchedFilmName){
        console.log(await Location.find({filmName : searchedFilmName}).exec());
    }

    async function DeleteByID(ID){
        await Location.findByIdAndDelete(ID);
        console.log("Done")
    }

    async function QueryAll(searchedFilmName){
        console.log(await Location.find({}).exec());
    }

    async function CreateLocation(locBody) {
        let new_location = new Location(locBody);
        await new_location.save().then( doc => {console.log(doc)});
    }

    async function UpdateLocation(id, locBody){
        await Location.findByIdAndUpdate(id, locBody, {new : true}).then(doc=> {console.log(doc)});
    }



    let filmingLocations=require('../secure-web-dev-workshop1/lieux-de-tournage-a-paris.json')
    /*PopulateDBLocations(filmingLocations).then((result)=>{
        mongoose.connection.close()
    })*/

    /*QueryID('63484dd03c804aea91a7b60f').then((result)=>{
        mongoose.connection.close()
    })*/

    /*QueryFilmName('LRDM - Patriot season 2').then((result)=>{
        mongoose.connection.close()
    })*/

    /*DeleteByID('63484dd03c804aea91a7b616').then((result)=>{
        mongoose.connection.close()
    })*/

    /*QueryAll().then((result)=> {
        mongoose.connection.close()
    })*/



    /*CreateLocation({filmType : 'horreur'}).then((result)=> {
        mongoose.connection.close()
    })*/

    UpdateLocation('63484dd03c804aea91a7b612', {filmType : 'horreur'}).then((result)=> {
        mongoose.connection.close()
    })
})



