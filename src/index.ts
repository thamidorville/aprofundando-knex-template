import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// Prática 1 - Refatorando /bands
//Refatore para query builder


app.get("/bands", async (req: Request, res: Response) => {
    try {
        // const result = await db.raw(`
        //     SELECT * FROM bands;
        // `)

        const result = await db.select("*").from("bands")
// const result = await db.select("name").from("bands") //retornando apenas a coluna name

        // const result = await db("bands") //forma abreviada

        res.status(200).send(result)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})



app.post("/bands", async (req: Request, res: Response) => {
    try {
        const id = req.body.id
        const name = req.body.name

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' inválido, deve ser string")
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error("'name' inválido, deve ser string")
        }

        if (id.length < 1 || name.length < 1) {
            res.status(400)
            throw new Error("'id' e 'name' devem possuir no mínimo 1 caractere")
        }

        // REFATORANDO O POST

        // await db.raw(`
        //     INSERT INTO bands (id, name)
        //     VALUES ("${id}", "${name}");
        // `)

                    //Pode ser desta forma
                //  await db("bands").insert({
                //     id,
                //     name
                // })

                    // ou desta:
                const newBands = {
                    id, 
                    name
                }
                await db("bands").insert(newBands)

            res.status(200).send("Banda cadastrada com sucesso")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
                //REFATORANDO PUT
app.put("/bands/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newId = req.body.id
        const newName = req.body.name

        if (newId !== undefined) {

            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

            if (newId.length < 1) {
                res.status(400)
                throw new Error("'id' deve possuir no mínimo 1 caractere")
            }
        }

        if (newName !== undefined) {

            if (typeof newName !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }

            if (newName.length < 1) {
                res.status(400)
                throw new Error("'name' deve possuir no mínimo 1 caractere")
            }
        }
                        //REFATORANDO PUT


        // const [ band ] = await db.raw(`
        //     SELECT * FROM bands
        //     WHERE id = "${idToEdit}";
        // `) // desestruturamos para encontrar o primeiro item do array
const [band] = await db("bands").where({id: idToEdit})
        if (band) {
            // await db.raw(`
            //     UPDATE bands
            //     SET
            //         id = "${newId || band.id}"
            //         name = "${newName || band.name}"
            //     WHERE
            //         id = "${idToEdit}";
            // `)

            const updateBand = {
              id: newId  || band.id,
              name: newName || band.name
            }
         await db("bands").update(updateBand).where({id: idToEdit})

        } else {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        res.status(200).send({ message: "Atualização realizada com sucesso" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//implemente o endpoint delete/bands/:id com query builder

app.delete("/bands/:id", async (req:Request, res:Response) => {
    try {
            const idToDelete = req.params.id 

            const [band] =  await db("bands").where({id:idToDelete})

            if(band){
                    await db("bands").del().where({id: idToDelete})
            }else{
                res.status(400)
                throw new Error("Id não encontrada");
            }
            res.status(200).send("Item deletado com sucesso")

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    
    }
})

//              EXERCÍCIO DE FIXAÇÃO
//          REFATORE OS 3 ENPOINTS DE /songs para query builder

app.get("/songs", async (req: Request, res: Response) => {
    try {
        // const result = await db.raw(`
        //     SELECT * FROM songs;
        // `)

        // const result = await db.select("*").from("songs")
        const result = await db("bands") //forma abreviada

        res.status(200).send(result)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/songs", async (req: Request, res: Response) => {
    try {
        const id = req.body.id
        const name = req.body.name
        const bandId = req.body.bandId

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' inválido, deve ser string")
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error("'name' inválido, deve ser string")
        }

        if (typeof bandId !== "string") {
            res.status(400)
            throw new Error("'bandId' inválido, deve ser string")
        }

        if (id.length < 1 || name.length < 1 || bandId.length < 1) {
            res.status(400)
            throw new Error("'id', 'name' e 'bandId' devem possuir no mínimo 1 caractere")
        }

        // await db.raw(`
        //     INSERT INTO songs (id, name, band_id)
        //     VALUES ("${id}", "${name}", "${bandId}");
        // `)
        const newSongs = {
            id, 
            name,
            bandId
        }
        await db("songs").insert(newSongs)
        res.status(200).send("Música cadastrada com sucesso")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
                //REFATORANDO O PUT /SONGS
app.put("/songs/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newId = req.body.id
        const newName = req.body.name
        const newBandId = req.body.bandId

        if (newId !== undefined) {

            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

            if (newId.length < 1) {
                res.status(400)
                throw new Error("'id' deve possuir no mínimo 1 caractere")
            }
        }

        if (newName !== undefined) {

            if (typeof newName !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }

            if (newName.length < 1) {
                res.status(400)
                throw new Error("'name' deve possuir no mínimo 1 caractere")
            }
        }

        if (newBandId !== undefined) {

            if (typeof newBandId !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }

            if (newBandId.length < 1) {
                res.status(400)
                throw new Error("'name' deve possuir no mínimo 1 caractere")
            }
        }

        // const [ song ] = await db.raw(`
        //     SELECT * FROM songs
        //     WHERE id = "${idToEdit}";
        // `) // desestruturamos para encontrar o primeiro item do array

        // if (song) {
        //     await db.raw(`
        //         UPDATE songs
        //         SET
        //             id = "${newId || song.id}",
        //             name = "${newName || song.name}",
        //             band_id = "${newBandId || song.band_id}"
        //         WHERE
        //             id = "${idToEdit}";
        //     `)

                    const [song] = await db("songs").where({id:idToEdit})
                    if(song){
                        const updateSong = {
                            id: newId || song.id,
                            name: newName || song.name,
                            band_id: newBandId || song.band_id
                        }
                        await db("songs").update(updateSong).where({id: idToEdit})
                                        
        } else {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        res.status(200).send({ message: "Atualização realizada com sucesso" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
