import express from "express";
import { RequestMapper } from "../service/mainService"

export const router = express.Router();

router.post('/api/files', async (req, res) => {
    try {
        if(req.body.domains) {
            const response = await RequestMapper(req.body.domains);
            res.status(200).json(response)
        } else {
            const response = await RequestMapper();
            res.status(200).json(response)
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
