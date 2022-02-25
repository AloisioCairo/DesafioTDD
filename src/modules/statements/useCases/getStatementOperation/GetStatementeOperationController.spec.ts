import { Connection } from "typeorm";
import request from "supertest";
import { hash } from "bcryptjs";

import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;

describe('operation information', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase(); 
        await connection.close();
    })

    //     A rota recebe um token JWT pelo header e o id de uma operação registrada (saque ou depósito) na URL da rota e retorna as 
    // informações da operação encontrada.
    it("should return info the operation", async () => {
        const password = await hash("testeController", 8);

        const response = await request(app).post("/api/v1/users").send({
            name: "testee",
            email: "testee@teste.com.br",
            password: password
        });
        
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "testee@teste.com.br",
            password: password,
        });

        const { token } = responseToken.body;

        const deposit = await request(app).post("/api/v1/statements/deposit")
            .set('Authorization', token)
            .send({
                description: "DEPOSITO BANCÁRIO",
                amount: "400"
            });

        const info = await request(app).get(`/api/v1/statements/${deposit.body.id}`)
            .set('Authorization', token);

        expect(info.status).toBe(200);
    })
})