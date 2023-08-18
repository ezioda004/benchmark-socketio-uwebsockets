import { Collection, Document, MongoClient } from "mongodb";

class Mongodb {

    client!: MongoClient;
    dataCollection!: Collection<Document>;

    constructor() {
        console.log("Mongodb constructor");
        this.connect();
    }

    async connect() {
        this.client = await MongoClient.connect("mongodb://localhost:27017");
        console.log("Connected to mongodb");
        this.dataCollection = this.client.db("pw").collection("data");
        this.dataCollection.createIndex({ "mId": 1 }, { unique: true });
        this.dataCollection.createIndex({ "sessionId": 1});
    }

    async findAndUpsert(query: any, update: any) {
        return this.dataCollection.findOneAndUpdate(query, update, { upsert: true });
    }

}

const mongoClient = new Mongodb();


export { mongoClient }