import { Connection } from "typeorm";
import request from "supertest";
import { hash } from "bcryptjs";

import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;

describe('operation creation', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase(); 
        await connection.close();
    })

    // A rota recebe um token JWT pelo header da requisição e retorna uma lista com todas as operações de depósito e saque do 
    // usuário autenticado e também o saldo total numa propriedade `balance`.
    it("should return info the balance", async () => {
        const password = await hash("testeController", 8);

        const response = await request(app).post("/api/v1/users").send({
            name: "Marina",
            email: "marina@teste.com.br",
            password: password
        });
        
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "marina@teste.com.br",
            password: password,
        });

        const { token } = responseToken.body;

        const deposit = await request(app).post("/api/v1/statements/deposit")
            .set('Authorization', token)
            .send({
                description: "DEPOSITO BANCÁRIO",
                amount: "400"
            });

        const balance = await request(app).get("/api/v1/statements/balance")
            .set('Authorization', token);

        expect(balance.status).toBe(200);
    })
})