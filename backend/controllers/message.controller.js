import { pusher } from "../server.js"

export const sendMessage = async (req, res) => {
    const body = req.body
    console.log("BODY",body)
    pusher.trigger(
        body.roomId,
        "sendMessage",
        {
            sender: body.sender,
            text: body.text
        }
    )
    res.status(200).send("Event triggered")
}