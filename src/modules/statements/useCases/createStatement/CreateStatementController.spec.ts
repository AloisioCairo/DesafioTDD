import { Connection } from "typeorm";
import request from "supertest";
import { hash } from "bcryptjs";

import createConnection from "../../../../database";
import { app } from "../../../../app";
import { Console } from "console";

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

    // A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de depósito 
    // do valor e retorna as informações do depósito criado com status `201`.
    it("should return info the deposit operation creation", async () => {
        const password = await hash("testeController", 8);

        const response = await request(app).post("/api/v1/users").send({
            name: "aloisio1",
            email: "aloisio1@teste.com.br",
            password: password
        });
        
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "aloisio1@teste.com.br",
            password: password,
        });

        const { token } = responseToken.body;

        const deposit = await request(app).post("/api/v1/statements/deposit")
            .set('Authorization', token)
            .send({
                description: "DEPOSITO BANCÁRIO",
                amount: "400"
            });
        
        expect(deposit.status).toBe(201);
    })

    // A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de saque do 
    // valor (caso o usuário possua saldo válido) e retorna as informações do saque criado com status `201`. 
    // it("should return info the withdraw operation creation", async () => {
    //     const password = await hash("testeController", 8);

    //     const response = await request(app).post("/api/v1/users").send({
    //         name: "aloisio1",
    //         email: "aloisio5@teste.com.br",
    //         password: password
    //     });
        
    //     const responseToken = await request(app).post("/api/v1/sessions").send({
    //         email: "aloisio1@teste.com.br",
    //         password: password,
    //     });

    //     const { token } = responseToken.body;
                                                  
    //     const withdraw = await request(app).post("/api/v1/statements/withdraw")
    //         .set('Authorization', token)
    //         .send({
    //             description: "ALMOÇO",
    //             amount: "35"
    //         });
        
    //     expect(withdraw.status).toBe(201);
    // })
})