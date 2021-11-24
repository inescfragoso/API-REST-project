var express = require('express');
var router = express.Router();

const options = {
    client: 'mysql',
    connection: {
        host: 'localhost',
        database: 'db',
        user: 'root',
        password: 'root'
    }
}

const knex = require('knex')(options);

/**
 * @api {get} /city/:name Request City information
 * @apiName GetCity
 * @apiGroup City
 *
 * @apiParam {String} name The name of the city to search.
 *
 * @apiSuccess {String} Name Name of the given City.
 * @apiSuccess {String} CountryCode Country code of the given City.
 * @apiSuccess {String} District District of the given City.
 * @apiSuccess {Number} Population Population of the given City.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          Name: "Amsterdam", 
 *          CountryCode: "NLD",
 *          District: "Noord-Holland",
 *          Population: 731200
 *     }
 *
 * @apiError CityNotFound The name of the City was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "CityNotFound"
 *     }
 */
router.get("/:name", (req, res) => {
    const name = req.params.name;

    knex.from("city").select("*").where("Name", "=", name).then(result => {
        let cities = new Array(result.length);

        for(i = 0; i < cities.length; i++) {
            let city = {
                Name: result[i].Name, 
                CountryCode: result[i].CountryCode,
                District: result[i].District,
                Population: result[i].Population
            }

            cities[i] = city;
        }

        if(result != "") {
            res.status(200).send(cities);
        } else {
            res.status(404).json({"error" : "CityNotFound"});
        }
    });
});

/**
 * @api {post} /city Create new City
 * @apiName CreateCity
 * @apiGroup City
 * 
 * @apiBody {String} Name Name of the City to create.
 * @apiBody {String} CountryCode Country code of the City to create.
 * @apiBody {String} District District of the City to create.
 * @apiBody {Number} Population Population of the City to create.
 *
 * @apiSuccess {Number} ID Id of the created City.
 * @apiSuccess {String} Name Name of the created City.
 * @apiSuccess {String} CountryCode Country code of the created City.
 * @apiSuccess {String} District District of the created City.
 * @apiSuccess {Number} Population Population of the created City.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          ID: 4084,
 *          Name: "NewCity", 
 *          CountryCode: "NLD",
 *          District: "Noord-Holland",
 *          Population: 100
 *     }
 */
router.post("/", (req, res) => {
    const name = req.body.name;
    const countryCode = req.body.countrycode;
    const district = req.body.district;
    const population = parseInt(req.body.population);

    knex("city").select("id")
                .orderBy("id", "desc")
                .limit(1)
                .then(result => {
                    const newID = result[0].id + 1;

                    const newCity = {
                        id: newID,
                        name: name, 
                        countrycode: countryCode,
                        district: district,
                        population: population
                    }

                    knex("city").insert(newCity)
                                .then(res.status(200).send(newCity));
                });
});

/**
 * @api {put} /city/:name Update City information
 * @apiName UpdateCity
 * @apiGroup City
 *
 * @apiParam {String} name The name of the city to update.
 * 
 * @apiBody {Number} Population Updated population of the City.
 *
 * @apiSuccess {Number} ID Id of the updated City.
 * @apiSuccess {String} Name Name of the updated City.
 * @apiSuccess {String} CountryCode Country code of the updated City.
 * @apiSuccess {String} District District of the updated City.
 * @apiSuccess {Number} Population Population of the updated City.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          ID: 4084,
 *          Name: "NewCity", 
 *          CountryCode: "NLD",
 *          District: "Noord-Holland",
 *          Population: 100
 *     }
 *
 * @apiError CityNotFound The name of the City was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "CityNotFound"
 *     }
 */
router.put("/:name", (req, res) => {
    const name = req.params.name;
    const newPopulation = req.body.population;
    console.log(name);
    console.log(newPopulation);
    knex("city").where("name", "=", name)
                .update({
                    population: newPopulation
                })
                .then(() => {
                    knex("city").where("name", "=", name)
                                .then((result) => {
                                    if(result != "") {
                                        res.status(200).send(result);
                                    } else {
                                        res.status(404).json({"error" : "CityNotFound"});
                                    }
                                });
                });
});

/**
 * @api {delete} /city/:name Delete City
 * @apiName DeleteCity
 * @apiGroup City
 *
 * @apiParam {String} name The name of the city to delete.
 *
 * @apiSuccess {Boolean} successful True if deleted successfully, false otherwise.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "successful": true
 *     }
 *
 * @apiError CityNotFound The name of the City was not found.
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "successful": false
 *     }
 */
router.delete("/:name", (req, res) => {
    const name = req.params.name;

    knex("city").where("name", "=", name)
                .del()
                .then(result => {
                    var successful = result > 0;

                    if(successful) {
                        res.status(200).send({"successful": successful});
                    } else {
                        res.status(404).send({"successful": successful});
                    };
                });
});

module.exports = router;