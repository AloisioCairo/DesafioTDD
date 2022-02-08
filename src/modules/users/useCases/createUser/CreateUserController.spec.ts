import { Connection } from "typeorm";
import request from "supertest";
import { hash } from "bcryptjs";

import createConnection from "../../../../database";
import { app } from "../../../../app"

let connection: Connection;

describe('Create user controller', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })

    // A rota recebe name, email e password dentro do corpo da requisição, salva o usuário criado no banco e retorna uma resposta vazia com status 201.
    it("should be able create user", async ()=> {
        const password = await hash("testeController", 8);

        const response = await request(app).post("/api/v1/users").send({
            name: "ALOISIO",
            email: "aloisio@teste.com.br",
            password: password
        });

        expect(response.status).toBe(201);
    })
})