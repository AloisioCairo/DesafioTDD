import { Connection } from "typeorm";

import createConnection from "../../../../database";

let connection = Connection;

describe('Create user controller', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })
})