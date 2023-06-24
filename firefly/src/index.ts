import FireFly from '@hyperledger/firefly-sdk';
const firefly = new FireFly({ host: "http://127.0.0.1:5001" });
import express from 'express'
var app = express();
import body from 'body-parser'
app.use(body())
app.use(body.urlencoded({ extended: true }))

app.post('/sendMessage', async (req, res) => {
    try {
        const { cid } = req.body;
        const message = await firefly.sendPrivateMessage({
            header: {
                tag: 'xyz',
                topics: ['text'],
            },
            group: {
                members: [
                    { identity: 'did:firefly:org/org_0ab85a' },
                    { identity: 'did:firefly:org/org_76fe5b' },
                ],
            },
            data: [
                { value: cid },
            ],
        });
        // return { type: 'message', id: message.header.id };
        res.send({ type: 'message', id: message.header.id })
    } catch (e) {
        res.send({ success: false, error: e })
    }
})
app.listen(8082, function () {
    console.log("Example app listening at 8082")
})
