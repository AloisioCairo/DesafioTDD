import { Connection } from "typeorm";

import createConnection from "../../../../database";

let connection: Connection;

// A rota recebe um token JWT pelo header da requisição e retorna as informações do usuário autenticado.
describe('return info the user authenticat', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })

    it("should return info the user authenticat",  () => {

    })
})