const express = require("express");
const prisma = require("./prisma");
const app = express();
const PORT = 3000;

// body parsing middleware
app.use(express.json());
app.use(require("morgan")("dev"))
// error handling middleware
app.use((error,req,res,next)=>{
    res.status(res.status||500).send({error:error})
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

// GET

app.get("/api/users", async (req, res, next) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users)
    } catch (error) {
        next(error)
    }
})

app.get("/api/places", async (req, res, next) => {
    try {
        const places = await prisma.place.findMany();
        res.json(places)
    } catch (error) {
        next(error)
    }
})

app.get("/api/vacations", async (req, res, next) => {
    try {
        const vacations = await prisma.vacation.findMany();
        res.json(vacations)
    } catch (error) {
        next(error)
    }
})
// POST
app.get("/api/users/:id/vacations", async (req, res, next) => {
    try {
        const userId = +req.params.id;
        const {placeId, travelDate} = req.body
        const vacation = await prisma.vacation.create({
            data:{
                userId,
                placeId,
                travelDate
            }
        })
        res.sendStatus(201)
        res.json(vacation)
    } catch (error) {
        next(error)
    }
})

// DELETE

app.delete("/api/users/:userId/vacations/:id", async (req, res, next) => {
try {
    const id = +req.params.id
    const vacationExists = await prisma.vacation.findFirst({where:{id}})
    if (!vacationExists)
    {
        return next({status:404,message:`Could not find vacation with id of ${id}`})
    }
    await prisma.vacation.delete({where:{id}})
    res.sendStatus(204)
} catch (error) {
    next(error)
}    
})
