const { parse } = require("csv-parse");
const fs = require("fs");
const path = require('path');
const planets = require('./planets.mongo');

// const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname,"..","..","data","kepler_data.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          // habitablePlanets.push(data);
          savePlanet(data);
        }
      })
      .on("error", (error) => {
        console.log(error);
        reject(err);
      })
      .on("end", async () => {
        // console.log(
          // habitablePlanets.map((planet) => {
          //   return planet["kepler_name"];
          // });
        // );
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        // console.log("done");
        resolve();
      });
  });
}
async function getAllPlanets(){
  // return habitablePlanets;
  return await planets.find({}, {
    '_id':0,
    '__v': 0,
  });
}



async function savePlanet(planet){
  try{
    await planets.updateOne({
      kepler_name: planet.kepler_name,
    }, {
      kepler_name: planet.kepler_name,
    },{
      upsert: true,
    });
  }
  catch(err){
    console.error(`Could not save planet ${err} `);
  }

}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
